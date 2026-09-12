import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Lock, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { t, lang } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError(
        lang === 'rw'
          ? 'Nyamuneka uzuza imyirondoro yose isabwa.'
          : 'Please fill in all required fields.'
      );
      return;
    }

    if (password.length < 8) {
      setError(
        lang === 'rw'
          ? 'Ijambo ryibanga rigomba kugira byibura inyuguti 8.'
          : 'Password must be at least 8 characters long.'
      );
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, phone, password });
      // Registration successful -> Plan Selection (/payment)
      navigate('/payment');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-5 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-xl p-7 md:p-9">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/" className="flex items-center gap-2">
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
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-1.5">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
              {t('auth.fullName')}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-3 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                placeholder={t('auth.fullNamePlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-3 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
              {lang === 'rw' ? 'Nimero ya Telefone' : 'Phone Number'}
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-3 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                placeholder="078... cyangwa 073..."
              />
            </div>
            <p className="text-[11px] text-ink-400 mt-1">
              {lang === 'rw'
                ? 'Iyi nimero izakoreshwa mu kwemeza ubwishyu bwawe.'
                : 'This phone number will be matched to verify your Mobile Money payment.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pl-10 pr-11 py-3 text-sm bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl focus:outline-none"
                placeholder={t('auth.passwordPlaceholderReg')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
              {t('auth.termsAgree')}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold btn-primary rounded-xl flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
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

        <p className="text-xs text-center text-ink-500 dark:text-ink-400 mt-6">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link
            to="/login"
            className="font-semibold text-ink-900 dark:text-ink-50 underline"
          >
            {t('auth.orLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
