import React from 'react';
import { ShieldCheck, Languages, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhoWeAre() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {t('about.label')}
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] mb-6">
              {t('about.headlinePrefix')}
              <span className="font-grotesk italic font-medium text-brand-600 dark:text-brand-400">
                {t('about.headlineSuffix')}
              </span>
            </h2>
            <p className="text-lg text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
              {t('about.p1')}
            </p>
            <p className="text-base text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
              {t('about.p2')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-brand-700 dark:text-brand-300" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t('about.feature1Title')}</div>
                  <div className="text-sm text-ink-500 dark:text-ink-400">
                    {t('about.feature1Desc')}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                  <Languages className="w-4 h-4 text-brand-700 dark:text-brand-300" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t('about.feature2Title')}</div>
                  <div className="text-sm text-ink-500 dark:text-ink-400">
                    {t('about.feature2Desc')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-ink-200 dark:bg-ink-800 shadow-xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://player.vimeo.com/video/824804225?h=0&badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Urugendo — Who we are"
              ></iframe>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
              <span>{t('about.videoNote')}</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{t('about.videoDuration')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
