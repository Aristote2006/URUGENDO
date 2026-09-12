import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Search,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import { faqData } from '../data/faqData';

export default function Help() {
  const { t, lang } = useLanguage();
  const { openAuth } = useAuthModal();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(null);

  // Video chapters
  const chapters = useMemo(() => [
    {
      time: '0:00',
      seconds: 0,
      title: t('helpPage.chapters.0.label'),
      desc: lang === 'rw' ? 'Gufungura konti no gushyiraho ururimi rwawe.' : 'Signing up with email/phone and choosing language.',
    },
    {
      time: '0:55',
      seconds: 55,
      title: t('helpPage.chapters.1.label'),
      desc: lang === 'rw' ? 'Kugenzura amasomo, ibimenyetso n’ibyapa byose.' : 'Browsing structured modules and interactive road signs.',
    },
    {
      time: '1:45',
      seconds: 105,
      title: t('helpPage.chapters.2.label'),
      desc: lang === 'rw' ? 'Kwitoza ibibazo n’ibisobanuro by’amategeko.' : 'Drilling specific topics with instant explanation of law.',
    },
    {
      time: '2:40',
      seconds: 160,
      title: t('helpPage.chapters.3.label'),
      desc: lang === 'rw' ? 'Gukora ikizamini cy’iminota 20 nk’icya Polisi.' : 'Timed 20-minute mock examination simulator.',
    },
    {
      time: '3:30',
      seconds: 210,
      title: t('helpPage.chapters.4.label'),
      desc: lang === 'rw' ? 'Gusuzuma aho ufite intege nke n’iterambere.' : 'Weakness analysis and readiness scorecard.',
    },
  ], [t, lang]);

  // Extended FAQ items for rich search
  const allFaqs = useMemo(() => {
    return [
      ...faqData.map((f) => ({ ...f, category: 'learning' })),
      {
        id: 'help-reg-1',
        category: 'gettingStarted',
        question: lang === 'rw' ? 'Ese gufungura konti kuri Urugendo ni ubuntu?' : 'Is creating an account on Urugendo free?',
        answer: lang === 'rw'
          ? 'Yego, gufungura konti ni ubuntu 100%. Ubona uburyo bwo kwitoza amasomo y’ibanze, ibyapa, n’ikizamini cy’igerageza cya mbere utishyuye.'
          : 'Yes! Creating an account on Urugendo is 100% free. You get immediate access to foundational lessons, road signs, and your first mock exam at zero cost.',
      },
      {
        id: 'help-reg-2',
        category: 'gettingStarted',
        question: lang === 'rw' ? 'Ese nshobora kwiga nkoresheje telefone gusa?' : 'Can I use Urugendo exclusively on my mobile phone?',
        answer: lang === 'rw'
          ? 'Yego cyane. Urugendo rwateguwe nk’urubuga rwihuta cyane rwa PWA rukora neza kuri smartphone iyo ari yo yose ndetse rugakoresha interineti nkeya cyane.'
          : 'Absolutely. Urugendo is built as a lightweight, responsive Progressive Web App (PWA) tailored for all smartphones with minimal data usage.',
      },
      {
        id: 'help-exam-1',
        category: 'exams',
        question: lang === 'rw' ? 'Ikizamini cy’igerageza kimeze gite?' : 'How does the mock examination work?',
        answer: lang === 'rw'
          ? 'Ikizamini kiba kigizwe n’ibibazo 20 bitoranyijwe mu buryo bwa mudasobwa mu bibazo birenga 650. Uhabwa iminota 20, ugomba kubona byibura amanota 16/20 kugira ngo utsinde nk’uko bisabwa na Polisi y’u Rwanda.'
          : 'The mock exam draws 20 randomized questions from our 650+ verified bank. You have a 20-minute countdown and must score at least 16/20 (80%) to pass, precisely mirroring the Rwanda National Police exam standard.',
      },
      {
        id: 'help-day-1',
        category: 'examDay',
        question: lang === 'rw' ? 'Ni iki ngomba kwitwaza ku munsi w’ikizamini cya Polisi?' : 'What do I need to bring on the official RNP exam day?',
        answer: lang === 'rw'
          ? 'Witwaza indangamuntu y’umwimerere (ID) n’ubutumwa bugufi (SMS) bwa Irembo bwemeza kwiyandikisha kwawe n’ikigo wahawe gukoreraho.'
          : 'You must bring your original National Identity Card (ID) and the confirmation SMS from Irembo displaying your exam center, date, and candidate reference number.',
      },
    ];
  }, [lang]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allFaqs, activeCategory, searchQuery]);

  // SEO Schema for VideoObject & FAQPage
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        name: 'How to Use Urugendo — Rwandan Traffic Rules Platform Walkthrough',
        description:
          'Step-by-step video guide explaining how to register, study Rwandan traffic rules, practice road signs, and take timed provisional mock exams on Urugendo.',
        thumbnailUrl: 'https://urugendo.rw/icons/video-thumbnail.jpg',
        uploadDate: '2025-01-15T08:00:00+02:00',
        duration: 'PT4M15S',
        contentUrl: 'https://urugendo.rw/help',
        embedUrl: 'https://player.vimeo.com/video/824804225',
        publisher: {
          '@type': 'Organization',
          name: 'Urugendo Rwanda',
          logo: {
            '@type': 'ImageObject',
            url: 'https://urugendo.rw/images/logo1.png',
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: allFaqs.slice(0, 6).map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title={t('seo.helpTitle')}
        description={t('seo.helpDesc')}
        keywords="how to use urugendo, amategeko y'umuhanda video tutorial, provisional driving exam guide rwanda, rnp mock exam help, urugendo support"
        canonical="/help"
        schema={schemaData}
      />

      {/* Hero Header & Search */}
      <section className="relative py-16 md:py-24 border-b border-ink-200 dark:border-ink-800 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 mb-6">
            <Sparkles className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300">
              {t('helpPage.badge')}
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tightest leading-[1.05] mb-6">
            {t('helpPage.title')}
          </h1>
          <p className="text-lg md:text-xl text-ink-600 dark:text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('helpPage.subtitle')}
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-ink-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('helpPage.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-ink-50 dark:bg-ink-900 border border-ink-300 dark:border-ink-700 text-ink-900 dark:text-ink-50 text-sm md:text-base focus:border-brand-500 focus:outline-none shadow-sm transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Walkthrough Showcase */}
      <section id="video-guide" className="py-20 md:py-28 border-b border-ink-200 dark:border-ink-800 bg-ink-100/40 dark:bg-ink-900/30">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {t('helpPage.videoBadge')}
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tightest mb-4">
              {t('helpPage.videoTitle')}
            </h2>
            <p className="text-base md:text-lg text-ink-600 dark:text-ink-400 leading-relaxed">
              {t('helpPage.videoSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Video Container */}
            <div className="lg:col-span-8">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-ink-200 dark:border-ink-800">
                <iframe
                  key={activeChapterIndex}
                  className="absolute inset-0 w-full h-full"
                  src={`https://player.vimeo.com/video/824804225?h=0&badge=0&autopause=0&player_id=0&app_id=58479#t=${chapters[activeChapterIndex].seconds}s`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="How to Use Urugendo Platform Walkthrough"
                ></iframe>
              </div>

              {/* Video Sub-bar */}
              <div className="mt-4 p-4 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-brand-100 dark:bg-brand-900/50 text-brand-800 dark:text-brand-300 font-semibold">
                    HD 1080p
                  </span>
                  <span className="text-ink-600 dark:text-ink-400">
                    Bilingual Voiceover & Captions
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium text-ink-500 dark:text-ink-400">
                  <span>Duration: {t('helpPage.videoDuration')}</span>
                </div>
              </div>
            </div>

            {/* Interactive Chapters Sidebar */}
            <div className="lg:col-span-4 bg-ink-50 dark:bg-ink-950 p-6 md:p-7 rounded-3xl border border-ink-200 dark:border-ink-800 shadow-sm">
              <h3 className="font-display font-bold text-lg mb-1">
                {t('helpPage.videoChaptersTitle')}
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mb-6">
                Click any timestamp to jump to that part of the walkthrough:
              </p>

              <div className="space-y-3">
                {chapters.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.time}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/50 shadow-sm'
                          : 'border-ink-200/70 dark:border-ink-800/70 hover:border-brand-300 dark:hover:border-brand-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-ink-200/70 dark:bg-ink-800 text-brand-800 dark:text-brand-300">
                          {ch.time}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
                            Playing
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-sm text-ink-900 dark:text-ink-100 mb-0.5">
                        {ch.title}
                      </div>
                      <div className="text-xs text-ink-500 dark:text-ink-400 line-clamp-1">
                        {ch.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 md:py-28 border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Get Started Quickly
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mt-2 mb-4">
              {t('helpPage.quickStartTitle')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 md:p-7 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-grotesk font-bold flex items-center justify-center text-sm mb-5 shadow-sm">
                    {t(`helpPage.quickStartSteps.${i}.step`)}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {t(`helpPage.quickStartSteps.${i}.title`)}
                  </h3>
                  <p className="text-xs md:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                    {t(`helpPage.quickStartSteps.${i}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base & FAQs */}
      <section className="py-20 md:py-28 border-b border-ink-200 dark:border-ink-800 bg-ink-100/30 dark:bg-ink-900/20">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Knowledge Base
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-ink-600 dark:text-ink-400">
              Clear answers to the most common inquiries about learning and provisional exam prep.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {['all', 'gettingStarted', 'learning', 'exams', 'examDay'].map((catKey) => {
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:border-brand-500'
                  }`}
                >
                  {t(`helpPage.faqCategories.${catKey}`)}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-ink-50 dark:bg-ink-950 rounded-2xl border border-ink-200 dark:border-ink-800">
              <p className="text-ink-500 text-sm">
                No matching questions found for "{searchQuery}". Try a different keyword or contact our support team below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-ink-200 dark:border-ink-800 rounded-xl bg-ink-50 dark:bg-ink-950 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                    >
                      <span className="font-display font-semibold text-base md:text-lg pr-4">
                        {faq.question}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full border border-ink-300 dark:border-ink-700 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-45 text-brand-600' : ''
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 md:px-6 pb-6 pt-1 text-sm md:text-base text-ink-600 dark:text-ink-400 leading-relaxed border-t border-ink-100 dark:border-ink-900">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Helpful Feedback Widget */}
          <div className="mt-12 p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-center">
            <p className="text-sm font-medium mb-3">Did you find the answers you were looking for?</p>
            {feedbackSent ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                <CheckCircle2 className="w-4 h-4" /> Thank you for your feedback!
              </span>
            ) : (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setFeedbackSent('yes')}
                  className="px-4 py-1.5 rounded-lg border border-ink-200 dark:border-ink-700 text-xs font-semibold hover:border-brand-500"
                >
                  Yes, very helpful
                </button>
                <button
                  onClick={() => setFeedbackSent('no')}
                  className="px-4 py-1.5 rounded-lg border border-ink-200 dark:border-ink-700 text-xs font-semibold hover:border-brand-500"
                >
                  Not quite
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support & Contact Channels */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Direct Support
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tightest mt-2 mb-4">
              {t('helpPage.contactTitle')}
            </h2>
            <p className="text-base text-ink-600 dark:text-ink-400">
              {t('helpPage.contactSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="https://wa.me/250732140720"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-brand-500 transition-colors block group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-brand-700 dark:text-brand-300" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 flex items-center justify-between">
                {t('helpPage.channels.whatsapp')}
                <ExternalLink className="w-4 h-4 text-ink-400 group-hover:text-brand-600" />
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-400">
                {t('helpPage.channels.whatsappDesc')}
              </p>
            </a>

            <a
              href="mailto:rw.urugendo@gmail.com"
              className="p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-brand-500 transition-colors block group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-brand-700 dark:text-brand-300" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 flex items-center justify-between">
                {t('helpPage.channels.email')}
                <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600" />
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-400">
                {t('helpPage.channels.emailDesc')}
              </p>
            </a>

            <a
              href="tel:0732140720"
              className="p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-brand-500 transition-colors block group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-brand-700 dark:text-brand-300" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 flex items-center justify-between">
                {t('helpPage.channels.phone')}
                <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600" />
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-400">
                {t('helpPage.channels.phoneDesc')}
              </p>
            </a>

            <div className="p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800">
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-brand-700 dark:text-brand-300" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">
                {t('helpPage.channels.location')}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-400">
                {t('helpPage.channels.locationDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

