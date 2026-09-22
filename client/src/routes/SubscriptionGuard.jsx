import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard enforcing active subscription on premium customer pages.
 * - If not logged in -> redirect /login
 * - If pending_payment -> redirect /payment
 * - If awaiting_verification -> redirect /payment/pending
 * - If active -> allow access
 * - If expired -> allows access to dashboard with renewal banner, but locks lessons/exams
 */
export default function SubscriptionGuard({ children, requireActiveOnly = false }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Administrators must use the admin portal
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const status = user?.subscription?.status || 'pending_payment';
  const isExpired =
    status === 'expired' ||
    (user?.subscription?.expiresAt && new Date(user.subscription.expiresAt) < new Date());

  // Expired users must NEVER access dashboard or premium pages; redirect to payment renewal menu
  if (isExpired) {
    return <Navigate to="/payment" state={{ expired: true }} replace />;
  }

  if (status === 'pending_payment') {
    return <Navigate to="/payment" replace />;
  }

  if (status === 'awaiting_verification') {
    return <Navigate to="/payment/pending" replace />;
  }

  return children;
}

