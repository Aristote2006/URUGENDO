import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ListChecks,
  LineChart,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { plansConfig } from '../config/plans';
import DashboardTutorial from '../components/dashboard/DashboardTutorial';

export default function DashboardLayout() {
  const { user, logout, isExpired, replayTutorial } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const planId = user?.subscription?.plan || 'monthly';
  const planDetails = plansConfig[planId] || plansConfig.monthly;

  // Calculate remaining days
  const getRemainingDays = () => {
    if (!user?.subscription?.expiresAt) return 0;
    const diffMs = new Date(user.subscription.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const remainingDays = getRemainingDays();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: lang === 'rw' ? 'Ahabanza' : 'Dashboard',
    },
    {
      to: '/learning',
      icon: BookOpen,
      label: lang === 'rw' ? 'Amasomo' : 'Learning',
    },
    {
      to: '/mock-exams',
      icon: GraduationCap,
      label: lang === 'rw' ? 'Ibizamini' : 'Mock Exams',
    },
    {
      to: '/exercises',
      icon: ListChecks,
      label: lang === 'rw' ? 'Imyitozo' : 'Exercises',
    },
    {
      to: '/progress',
      icon: LineChart,
      label: lang === 'rw' ? 'Iterambere' : 'My Progress',
    },
    {
      to: '/profile',
      icon: User,
      label: lang === 'rw' ? 'Umwirondoro' : 'Profile',
    },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
      isActive
        ? 'bg-brand-600 text-white font-semibold shadow-sm'
        : 'text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-900/60 hover:text-ink-950 dark:hover:text-ink-50'
    }`;

  return (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-50">
      {/* First-Time Dashboard Tutorial Component */}
      <DashboardTutorial />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/80 p-5 fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Brand Logo Header */}
          <Link to="/dashboard" className="flex items-center gap-2.5 mb-8 px-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <img
                src="/images/logo1.png"
                alt="Urugendo Logo"
                className="w-full h-full object-contain rounded-full drop-shadow-sm group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-grotesk font-semibold text-lg tracking-tight">Urugendo</span>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold tracking-wider uppercase">
                Student Learning
              </span>
            </div>
          </Link>

          {/* Current Subscription Status Badge */}
          <div className="p-3.5 rounded-2xl bg-ink-100/70 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 mb-6">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-ink-500 dark:text-ink-400">Current Plan</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isExpired
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300'
                }`}
              >
                {isExpired ? 'Expired' : 'Active'}
              </span>
            </div>
            <div className="font-display font-bold text-sm text-ink-900 dark:text-ink-100">
              {lang === 'rw' ? planDetails.nameRw : planDetails.name}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between">
              <span>{isExpired ? 'Access expired' : `${remainingDays} days remaining`}</span>
              {isExpired ? (
                <Link to="/payment" className="text-brand-600 font-bold hover:underline">
                  Renew
                </Link>
              ) : null}
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} className={navLinkClass}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-ink-200 dark:border-ink-800 space-y-3">
          {/* Tutorial Replay Button */}
          <button
            onClick={replayTutorial}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-900 flex items-center gap-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Platform Guide Walkthrough</span>
          </button>

          {/* User profile row & logout */}
          <div className="flex items-center justify-between pt-2">
            <Link to="/profile" className="flex items-center gap-2.5 text-left group">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col leading-tight max-w-[110px] overflow-hidden">
                <span className="text-xs font-semibold text-ink-900 dark:text-ink-100 truncate group-hover:text-brand-600">
                  {user?.name || 'Student'}
                </span>
                <span className="text-[10px] text-ink-500 truncate">{user?.email}</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 md:h-20 border-b border-ink-200 dark:border-ink-800 bg-ink-50/80 dark:bg-ink-950/80 backdrop-blur-md sticky top-0 z-20 px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl btn-ghost border border-ink-200 dark:border-ink-800"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest hidden sm:inline">
                Urugendo Learning
              </span>
              <span className="text-ink-300 dark:text-ink-700 hidden sm:inline">/</span>
              <h2 className="font-display font-bold text-base md:text-lg">Student Portal</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Subscription renew button if expired or expiring */}
            {isExpired ? (
              <Link
                to="/payment"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
              >
                <span>Renew Subscription</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : null}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-700 dark:text-ink-300 btn-ghost rounded-lg border border-ink-200 dark:border-ink-800"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'EN' : 'KY'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center btn-ghost rounded-lg border border-ink-200 dark:border-ink-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Expired Subscription Banner if applicable */}
        {isExpired && (
          <div className="bg-red-500 text-white px-5 py-3 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Your subscription plan has expired. Please renew your plan to continue accessing lessons and mock exams.</span>
            </div>
            <Link to="/payment" className="underline font-bold hover:text-red-100 flex-shrink-0 ml-4">
              Renew Plan &rarr;
            </Link>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Outlet />
        </main>

        {/* Touch-Friendly Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink-50/95 dark:bg-ink-950/95 backdrop-blur-md border-t border-ink-200 dark:border-ink-800 flex items-center justify-around py-2 px-2 shadow-2xl">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-ink-500 dark:text-ink-400 hover:text-ink-950 dark:hover:text-ink-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[80vw] bg-ink-50 dark:bg-ink-950 p-6 flex flex-col justify-between border-r border-ink-200 dark:border-ink-800 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <img src="/images/logo1.png" alt="Urugendo" className="w-8 h-8 rounded-full" />
                  <span className="font-grotesk font-bold text-lg">Urugendo</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg btn-ghost"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={navLinkClass}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-ink-200 dark:border-ink-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  replayTutorial();
                }}
                className="w-full text-left py-2 text-xs font-semibold text-brand-600 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Show Guided Tour</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 text-xs font-semibold text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

