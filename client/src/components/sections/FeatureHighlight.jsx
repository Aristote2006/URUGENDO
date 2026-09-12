import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function FeatureHighlight() {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('approach.step1Title'),
      desc: t('approach.step1Desc'),
    },
    {
      num: '02',
      title: t('approach.step2Title'),
      desc: t('approach.step2Desc'),
    },
    {
      num: '03',
      title: t('approach.step3Title'),
      desc: t('approach.step3Desc'),
    },
    {
      num: '04',
      title: t('approach.step4Title'),
      desc: t('approach.step4Desc'),
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Asymmetric image grid */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink-200 dark:bg-ink-800">
                <img
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"
                  alt="Driving lesson"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink-200 dark:bg-ink-800 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"
                  alt="Road safety"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink-200 dark:bg-ink-800 -mt-8">
                <img
                  src="https://images.unsplash.com/photo-1517296545836-5a43ec0e3f94?w=800&q=80"
                  alt="Traffic signs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink-200 dark:bg-ink-800">
                <img
                  src="https://images.unsplash.com/photo-1519972064555-542457463fc0?w=800&q=80"
                  alt="Rwandan road"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Text and steps */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {t('approach.label')}
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] mb-6">
              {t('approach.headlinePrefix')}
              <span className="font-grotesk italic font-medium text-brand-600 dark:text-brand-400">
                {t('approach.headlineSuffix')}
              </span>
            </h2>
            <p className="text-lg text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
              {t('approach.description')}
            </p>

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-4 p-5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950"
                >
                  <div className="font-grotesk font-semibold text-brand-600 dark:text-brand-400 text-lg">
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{step.title}</div>
                    <div className="text-sm text-ink-600 dark:text-ink-400">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
