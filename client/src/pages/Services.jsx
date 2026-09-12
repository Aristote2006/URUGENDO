import React, { useState } from 'react';
import {
  BookOpen,
  TriangleAlert,
  ListChecks,
  GraduationCap,
  LineChart,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import { servicesData } from '../data/servicesData';

const iconMap = {
  BookOpen,
  TriangleAlert,
  ListChecks,
  GraduationCap,
  LineChart,
  Smartphone,
};

export default function Services() {
  const { t, lang } = useLanguage();
  const { openAuth } = useAuthModal();
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    {
      id: '1',
      name: t('servicesPage.modules.0.name'),
      desc: t('servicesPage.modules.0.desc'),
      lessons: 12,
      duration: '45 mins',
    },
    {
      id: '2',
      name: t('servicesPage.modules.1.name'),
      desc: t('servicesPage.modules.1.desc'),
      lessons: 18,
      duration: '1 hr 15 mins',
    },
    {
      id: '3',
      name: t('servicesPage.modules.2.name'),
      desc: t('servicesPage.modules.2.desc'),
      lessons: 14,
      duration: '50 mins',
    },
    {
      id: '4',
      name: t('servicesPage.modules.3.name'),
      desc: t('servicesPage.modules.3.desc'),
      lessons: 16,
      duration: '1 hr',
    },
    {
      id: '5',
      name: t('servicesPage.modules.4.name'),
      desc: t('servicesPage.modules.4.desc'),
      lessons: 10,
      duration: '40 mins',
    },
    {
      id: '6',
      name: t('servicesPage.modules.5.name'),
      desc: t('servicesPage.modules.5.desc'),
      lessons: 8,
      duration: '35 mins',
    },
  ];

  const steps = [
    {
      num: '01',
      title: t('servicesPage.steps.0.title'),
      desc: t('servicesPage.steps.0.desc'),
    },
    {
      num: '02',
      title: t('servicesPage.steps.1.title'),
      desc: t('servicesPage.steps.1.desc'),
    },
    {
      num: '03',
      title: t('servicesPage.steps.2.title'),
      desc: t('servicesPage.steps.2.desc'),
    },
    {
      num: '04',
      title: t('servicesPage.steps.3.title'),
      desc: t('servicesPage.steps.3.desc'),
    },
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Urugendo Driving Theory Services',
    serviceType: 'Driver Education & Traffic Rules E-Learning',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Urugendo',
      url: 'https://urugendo.rw',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Rwanda',
    },
    description: t('seo.servicesDesc'),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Rwandan Provisional Driving License Preparation Services',
      itemListElement: servicesData.map((item, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title={t('seo.servicesTitle')}
        description={t('seo.servicesDesc')}
        keywords="amategeko y'umuhanda services, rwanda traffic rules course, mock exam rwanda, provisional driving license services, urugendo services"
        canonical="/services"
        schema={schemaData}
      />

      {/* Hero Header */}
      <section className="relative py-16 md:py-24 border-b border-ink-200 dark:border-ink-800 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 mb-6">
              <Sparkles className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span className="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300">
                {t('servicesPage.badge')}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tightest leading-[1.05] mb-6">
              {t('servicesPage.title')}
            </h1>
            <p className="text-lg md:text-xl text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
              {t('servicesPage.subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openAuth('register')}
                className="btn-primary px-6 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 shadow-lg shadow-brand-900/10"
              >
                {t('servicesPage.startNow')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/help"
                className="btn-ghost px-6 py-3.5 rounded-xl font-semibold text-sm border border-ink-200 dark:border-ink-800 inline-flex items-center gap-2"
              >
                {t('nav.help')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings Grid */}
      <section className="py-20 md:py-28 bg-ink-100/40 dark:bg-ink-900/30 border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {t('services.label')}
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mb-4">
              {t('servicesPage.coreOfferingsTitle')}
            </h2>
            <p className="text-base md:text-lg text-ink-600 dark:text-ink-400">
              {t('servicesPage.coreOfferingsSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => {
              const IconComp = iconMap[service.icon] || BookOpen;
              return (
                <div
                  key={service.id}
                  className="service-card p-7 md:p-8 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 border border-brand-200/50 dark:border-brand-700/40 flex items-center justify-center mb-6">
                      <IconComp className="w-6 h-6 text-brand-700 dark:text-brand-300" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-3 tracking-tight">
                      {lang === 'rw' ? t(service.titleKey, service.title) : service.title}
                    </h3>
                    <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
                      {lang === 'rw' ? t(service.descKey, service.description) : service.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between text-xs font-medium text-brand-700 dark:text-brand-400">
                    <span>Feature 0{index + 1}</span>
                    <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Structured Curriculum Breakdown */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
                <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                  Curriculum
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mb-4">
                {t('servicesPage.curriculumTitle')}
              </h2>
              <p className="text-base text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
                {t('servicesPage.curriculumSubtitle')}
              </p>

              <div className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    RNP
                  </div>
                  <div className="font-semibold text-sm text-ink-900 dark:text-ink-100">
                    Official Exam Alignment
                  </div>
                </div>
                <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                  Questions are continually reviewed against the latest Presidential Decree governing Rwandan road traffic regulation (Amateka ya Perezida No 85/01).
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {modules.map((mod, idx) => {
                const isOpen = activeModule === mod.id;
                return (
                  <div
                    key={mod.id}
                    className="border border-ink-200 dark:border-ink-800 rounded-xl bg-ink-50 dark:bg-ink-950 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setActiveModule(isOpen ? null : mod.id)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-grotesk text-sm font-bold text-brand-700 dark:text-brand-400 w-7">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-display font-semibold text-base md:text-lg">
                            {mod.name}
                          </h4>
                          <span className="text-xs text-ink-500 dark:text-ink-400">
                            {mod.lessons} lessons · {mod.duration}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-ink-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-brand-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-ink-200/60 dark:border-ink-800/60">
                        <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                          {mod.desc}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Includes topic quizzes and video summaries</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Road to Passing */}
      <section className="py-20 md:py-28 bg-ink-100/50 dark:bg-ink-900/40 border-t border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Methodology
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mt-2 mb-4">
              {t('servicesPage.roadmapTitle')}
            </h2>
            <p className="text-base md:text-lg text-ink-600 dark:text-ink-400">
              {t('servicesPage.roadmapSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 md:p-7 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl relative group hover:border-brand-500/50 transition-colors"
              >
                <div className="font-grotesk font-bold text-3xl text-brand-600/30 dark:text-brand-400/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-4">
                  {step.num}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-ink-900 text-ink-50 dark:bg-brand-950 dark:border dark:border-brand-800 text-center max-w-4xl mx-auto">
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
              {t('servicesPage.ctaTitle')}
            </h3>
            <p className="text-ink-300 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              {t('servicesPage.ctaSubtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openAuth('register')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-brand-500 hover:bg-brand-400 text-white transition-all inline-flex items-center gap-2"
              >
                {t('servicesPage.startNow')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/help"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-ink-800 hover:bg-ink-700 text-ink-100 transition-all"
              >
                {t('servicesPage.tryMock')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

