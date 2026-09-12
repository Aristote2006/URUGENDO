import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <footer className="bg-ink-50 dark:bg-ink-950 border-t border-ink-200 dark:border-ink-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Top */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-ink-200 dark:border-ink-800">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <img
                  src="/images/logo1.png"
                  alt="Urugendo Logo"
                  className="w-full h-full object-contain rounded-full drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-grotesk font-semibold text-lg tracking-tight">
                  Urugendo
                </span>
                <span className="text-[10px] text-ink-500 dark:text-ink-400 font-medium tracking-wider uppercase">
                  {t('nav.tagline')}
                </span>
              </div>
            </Link>
            <p className="text-ink-600 dark:text-ink-400 max-w-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center btn-ghost"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center btn-ghost"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center btn-ghost"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-200 dark:border-ink-800 flex items-center justify-center btn-ghost"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400 mb-5">
              {t('footer.platformTitle')}
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('nav.help')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400 mb-5">
              {t('footer.learnTitle')}
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('footer.trafficRules')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('footer.roadSigns')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('footer.practiceTests')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 transition-colors"
                >
                  {t('footer.mockExams')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400 mb-5">
              {t('footer.contactTitle')}
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-ink-700 dark:text-ink-300">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-500" />
                <a
                  href="mailto:rw.urugendo@gmail.com"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  rw.urugendo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-ink-700 dark:text-ink-300">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-500" />
                <a
                  href="tel:0732140720"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  0732140720
                </a>
              </li>
              <li className="flex items-start gap-2 text-ink-700 dark:text-ink-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-500" />
                Kigali, Rwanda
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-ink-500 dark:text-ink-400">
            <span>{t('footer.copyright')}</span>
            <span className="hidden sm:inline text-ink-300 dark:text-ink-700">•</span>
            <a
              href="https://aristote.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-dancing text-xl text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors font-semibold"
              title="Designed & Developed by Aristote"
            >
              Developed by Aristote
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-ink-500 dark:text-ink-400">
            <a href="#" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
              {t('footer.cookies')}
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'EN / KY' : 'KY / EN'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
