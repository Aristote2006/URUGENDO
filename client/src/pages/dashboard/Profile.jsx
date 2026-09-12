import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Clock,
  Sparkles,
  HelpCircle,
  LogOut,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Edit3,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { plansConfig, paymentInstructions } from '../../config/plans';

export default function Profile() {
  const {
    user,
    logout,
    updateProfile,
    replayTutorial,
    isSubscriptionActive,
    isExpired,
  } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const planId = user?.subscription?.plan || 'monthly';
  const planDetails = plansConfig[planId] || plansConfig.monthly;

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!user?.subscription?.expiresAt) return 0;
    const now = new Date();
    const expiry = new Date(user.subscription.expiresAt);
    const diffTime = expiry - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysRemaining();

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReplayTutorial = () => {
    replayTutorial();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // WhatsApp Support Link
  const whatsappUrl = `https://wa.me/${paymentInstructions.whatsappSupportNumber}?text=${encodeURIComponent(
    `Muraho Urugendo, Nitwa ${user?.name || ''} (${user?.phone || ''}). Nkeneye ubufasha kuri konti yange.`
  )}`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 mb-1">
          <User className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Konti Yange' : 'Account Management'}</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          {lang === 'rw' ? 'Umwirondoro wange' : 'Customer Profile'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'rw'
            ? 'Reba amakuru yawe bwite, imiterere y’ifatabuguzi, n’uburyo wishyuye.'
            : 'Manage your personal credentials, subscription status, and payment history.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>
            {lang === 'rw'
              ? 'Amakuru yawe yavuguruwe neza!'
              : 'Your profile details have been saved successfully!'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info & Edit */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {user?.name || 'Customer'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'rw' ? 'Umunyeshuri wiyandikishije' : 'Registered Driver Trainee'}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'rw' ? 'Hindura' : 'Edit Profile'}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'rw' ? 'Amazina Yombi' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'rw' ? 'Nimero ya Telefoni' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'rw' ? 'Imeli (Ntishobora guhinduka)' : 'Email (Cannot be changed)'}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'rw' ? 'Bika impinduka' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: user?.name || '', phone: user?.phone || '' });
                      setIsEditing(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all"
                  >
                    {lang === 'rw' ? 'Hagarika' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'rw' ? 'Amazina Yombi' : 'Full Name'}
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    {user?.name || '—'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'rw' ? 'Nimero ya Telefoni' : 'Phone Number'}
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-700 dark:text-brand-400" />
                    <span>{user?.phone || '—'}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'rw' ? 'Imeli' : 'Email Address'}
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-brand-700 dark:text-brand-400 flex-shrink-0" />
                    <span className="truncate">{user?.email || '—'}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'rw' ? 'Ubwoko bwa Konti' : 'Account Role'}
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Student / Trainee</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              {lang === 'rw' ? 'Ibyo wakora byihuse' : 'Quick Account Actions'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleReplayTutorial}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 block">
                    {lang === 'rw' ? 'Ongera urebe Tutorial' : 'Replay Tutorial'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'rw'
                      ? 'Reba intambwe 8 zo gukoresha dashboard'
                      : 'Review the 8-step dashboard guide'}
                  </span>
                </div>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 block">
                    {lang === 'rw' ? 'Ubufasha bwa WhatsApp' : 'WhatsApp Support'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    0784227283 (Instant response)
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Payment Details */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {lang === 'rw' ? 'Ifatabuguzi Ryawe' : 'Subscription Status'}
              </span>

              {isSubscriptionActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE</span>
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>EXPIRED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>PENDING</span>
                </span>
              )}
            </div>

            {/* Plan Info */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'rw' ? 'Plan wahisemo:' : 'Enrolled Plan:'}
              </span>
              <div className="flex items-baseline justify-between">
                <h4 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  {lang === 'rw' ? planDetails.nameRw : planDetails.name}
                </h4>
                <span className="font-bold text-brand-700 dark:text-brand-400">
                  {planDetails.price?.toLocaleString()} RWF
                </span>
              </div>
            </div>

            {/* Expiry Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {lang === 'rw' ? 'Iminsi isigaye' : 'Time Remaining'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {isSubscriptionActive
                    ? `${daysRemaining} ${lang === 'rw' ? 'iminsi' : 'days'}`
                    : lang === 'rw' ? 'Yahagaze' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {lang === 'rw' ? 'Izarangira ku' : 'Expires on'}
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {user?.subscription?.expiresAt
                    ? new Date(user.subscription.expiresAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>

            {/* Payment Record */}
            {user?.subscription?.paymentDetails && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{lang === 'rw' ? 'Telefoni yishyuwe' : 'Payment phone'}:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user.subscription.paymentDetails.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'rw' ? 'Uburyo' : 'Method'}:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">
                    {user.subscription.paymentDetails.method || 'MOMO'}
                  </span>
                </div>
              </div>
            )}

            {/* Renew Button */}
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isExpired
                  ? lang === 'rw' ? 'Vugurura Ifatabuguzi' : 'Renew Subscription'
                  : lang === 'rw' ? 'Hindura Plan' : 'Upgrade / Change Plan'}
              </span>
            </button>
          </div>

          {/* Logout Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Sohoka muri Konti (Logout)' : 'Sign Out of Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

