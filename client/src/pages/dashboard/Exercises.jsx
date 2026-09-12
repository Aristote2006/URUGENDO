import React, { useState } from 'react';
import {
  ListChecks,
  TriangleAlert,
  BookOpen,
  Compass,
  ShieldCheck,
  Play,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { exerciseCategories } from '../../data/exercisesData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

const iconMap = {
  TriangleAlert,
  BookOpen,
  Compass,
  ShieldCheck,
};

export default function Exercises() {
  const { user, recordExerciseDone } = useAuth();
  const { lang } = useLanguage();

  const [activeCategory, setActiveCategory] = useState(null); // When drilling a category
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [drillScore, setDrillScore] = useState(0);

  const startDrill = (cat) => {
    setActiveCategory(cat);
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setShowFeedback(false);
    setDrillScore(0);
  };

  const handleSelectOption = (idx) => {
    if (showFeedback) return;
    setSelectedOpt(idx);
    setShowFeedback(true);

    const isCorrect = idx === activeCategory.questions[currentQIndex].correctIndex;
    if (isCorrect) {
      setDrillScore((prev) => prev + 1);
    }
    recordExerciseDone();
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeCategory.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
    } else {
      // Completed drill
      setShowFeedback(true);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <SEO
        title="Practice Exercises · Urugendo Student Portal"
        description="Master Rwandan traffic rules with topic-by-topic interactive practice drills."
        canonical="/exercises"
      />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Targeted Topic Drills</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
          {lang === 'rw' ? 'Imyitozo ku Ngingo zihariye' : 'Topic-Based Practice Exercises'}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {lang === 'rw'
            ? 'Hitamo icyiciro wifuza kwimenyerezamo. Uhabwa ibisobanuro by’amategeko kuri buri kibazo.'
            : 'Select a category below to practice questions with immediate explanations to reinforce your understanding.'}
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {exerciseCategories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || BookOpen;

          return (
            <div
              key={cat.id}
              className="p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between hover:border-brand-500/60 transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xl">
                    {lang === 'rw' ? cat.titleRw : cat.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ink-200/60 dark:bg-ink-800 text-ink-600 dark:text-ink-400">
                    {cat.questionCount} Questions
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
                  {lang === 'rw' ? cat.descriptionRw : cat.description}
                </p>
              </div>

              <button
                onClick={() => startDrill(cat)}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm btn-primary flex items-center justify-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{lang === 'rw' ? 'Tangira Kwitoza' : 'Start Practice Drill'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE DRILL MODAL */}
      {activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Top row */}
            <div className="flex items-center justify-between pb-4 border-b border-ink-200 dark:border-ink-800">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  {activeCategory.title}
                </span>
                <div className="text-xs text-ink-500">
                  Question {currentQIndex + 1} of {activeCategory.questions.length} · Score: {drillScore}
                </div>
              </div>

              <button
                onClick={() => setActiveCategory(null)}
                className="p-1.5 rounded-lg btn-ghost text-ink-400 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Box */}
            {(() => {
              const currentQ = activeCategory.questions[currentQIndex];

              return (
                <div className="space-y-5">
                  <h4 className="font-display font-bold text-lg sm:text-xl">
                    {lang === 'rw' ? currentQ.questionRw : currentQ.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = currentQ.correctIndex === optIdx;

                      let style =
                        'border-ink-200 dark:border-ink-800 bg-ink-100/50 dark:bg-ink-900/50 hover:border-brand-400';

                      if (showFeedback) {
                        if (isCorrect) {
                          style =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          style =
                            'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          disabled={showFeedback}
                          className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${style}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-ink-300 dark:border-ink-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {showFeedback && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after click */}
                  {showFeedback && (
                    <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 text-xs">
                      <span className="font-bold text-brand-700 dark:text-brand-300 block mb-1">
                        Legal Rationale:
                      </span>
                      <p className="text-ink-600 dark:text-ink-400 leading-relaxed">
                        {lang === 'rw' ? currentQ.explanationRw : currentQ.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-ink-200 dark:border-ink-800">
              <button
                onClick={() => setActiveCategory(null)}
                className="text-xs font-semibold text-ink-500 hover:text-ink-900"
              >
                Exit Drill
              </button>

              {showFeedback && currentQIndex < activeCategory.questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs btn-primary inline-flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : showFeedback && currentQIndex === activeCategory.questions.length - 1 ? (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white"
                >
                  Complete Drill ({drillScore} / {activeCategory.questions.length})
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

