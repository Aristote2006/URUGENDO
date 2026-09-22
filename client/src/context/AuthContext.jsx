import React, { createContext, useContext, useState, useEffect } from 'react';
import { plansConfig } from '../config/plans';

const AuthContext = createContext();

const STORAGE_KEY = 'urugendo_customer_user';
const TOKEN_KEY = 'urugendo_customer_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const fetchWithRetry = async (url, options, retries = 1) => {
  try {
    const res = await fetch(url, options);
    if (res.status === 502 && retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return await fetchWithRetry(url, options, retries - 1);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return await fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved user from localStorage', e);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Check and update expiration if active subscription reached expiration date
  useEffect(() => {
    if (user?.subscription?.status === 'active' && user.subscription.expiresAt) {
      const now = new Date();
      const expiry = new Date(user.subscription.expiresAt);
      if (now > expiry) {
        setUser((prev) => ({
          ...prev,
          subscription: {
            ...prev.subscription,
            status: 'expired',
          },
        }));
      }
    }
  }, [user?.subscription?.status, user?.subscription?.expiresAt]);

  // Validate session on mount with backend database
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser((prev) => ({
              ...prev,
              ...data.user,
              dashboard: prev?.dashboard || { hasCompletedTutorial: false },
            }));
          }
        } else if (res.status === 401 || res.status === 403) {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      } catch (err) {
        console.warn('[CustomerAuth] Could not verify session with backend:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Register a new customer via Backend API
   */
  const register = async ({ name, email, phone, password }) => {
    let res;
    try {
      res = await fetchWithRetry(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
    } catch (err) {
      console.error('[CustomerAuth] Register network error:', err);
      throw new Error('Cannot connect to the server. Please ensure the backend server is running on port 5000.');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed. Please check details.');
    }

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    const newUser = {
      ...data.user,
      dashboard: {
        hasCompletedTutorial: false,
      },
      progress: {
        completedLessons: [],
        completedExercises: 0,
        examAttempts: [],
        readinessScore: 0,
      },
    };

    setUser(newUser);
    return newUser;
  };

  /**
   * Login existing customer via Backend API
   * Strictly verifies credentials against MongoDB Atlas.
   * Throws an error on incorrect credentials.
   */
  const login = async (email, password) => {
    let res;
    try {
      res = await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.error('[CustomerAuth] Login network error:', err);
      throw new Error('Cannot connect to the server. Please ensure the backend server is running on port 5000.');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Invalid email or password.');
    }

    if (!data.token || !data.user) {
      throw new Error('Authentication failed: Missing token or user profile.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);

    const loggedUser = {
      ...data.user,
      dashboard: user?.dashboard || {
        hasCompletedTutorial: false,
      },
      progress: data.user.progress || {
        completedLessons: [],
        completedExercises: 0,
        examAttempts: [],
        readinessScore: 0,
      },
    };

    setUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  /**
   * Logout customer
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Select a learning plan
   */
  const selectPlan = (planId) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        plan: planId,
      },
    }));
  };

  /**
   * Submit payment proof
   * Stores in MongoDB Atlas and moves status to 'awaiting_verification'
   */
  const submitPaymentProof = async ({ paymentPhone, paymentMethod = 'mtn_momo', proofNote = '' }) => {
    if (!user) return;

    const token = localStorage.getItem(TOKEN_KEY);

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/payments/submit-proof`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: user.subscription?.plan || 'monthly',
            paymentPhone: paymentPhone || user.phone,
            paymentMethod,
            proofNote,
          }),
        });
      }
    } catch (err) {
      console.warn('[PaymentProof] Could not persist to backend:', err.message);
    }

    // Update local state
    setUser((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: 'awaiting_verification',
        paymentDetails: {
          phone: paymentPhone || prev.phone,
          method: paymentMethod,
          submittedAt: new Date().toISOString(),
          proofNote,
        },
      },
    }));
  };

  /**
   * Simulate Admin Verification (Testing Utility)
   */
  const simulateAdminVerify = (overridePlanId = null) => {
    if (!user) return;
    const planId = overridePlanId || user.subscription?.plan || 'monthly';
    const planDetails = plansConfig[planId] || plansConfig.monthly;
    const durationDays = planDetails.durationDays || 30;

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

    setUser((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        plan: planId,
        status: 'active',
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    }));
  };

  /**
   * Simulate Expired State
   */
  const simulateExpire = () => {
    if (!user) return;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    setUser((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: 'expired',
        expiresAt: yesterday.toISOString(),
      },
    }));
  };

  /**
   * Complete first-time dashboard tutorial
   */
  const completeTutorial = () => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        hasCompletedTutorial: true,
      },
    }));
  };

  /**
   * Replay dashboard tutorial
   */
  const replayTutorial = () => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        hasCompletedTutorial: false,
      },
    }));
  };

  /**
   * Mark lesson completed
   */
  const markLessonComplete = (lessonId) => {
    if (!user) return;
    const currentCompleted = user.progress?.completedLessons || [];
    if (currentCompleted.includes(lessonId)) return;

    const updated = [...currentCompleted, lessonId];
    const newReadiness = Math.min(
      100,
      Math.round((updated.length / 8) * 50 + (user.progress?.completedExercises || 0) * 0.5)
    );

    setUser((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        completedLessons: updated,
        readinessScore: newReadiness,
      },
    }));
  };

  /**
   * Record practice exercise completion
   */
  const recordExerciseDone = () => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        completedExercises: (prev.progress?.completedExercises || 0) + 1,
        readinessScore: Math.min(100, (prev.progress?.readinessScore || 0) + 2),
      },
    }));
  };

  /**
   * Record mock exam attempt
   */
  const recordExamAttempt = ({ examId, score, total = 20, passed }) => {
    if (!user) return;
    const attempt = {
      examId,
      score,
      total,
      passed,
      percentage: Math.round((score / total) * 100),
      date: new Date().toISOString(),
    };

    const updatedAttempts = [attempt, ...(user.progress?.examAttempts || [])];
    const newReadiness = Math.min(
      100,
      Math.max(user.progress?.readinessScore || 0, attempt.percentage)
    );

    setUser((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        examAttempts: updatedAttempts,
        readinessScore: newReadiness,
      },
    }));
  };

  /**
   * Refreshes user profile from backend database
   */
  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const updated = {
            ...data.user,
            dashboard: user?.dashboard || { hasCompletedTutorial: false },
          };
          setUser(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
      }
    } catch (err) {
      console.warn('[CustomerAuth] Could not refresh user:', err.message);
    }
    return null;
  };

  /**
   * Check latest payment and subscription status with backend
   */
  const checkPaymentStatus = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/payments/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const { user: updatedUserData } = result.data;
          if (updatedUserData) {
            setUser((prev) => {
              const updated = {
                ...prev,
                ...updatedUserData,
                dashboard: prev?.dashboard || { hasCompletedTutorial: false },
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              return updated;
            });
          }
          return result.data;
        }
      }
    } catch (err) {
      console.warn('[CustomerAuth] Check payment status error:', err.message);
    }
    return null;
  };

  /**
   * Update profile information
   */
  const updateProfile = ({ name, phone }) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      name: name ? name.trim() : prev.name,
      phone: phone ? phone.trim() : prev.phone,
    }));
  };

  const isAuthenticated = !!user;
  const isSubscriptionActive = user?.subscription?.status === 'active';
  const isAwaitingVerification = user?.subscription?.status === 'awaiting_verification';
  const isPendingPayment = user?.subscription?.status === 'pending_payment';
  const isExpired = user?.subscription?.status === 'expired';
  const isRejected = user?.subscription?.status === 'rejected';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSubscriptionActive,
        isAwaitingVerification,
        isPendingPayment,
        isExpired,
        isRejected,
        isLoading,
        register,
        login,
        logout,
        selectPlan,
        submitPaymentProof,
        refreshUser,
        checkPaymentStatus,
        simulateAdminVerify,
        simulateExpire,
        completeTutorial,
        replayTutorial,
        markLessonComplete,
        recordExerciseDone,
        recordExamAttempt,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
