import React from 'react';
import { Star } from 'lucide-react';
import { testimonialsData } from '../../data/testimonialsData';
import { useLanguage } from '../../context/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-ink-100/50 dark:bg-ink-900/40 border-y border-ink-200 dark:border-ink-800">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {t('testimonials.label')}
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02]">
              {t('testimonials.headlinePrefix')}
              <span className="font-grotesk italic font-medium text-brand-600 dark:text-brand-400">
                {t('testimonials.headlineSuffix')}
              </span>
            </h2>
          </div>
          <p className="text-ink-600 dark:text-ink-400 max-w-sm">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="testimonial-card p-7 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl"
            >
              <div className="flex gap-0.5 mb-5 text-brand-500">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 text-ink-700 dark:text-ink-300">
                {item.quote}
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-200 dark:border-ink-800">
                <div className="w-10 h-10 rounded-full bg-brand-200 dark:bg-brand-900 flex items-center justify-center font-semibold text-sm text-brand-900 dark:text-brand-100">
                  {item.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-xs text-ink-500 dark:text-ink-400">
                    {item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
