import React, { useState, useEffect } from 'react';
import { Globe, Sun, Moon, ArrowRight, Menu } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthModal } from '../../context/AuthModalContext';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const { openAuth } = useAuthModal();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-brand-700 dark:text-brand-300 font-semibold bg-brand-50/80 dark:bg-brand-950/50'
        : 'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-ink-100/50 dark:hover:bg-ink-900/50'
    }`;

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 nav-blur bg-ink-50/70 dark:bg-ink-950/70 border-b border-ink-200/60 dark:border-ink-800/60 transition-shadow duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <img
                  src="/images/logo1.png"
                  alt="Urugendo Logo"
                  className="w-full h-full object-contain rounded-full drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-grotesk font-semibold text-lg tracking-tight">Urugendo</span>
                <span className="text-[10px] text-ink-500 dark:text-ink-400 font-medium tracking-wider uppercase">
                  {t('nav.tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/services" className={navLinkClass}>
                {t('nav.services')}
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                {t('nav.about')}
              </NavLink>
              <NavLink to="/help" className={navLinkClass}>
                {t('nav.help')}
              </NavLink>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Language */}
              <button
                id="langBtn"
                onClick={toggleLang}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 btn-ghost rounded-lg"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span id="langLabel">{lang === 'en' ? 'EN' : 'KY'}</span>
              </button>

              {/* Theme */}
              <button
                id="themeBtn"
                onClick={toggleTheme}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center btn-ghost rounded-lg"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Moon className="w-4 h-4 text-ink-50" />
                ) : (
                  <Sun className="w-4 h-4 text-ink-900" />
                )}
              </button>

              {/* Login */}
              <button
                onClick={() => openAuth('login')}
                className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 btn-ghost rounded-lg"
              >
                {t('nav.login')}
              </button>

              {/* Register */}
              <button
                onClick={() => openAuth('register')}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold btn-primary rounded-lg"
              >
                {t('nav.getStarted')}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button
                id="mobileMenuBtn"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center btn-ghost rounded-lg"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
