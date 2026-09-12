import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { isOpen, authTab, closeAuth, switchTab } = useAuthModal();
  const { t, lang } = useLanguage();
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agree: false,
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) {
      setErrorMsg(
        lang === 'rw'
          ? 'Nyamuneka uzuza imyirondoro yose isabwa.'
          : 'Please complete all required fields.'
      );
      return;
    }

    try {
      setLoading(true);
      await register({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      });

      closeAuth();
      navigate('/payment');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginForm.email || !loginForm.password) {
      setErrorMsg(
        lang === 'rw'
          ? 'Nyamuneka andika imeli n’ijambo ry’ibanga.'
          : 'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);
      const res = await login(loginForm.email, loginForm.password);
      if (res?.success) {
        closeAuth();
        const userStatus = res.user?.subscription?.status;
        if (userStatus === 'active') {
          navigate('/dashboard');
        } else if (userStatus === 'awaiting_verification') {
          navigate('/payment/pending');
        } else if (userStatus === 'pending_payment') {
          navigate('/payment');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(
        err.message ||
          (lang === 'rw'
            ? 'Imeli cyangwa ijambo ryibanga sibyo.'
            : 'Invalid email or password.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="authModal" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="modal-backdrop absolute inset-0 bg-ink-900/40 dark:bg-black/60"
        onClick={closeAuth}
      />

      <div className="relative w-full max-w-md bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-2xl my-8 z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center btn-ghost rounded-lg z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                src="/images/logo1.png"
                alt="Urugendo Logo"
                className="w-full h-full object-contain rounded-full drop-shadow-sm"
              />
            </div>
            <span className="font-grotesk font-semibold text-base tracking-tight">
              Urugendo
            </span>
          </div>

          {/* Error message banner */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 leading-relaxed animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-ink-100 dark:bg-ink-900 rounded-xl mb-6">
            <button
              id="tabRegister"
              onClick={() => {
                setErrorMsg('');
                switchTab('register');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                authTab === 'register'
                  ? 'bg-ink-50 dark:bg-ink-950 shadow-sm text-ink-900 dark:text-ink-50'
                  : 'text-ink-600 dark:text-ink-400'
              }`}
            >
              {t('auth.registerTab')}
            </button>
            <button
              id="tabLogin"
              onClick={() => {
                setErrorMsg('');
                switchTab('login');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                authTab === 'login'
                  ? 'bg-ink-50 dark:bg-ink-950 shadow-sm text-ink-900 dark:text-ink-50'
                  : 'text-ink-600 dark:text-ink-400'
              }`}
            >
              {t('auth.loginTab')}
            </button>
          </div>

          {/* Register Panel */}
          {authTab === 'register' && (
            <div id="panelRegister" className="tab-panel active">
              <div className="mb-5">
                <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1">
                  {t('auth.registerTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400">
                  {t('auth.registerSubtitle')}
                </p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">
                    {t('auth.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    className="input-field w-full px-3.5 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                    placeholder={t('auth.fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    className="input-field w-full px-3.5 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">
                    {lang === 'rw' ? 'Nimero ya Telefoni (MoMo / Airtel)' : 'Phone Number (MoMo / Airtel)'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, phone: e.target.value })
                    }
                    className="input-field w-full px-3.5 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                    placeholder="0784227283"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">
                    {t('auth.password')}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      className="input-field w-full pl-3.5 pr-10 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                      placeholder={t('auth.passwordPlaceholderReg')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 p-1 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 focus:outline-none transition-colors"
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={registerForm.agree}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, agree: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded accent-brand-600"
                  />
                  <span className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                    {t('auth.termsAgree')}
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-semibold btn-primary rounded-xl flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.createAccountBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <p className="text-xs text-center text-ink-500 dark:text-ink-400 mt-5">
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="font-semibold text-ink-900 dark:text-ink-50 underline"
                >
                  {t('auth.orLogin')}
                </button>
              </p>
            </div>
          )}

          {/* Login Panel */}
          {authTab === 'login' && (
            <div id="panelLogin" className="tab-panel active">
              <div className="mb-5">
                <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1">
                  {t('auth.loginTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400">
                  {t('auth.loginSubtitle')}
                </p>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="input-field w-full px-3.5 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300">
                      {t('auth.password')}
                    </label>
                    <a
                      href="/help"
                      onClick={closeAuth}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {t('auth.forgotPassword')}
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className="input-field w-full pl-3.5 pr-10 py-2.5 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                      placeholder={t('auth.passwordPlaceholderLog')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 p-1 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 focus:outline-none transition-colors"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, remember: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-brand-600"
                  />
                  <span className="text-xs text-ink-600 dark:text-ink-400">
                    {t('auth.keepLoggedIn')}
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-semibold btn-primary rounded-xl flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.loginBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <p className="text-xs text-center text-ink-500 dark:text-ink-400 mt-5">
                {t('auth.newToUrugendo')}{' '}
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="font-semibold text-ink-900 dark:text-ink-50 underline"
                >
                  {t('auth.orRegister')}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
