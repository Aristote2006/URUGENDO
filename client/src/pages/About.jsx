import React from 'react';
import {
  ShieldCheck,
  Languages,
  Smartphone,
  BookOpen,
  Award,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';

export default function About() {
  const { t } = useLanguage();
  const { openAuth } = useAuthModal();

  const stats = [
    {
      value: t('aboutPage.stats.learners'),
      label: t('aboutPage.stats.learnersLabel'),
    },
    {
      value: t('aboutPage.stats.passRate'),
      label: t('aboutPage.stats.passRateLabel'),
    },
    {
      value: t('aboutPage.stats.questions'),
      label: t('aboutPage.stats.questionsLabel'),
    },
    {
      value: t('aboutPage.stats.districts'),
      label: t('aboutPage.stats.districtsLabel'),
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: t('aboutPage.values.0.title'),
      desc: t('aboutPage.values.0.desc'),
    },
    {
      icon: Smartphone,
      title: t('aboutPage.values.1.title'),
      desc: t('aboutPage.values.1.desc'),
    },
    {
      icon: Languages,
      title: t('aboutPage.values.2.title'),
      desc: t('aboutPage.values.2.desc'),
    },
    {
      icon: BookOpen,
      title: t('aboutPage.values.3.title'),
      desc: t('aboutPage.values.3.desc'),
    },
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Urugendo Rwanda',
    description: t('seo.aboutDesc'),
    url: 'https://urugendo.rw/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Urugendo Education Rwanda',
      url: 'https://urugendo.rw',
      logo: 'https://urugendo.rw/images/logo1.png',
      foundingDate: '2023',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'KN 3 Ave',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+250 732 140 720',
        email: 'rw.urugendo@gmail.com',
        contactType: 'customer service',
        availableLanguage: ['en', 'rw'],
      },
    },
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDesc')}
        keywords="about urugendo, amategeko y'umuhanda history, rwanda road safety initiative, driver education rwanda, urugendo kigali"
        canonical="/about"
        schema={schemaData}
      />

      {/* Hero Header */}
      <section className="relative py-16 md:py-24 border-b border-ink-200 dark:border-ink-800 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 mb-6">
              <span className="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300">
                {t('aboutPage.badge')}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tightest leading-[1.05] mb-6">
              {t('aboutPage.title')}
            </h1>
            <p className="text-lg md:text-xl text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
              {t('aboutPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="border-b border-ink-200 dark:border-ink-800 bg-ink-100/60 dark:bg-ink-900/40 py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="font-grotesk font-bold text-3xl sm:text-4xl md:text-5xl text-brand-700 dark:text-brand-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-ink-600 dark:text-ink-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story & Video Showcase */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
                <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                  {t('aboutPage.storyBadge')}
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest mb-6">
                {t('aboutPage.storyTitle')}
              </h2>
              <div className="space-y-4 text-base md:text-lg text-ink-600 dark:text-ink-400 leading-relaxed">
                <p>{t('aboutPage.storyP1')}</p>
                <p>{t('aboutPage.storyP2')}</p>
                <p>{t('aboutPage.storyP3')}</p>
              </div>

              <div className="mt-8 flex items-center gap-6 pt-6 border-t border-ink-200 dark:border-ink-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Founded in Kigali</div>
                    <div className="text-xs text-ink-500">Rwanda National Reach</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
                    <Award className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Accredited Pedagogy</div>
                    <div className="text-xs text-ink-500">Official Highway Code</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-ink-200 dark:bg-ink-800 shadow-2xl border border-ink-200 dark:border-ink-800">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://player.vimeo.com/video/824804225?h=0&badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Urugendo — Our Journey and Vision"
                ></iframe>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
                <span>{t('about.videoNote')}</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2 mins overview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Principles & Values */}
      <section className="py-20 md:py-28 bg-ink-100/40 dark:bg-ink-900/30 border-y border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Core Beliefs
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mt-2 mb-4">
              {t('aboutPage.valuesTitle')}
            </h2>
            <p className="text-base text-ink-600 dark:text-ink-400">
              {t('aboutPage.valuesSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div
                  key={idx}
                  className="p-7 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl hover:border-brand-500/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-6">
                    <IconComp className="w-6 h-6 text-brand-700 dark:text-brand-300" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Call to Action */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mb-4">
            {t('aboutPage.teamTitle')}
          </h2>
          <p className="text-base md:text-lg text-ink-600 dark:text-ink-400 max-w-xl mx-auto mb-8 leading-relaxed">
            {t('aboutPage.teamSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="btn-primary px-6 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
            >
              {t('nav.services')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/help"
              className="btn-ghost px-6 py-3.5 rounded-xl font-semibold text-sm border border-ink-200 dark:border-ink-800 inline-flex items-center gap-2"
            >
              {t('nav.help')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

