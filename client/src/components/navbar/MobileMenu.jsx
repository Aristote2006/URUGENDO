import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthModal } from '../../context/AuthModalContext';

export default function MobileMenu({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { openAuth } = useAuthModal();

  const handleLinkClick = () => {
    onClose();
  };

  const handleAuthAction = (tab) => {
    onClose();
    openAuth(tab);
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-3 text-base font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-brand-700 dark:text-brand-300 font-semibold bg-brand-50 dark:bg-brand-950/60'
        : 'btn-ghost text-ink-700 dark:text-ink-300'
    }`;

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/30 dark:bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        id="mobileMenu"
        className={`mobile-menu fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 bg-ink-50 dark:bg-ink-950 border-l border-ink-200 dark:border-ink-800 shadow-2xl ${
          isOpen ? 'open' : ''
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-200 dark:border-ink-800">
          <span className="font-grotesk font-semibold text-lg">Menu</span>
          <button
            id="closeMobileMenu"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center btn-ghost rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-5 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            onClick={handleLinkClick}
            className={navLinkClass}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/services"
            onClick={handleLinkClick}
            className={navLinkClass}
          >
            {t('nav.services')}
          </NavLink>
          <NavLink
            to="/about"
            onClick={handleLinkClick}
            className={navLinkClass}
          >
            {t('nav.about')}
          </NavLink>
          <NavLink
            to="/help"
            onClick={handleLinkClick}
            className={navLinkClass}
          >
            {t('nav.help')}
          </NavLink>
          <div className="h-px bg-ink-200 dark:bg-ink-800 my-3"></div>
          <button
            onClick={() => handleAuthAction('login')}
            className="px-4 py-3 text-base font-medium text-left rounded-lg btn-ghost"
          >
            {t('nav.login')}
          </button>
          <button
            onClick={() => handleAuthAction('register')}
            className="mt-2 px-4 py-3 text-base font-semibold btn-primary rounded-lg flex items-center justify-center gap-2"
          >
            {t('nav.getStarted')} <ArrowRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </>
  );
}
