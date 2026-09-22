import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Video,
  Award,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { lessonService } from '../../services/lessonService';
import SEO from '../../components/common/SEO';

const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return '10 min';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
};

export default function Learning() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [lessons, setLessons] = useState([]);
  const [metrics, setMetrics] = useState({
    totalLessons: 0,
    completedLessons: 0,
    overallProgressPercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await lessonService.getLessons();
      if (res.success && res.data) {
        setLessons(res.data.lessons || []);
        setMetrics({
          totalLessons: res.data.totalLessons || 0,
          completedLessons: res.data.completedLessons || 0,
          overallProgressPercent: res.data.overallProgressPercent || 0,
        });
      }
    } catch (err) {
      console.error('[Learning] Failed to fetch curriculum:', err);
      setError(err.message || 'Failed to load video lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  // Group lessons by moduleNumber
  const modulesMap = lessons.reduce((acc, lesson) => {
    const modNum = lesson.moduleNumber || 1;
    if (!acc[modNum]) {
      acc[modNum] = {
        moduleNumber: modNum,
        titleEn: lesson.moduleTitle?.en || `Module ${modNum}`,
        titleRw: lesson.moduleTitle?.rw || `Igice cya ${modNum}`,
        lessons: [],
      };
    }
    acc[modNum].lessons.push(lesson);
    return acc;
  }, {});

  const modulesList = Object.values(modulesMap);

  return (
    <div className="space-y-10 animate-fadeIn">
      <SEO
        title="Learning Modules · Urugendo Student Portal"
        description="Structured Rwandan highway code lessons and official video lectures prepared by certified road safety instructors."
        canonical="/learning"
      />

      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Official Syllabus Alignment</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
            {lang === 'rw' ? 'Integanyanyigisho y’Amasomo' : 'Curriculum & Video Lessons'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'rw'
              ? 'Amasomo yateguwe n’umwarimu wemewe akurikirana mu buryo bw’amasomo y’amashusho (Vimeo).'
              : 'Sequential video lectures covering the complete Rwandan provisional driving license syllabus.'}
          </p>
        </div>

        {/* Course Completion Pill */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm min-w-[200px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-500 font-semibold">Curriculum Progress:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">
              {metrics.overallProgressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.overallProgressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics.completedLessons} of {metrics.totalLessons} lessons finished
          </span>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCurriculum}
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
          <p>Loading your curriculum progress...</p>
        </div>
      ) : modulesList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No lessons available yet</h3>
          <p className="text-xs text-slate-500">
            Lessons are currently being published by our instructors. Please check back shortly.
          </p>
        </div>
      ) : (
        /* Modules & Lessons */
        <div className="space-y-8">
          {modulesList.map((module) => (
            <div
              key={module.moduleNumber}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              {/* Module Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                    Module 0{module.moduleNumber}
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                    {lang === 'rw' ? module.titleRw : module.titleEn}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessons.length} Lessons</span>
                  </div>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {module.lessons.map((lesson) => {
                  const isLocked = lesson.isLocked;
                  const isVideoCompleted = Boolean(lesson.progress?.videoCompleted);
                  const isExerciseCompleted = Boolean(lesson.progress?.exerciseCompleted);
                  const isCompleted = Boolean(lesson.progress?.lessonCompleted);
                  const hasExercise = Boolean(lesson.hasExercise);
                  const progressPct = lesson.progress?.progressPercentage || 0;
                  const hasStarted = progressPct > 0;

                  return (
                    <div
                      key={lesson._id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isLocked
                          ? 'opacity-65 bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-brand-500/60 hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Video Thumbnail Box */}
                        <div className="relative aspect-video rounded-xl bg-slate-900 mb-4 overflow-hidden flex items-center justify-center group">
                          {isLocked ? (
                            <div className="w-10 h-10 rounded-full bg-slate-800/90 text-slate-400 flex items-center justify-center">
                              <Lock className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          )}

                          {/* Duration Tag */}
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px]">
                            {formatDuration(lesson.durationSeconds)}
                          </div>

                          {/* Status Tag */}
                          {isCompleted ? (
                            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </div>
                          ) : isLocked ? (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Locked</span>
                            </div>
                          ) : isVideoCompleted && hasExercise && !isExerciseCompleted ? (
                            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold shadow">
                              Exercise Ready
                            </div>
                          ) : hasStarted ? (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-semibold">
                              {progressPct}% Watched
                            </div>
                          ) : null}
                        </div>

                        {/* Dual Progress Badges if not locked */}
                        {!isLocked && (
                          <div className="flex items-center gap-2 mb-2 text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 ${
                                isVideoCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              Video: {isVideoCompleted ? '✓' : `${progressPct}%`}
                            </span>
                            {hasExercise && (
                              <span
                                className={`px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 ${
                                  isExerciseCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                    : isVideoCompleted
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}
                              >
                                Exercise: {isExerciseCompleted ? '✓' : isVideoCompleted ? 'Pending' : 'Locked'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Title & Metadata */}
                        <div className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mb-1">
                          Lesson {lesson.lessonNumber}
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1.5 leading-snug line-clamp-2">
                          {lang === 'rw' && lesson.title?.rw ? lesson.title.rw : lesson.title?.en}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                          {lang === 'rw' && lesson.summary?.rw ? lesson.summary.rw : lesson.summary?.en}
                        </p>
                      </div>

                      {/* Bottom Action & Progress Bar */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                        {/* Small progress bar */}
                        {!isLocked && (
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {isLocked ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Complete Lesson {lesson.lessonNumber - 1} first</span>
                            </div>
                          ) : (
                            <Link
                              to={`/learning/${lesson._id}`}
                              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 inline-flex items-center gap-1 transition-colors"
                            >
                              <span>
                                {isCompleted
                                  ? 'Review Lesson'
                                  : isVideoCompleted && hasExercise && !isExerciseCompleted
                                  ? 'Take Exercise'
                                  : hasStarted
                                  ? 'Continue Watching'
                                  : 'Start Lesson'}
                              </span>
                              <Play className="w-3 h-3 fill-current" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
