import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { Link } from 'react-router-dom';

export default function CTA() {
  const { t } = useLanguage();
  const { openAuth } = useAuthModal();

  return (
    <section className="py-24 md:py-32 bg-ink-900 dark:bg-ink-950 text-ink-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] mb-6">
          {t('cta.headlinePrefix')}
          <span className="font-grotesk italic font-medium text-brand-300">
            {t('cta.headlineSuffix')}
          </span>
        </h2>
        <p className="text-lg md:text-xl text-ink-300 max-w-xl mx-auto mb-10">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => openAuth('register')}
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold bg-ink-50 text-ink-900 rounded-xl hover:bg-brand-100 transition-all"
          >
            {t('cta.primaryBtn')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold border border-ink-700 rounded-xl hover:bg-ink-800 transition-all"
          >
            {t('cta.secondaryBtn')}
          </Link>
        </div>
      </div>
    </section>
  );
}
