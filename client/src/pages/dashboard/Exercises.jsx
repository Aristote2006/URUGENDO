import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ListChecks,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { exerciseService } from '../../services/exerciseService';
import SEO from '../../components/common/SEO';

export default function Exercises() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await exerciseService.getExercises();
      if (res.success && res.data) {
        setExercises(res.data.exercises || []);
      }
    } catch (err) {
      console.error('[Exercises] Failed to load exercises:', err);
      setError(err.message || 'Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn">
      <SEO
        title="Practice Exercises · Urugendo Student Portal"
        description="Master Rwandan traffic rules with official lesson-based practice exercises and immediate feedback."
        canonical="/exercises"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Lesson Practice</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
            {lang === 'rw' ? 'Imyitozo y’Amasomo' : 'Official Practice Exercises'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'rw'
              ? 'Imyitozo ifitanye isano n’amasomo wize. Buri kibazo kiguha igisubizo n’ibisobanuro by’amategeko ako kanya.'
              : 'Interactive practice exercises tied to your lessons with immediate feedback and Highway Code legal explanations.'}
          </p>
        </div>

        <button
          onClick={fetchExercises}
          disabled={loading}
          className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold btn-ghost border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'rw' ? 'Kuvugurura' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchExercises}
            className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
          <p>{lang === 'rw' ? 'Gushakisha imyitozo...' : 'Loading published exercises...'}</p>
        </div>
      ) : exercises.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <ListChecks className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              {lang === 'rw' ? 'Nta myitozo irashyirwaho' : 'No Practice Exercises Published Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {lang === 'rw'
                ? 'Imyitozo mishya irimo gutegurwa no gushyirwaho n’abarimu. Iyo umwitozo wemejwe uhita ugaragara hano no ku isomo rijyanye nawo.'
                : 'Official exercises are prepared and published alongside curriculum lessons by certified instructors. As soon as an exercise is published, it will appear here.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/learning"
              className="px-5 py-2.5 rounded-xl font-bold text-xs btn-primary inline-flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Reba Integanyanyigisho y’Amasomo' : 'Explore Curriculum Lessons'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Real Exercises Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => {
            const lesson = ex.lesson;
            const attempt = ex.latestAttempt;
            const isCompleted = Boolean(attempt?.completed);
            const scorePct = attempt?.percentage;
            const hasPassed = isCompleted && scorePct >= (ex.passingScore || 80);

            return (
              <div
                key={ex._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-500/60 transition-all hover:shadow-md"
              >
                <div>
                  {/* Top Lesson Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                      {lesson ? `Lesson ${lesson.lessonNumber}` : 'General Exercise'}
                    </span>

                    {isCompleted ? (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          hasPassed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Score: {scorePct}%</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {lang === 'rw' ? 'Ntarakorwa' : 'Not Attempted'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {lang === 'rw' ? ex.title?.rw || ex.title?.en : ex.title?.en || ex.title?.rw}
                  </h3>

                  {/* Lesson context */}
                  {lesson && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                      {lang === 'rw' ? lesson.title?.rw || lesson.title?.en : lesson.title?.en}
                    </p>
                  )}

                  {/* Metadata pills */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <ListChecks className="w-3.5 h-3.5 text-brand-600" />
                      <span>{ex.totalQuestions} Questions</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pass: {ex.passingScore || 80}%</span>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                {lesson ? (
                  <Link
                    to={`/learning/${lesson._id}/exercise`}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isCompleted
                        ? 'btn-ghost border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'btn-primary'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isCompleted
                        ? lang === 'rw'
                          ? 'Ongera Ukore Umwitozo'
                          : 'Retake / Review Exercise'
                        : lang === 'rw'
                        ? 'Tangira Umwitozo'
                        : 'Start Exercise'}
                    </span>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed text-center"
                  >
                    Lesson not linked
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
