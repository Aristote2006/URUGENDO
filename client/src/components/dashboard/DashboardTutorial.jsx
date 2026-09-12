import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Video,
  ListChecks,
  GraduationCap,
  LineChart,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardTutorial() {
  const { user, completeTutorial } = useAuth();
  const { lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  // If user already completed tutorial, don't show
  if (user?.dashboard?.hasCompletedTutorial) {
    return null;
  }

  const steps = [
    {
      stepNumber: 1,
      icon: Sparkles,
      title: lang === 'rw' ? 'Kaze neza kuri Urugendo!' : 'Welcome to your Urugendo dashboard',
      subtitle: lang === 'rw' ? 'Reka tukwereke muri make uburyo ukoresha urubuga.' : "Let's quickly show you around your learning hub.",
      body:
        lang === 'rw'
          ? 'Konti yawe yafunguwe neza. Hano uzabona amasomo yose, ibyapa byo mu muhanda, n’ibizamini by’igerageza bizagufasha gutsindira uruhushya rw’agateganyo ku nshuro ya mbere.'
          : 'Your account is now activated. Here you will find all your curriculum modules, verified road signs, and timed mock tests to pass your provisional driving exam on the first attempt.',
      highlight: 'Dashboard Overview',
    },
    {
      stepNumber: 2,
      icon: BookOpen,
      title: lang === 'rw' ? 'Amasomo y’Amategeko' : 'Structured Learning Section',
      subtitle: lang === 'rw' ? 'Aho usanga ibikoresho n’inyigisho zose.' : 'Where you will find your learning materials and lessons.',
      body:
        lang === 'rw'
          ? 'Kanda kuri "Learning" kugira ngo urebe integanyanyigisho yose igabanyije mu masomo yoroshye gusobanukirwa hagendewe ku mategeko y’umuhanda mu Rwanda.'
          : 'Click "Learning" in the sidebar to browse our modules, organized step-by-step from road definitions to intersection priorities.',
      highlight: 'Sidebar: Learning',
    },
    {
      stepNumber: 3,
      icon: Video,
      title: lang === 'rw' ? 'Amashusho y’Umwarimu Wemewe' : 'Certified Teacher Video Lessons',
      subtitle: lang === 'rw' ? 'Reba amasomo yateguwe n’umwarimu w’umwuga.' : 'Watch lessons prepared by our certified road safety instructor.',
      body:
        lang === 'rw'
          ? 'Buri somo ririmo amashusho magufi asobanura buri tegeko n’impamvu ribaho, kugira ngo utarifata mu mutwe gusa ahubwo urisobanukirwe neza.'
          : 'Each lesson includes focused video explanations breaking down legal traffic articles into simple, memorable visual scenarios.',
      highlight: 'Interactive Video Player',
    },
    {
      stepNumber: 4,
      icon: ListChecks,
      title: lang === 'rw' ? 'Imyitozo y’Ibibazo' : 'Category Practice Exercises',
      subtitle: lang === 'rw' ? 'Wimenyereze ibyo wize ukoresheje imyitozo.' : 'Practice what you have learned using topic-based exercises.',
      body:
        lang === 'rw'
          ? 'Kora imyitozo ku byapa, ibyerekezo, n’umuvuduko. Uhabwa ibisubizo by’ukuri ako kanya n’ibisobanuro by’itegeko.'
          : 'Drill specific areas such as road signs, speed rules, and emergency situations with instant explanations after every question.',
      highlight: 'Sidebar: Exercises',
    },
    {
      stepNumber: 5,
      icon: GraduationCap,
      title: lang === 'rw' ? 'Ibizamini by’Igerageza' : 'Official Timed Mock Exams',
      subtitle: lang === 'rw' ? 'Gerageza ikizamini kimeze nk’icya Polisi.' : 'Test yourself with realistic mock exams and track your performance.',
      body:
        lang === 'rw'
          ? 'Kora ikizamini cy’ibibazo 20 mu minota 20 ibarwa kuri mudasobwa nk’uko bikorwa mu kizamini cya Polisi y’u Rwanda. Intego ni ukurenza 16/20!'
          : 'Experience the real exam format: 20 randomized questions with a 20-minute countdown timer. Score 16/20 (80%) or higher to pass!',
      highlight: 'Sidebar: Mock Exams',
    },
    {
      stepNumber: 6,
      icon: LineChart,
      title: lang === 'rw' ? 'Iterambere n’Amanota yawe' : 'My Progress & Exam Readiness',
      subtitle: lang === 'rw' ? 'Reba uburyo urimo gutera imbere.' : 'Track your learning progress and see how you are improving.',
      body:
        lang === 'rw'
          ? 'Kurikirana amanota wagiye ubona, ibice ufitemo intege nke, n’igipimo cy’ikizere cyo gutsinda ikizamini cy’ukuri.'
          : 'Monitor your topic mastery percentages, review past exam attempts, and see your overall exam readiness score before test day.',
      highlight: 'Sidebar: My Progress',
    },
    {
      stepNumber: 7,
      icon: User,
      title: lang === 'rw' ? 'Konti n’Umwirondoro wawe' : 'Profile & Subscription Settings',
      subtitle: lang === 'rw' ? 'Cunga imyirondoro yawe n’ifatabuguzi hano.' : 'Manage your personal information and account settings here.',
      body:
        lang === 'rw'
          ? 'Reba iminsi usigaranye ku ifatabuguzi ryawe, hindura ururimi wifuza kwigamo, cyangwa uvugurure gahunda yawe.'
          : 'Check remaining days on your plan, manage your contact info, update preferred language, or renew your subscription anytime.',
      highlight: 'Sidebar: Profile',
    },
    {
      stepNumber: 8,
      icon: CheckCircle2,
      title: lang === 'rw' ? 'Utegereje iki? Tangira kwiga!' : "You're ready to start learning!",
      subtitle: lang === 'rw' ? 'Urugendo rwo gutsindira uruhushya rwawe rutangirira hano.' : 'Your journey toward mastering Rwandan traffic rules begins now.',
      body:
        lang === 'rw'
          ? 'Kanda ahakurikira maze utangire isomo rya mbere. Tubifurije urugendo rwiza n’amahirwe masa mu kizamini cyanyu!'
          : 'Click below to begin your very first lesson. We are honored to accompany you toward becoming a confident, certified driver!',
      highlight: 'Ready to Learn',
    },
  ];

  const current = steps[currentStep];
  const IconComp = current.icon;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Skip & Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-5 right-5 p-2 rounded-xl text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors"
          title="Skip Tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-7 bg-brand-600 dark:bg-brand-400'
                  : i < currentStep
                  ? 'w-2 bg-brand-300 dark:bg-brand-700'
                  : 'w-2 bg-ink-200 dark:bg-ink-800'
              }`}
            />
          ))}
        </div>

        {/* Icon & Step Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 shadow-sm">
            <IconComp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Step {current.stepNumber} of {steps.length} · {current.highlight}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-ink-900 dark:text-ink-50">
              {current.title}
            </h3>
          </div>
        </div>

        <p className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">
          {current.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
          {current.body}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-ink-200/70 dark:border-ink-800/70">
          <div className="flex items-center gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl btn-ghost border border-ink-200 dark:border-ink-800 inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-xs font-semibold text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
              >
                Skip Walkthrough
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary inline-flex items-center gap-1.5 shadow-md"
          >
            <span>{isLast ? 'Start Learning' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

