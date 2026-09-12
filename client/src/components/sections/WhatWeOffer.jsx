import React from 'react';
import {
  BookOpen,
  TriangleAlert,
  ListChecks,
  GraduationCap,
  LineChart,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const iconMap = {
  BookOpen,
  TriangleAlert,
  ListChecks,
  GraduationCap,
  LineChart,
  Smartphone,
};

export default function WhatWeOffer() {
  const { t } = useLanguage();

  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-ink-100/50 dark:bg-ink-900/40 border-y border-ink-200 dark:border-ink-800 relative"
    >
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              {t('services.label')}
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] mb-6">
            {t('services.headlinePrefix')}
            <span className="font-grotesk italic font-medium text-brand-600 dark:text-brand-400">
              {t('services.headlineSuffix')}
            </span>
          </h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 leading-relaxed">
            {t('services.description')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {servicesData.map((service) => {
            const IconComponent = iconMap[service.icon] || BookOpen;
            return (
              <div
                key={service.id}
                className="service-card group p-6 md:p-8 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-6">
                  <IconComponent className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-ink-50 border-b border-ink-900 dark:border-ink-50 pb-1"
          >
            {t('services.exploreAll')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
