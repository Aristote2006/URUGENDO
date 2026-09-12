import React, { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { slidesData } from '../../data/slidesData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] pt-20 md:pt-24 overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {slidesData.map((slide, idx) => (
          <div
            key={slide.id}
            className={`slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.url}')` }}
            aria-hidden={idx !== currentSlide}
          />
        ))}
        <div className="hero-gradient absolute inset-0"></div>
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slidesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`slide-dot w-8 h-0.5 rounded-full slide-indicator transition-all duration-300 ${
              idx === currentSlide
                ? 'bg-ink-900 dark:bg-ink-50'
                : 'bg-ink-900/30 dark:bg-ink-50/30 hover:bg-ink-900/50 dark:hover:bg-ink-50/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-50/80 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span className="text-xs font-medium text-ink-700 dark:text-ink-300 tracking-wide">
              {t('hero.badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tightest mb-6">
            <span className="block">{t('hero.headlineLine1')}</span>
            <span className="block text-brand-600 dark:text-brand-400 font-grotesk italic font-medium">
              {t('hero.headlineLine2')}
            </span>
            <span className="block">{t('hero.headlineLine3')}</span>
            <span className="block">{t('hero.headlineLine4')}</span>
            <span className="block">{t('hero.headlineLine5')}</span>
          </h1>

          <p className="text-lg md:text-xl text-ink-600 dark:text-ink-400 max-w-xl mb-10 leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <button
              onClick={() => openAuth('register')}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold btn-primary rounded-xl"
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold border border-ink-300 dark:border-ink-700 rounded-xl btn-ghost"
            >
              <Play className="w-4 h-4" />
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-xl">
            <div>
              <div className="font-grotesk font-semibold text-2xl md:text-3xl tracking-tight">
                1,200+
              </div>
              <div className="text-xs md:text-sm text-ink-500 dark:text-ink-400 mt-1">
                {t('hero.statQuestions')}
              </div>
            </div>
            <div>
              <div className="font-grotesk font-semibold text-2xl md:text-3xl tracking-tight">
                100%
              </div>
              <div className="text-xs md:text-sm text-ink-500 dark:text-ink-400 mt-1">
                {t('hero.statBilingual')}
              </div>
            </div>
            <div>
              <div className="font-grotesk font-semibold text-2xl md:text-3xl tracking-tight">
                24/7
              </div>
              <div className="text-xs md:text-sm text-ink-500 dark:text-ink-400 mt-1">
                {t('hero.statLearn')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-ink-500 dark:text-ink-400 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase">{t('hero.scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-ink-400 to-transparent"></div>
      </div>
    </section>
  );
}
