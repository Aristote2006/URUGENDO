import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  Clock,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { learningCurriculum } from '../../data/learningData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function LessonViewer() {
  const { lessonId } = useParams();
  const { user, markLessonComplete } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Find lesson and module
  const allLessons = learningCurriculum.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex] || allLessons[0];
  const parentModule = learningCurriculum.find((m) =>
    m.lessons.some((l) => l.id === lesson.id)
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = user?.progress?.completedLessons?.includes(lesson.id);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleMarkComplete = () => {
    markLessonComplete(lesson.id);
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <SEO
        title={`${lesson.title} · Urugendo Lesson`}
        description={lesson.notes}
        canonical={`/learning/${lesson.id}`}
      />

      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Curriculum Modules</span>
        </Link>

        <span className="text-xs text-ink-500 font-medium">
          Module {parentModule?.moduleNumber} · Lesson {lesson.lessonNumber} of {allLessons.length}
        </span>
      </div>

      {/* Video Player Container */}
      <div className="rounded-3xl overflow-hidden bg-black border border-ink-200 dark:border-ink-800 shadow-2xl">
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={lesson.videoUrl}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        </div>

        {/* Video Bottom Sub-bar */}
        <div className="p-4 sm:p-5 bg-ink-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-ink-200">
              Teacher: {lang === 'rw' ? lesson.teacherRw : lesson.teacher}
            </span>
          </div>

          <div className="flex items-center gap-4 text-ink-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Duration: {lesson.duration}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Details & Action Row */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-ink-200 dark:border-ink-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Module {parentModule?.moduleNumber}: {lang === 'rw' ? parentModule?.titleRw : parentModule?.title}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mt-1">
              {lang === 'rw' ? lesson.titleRw : lesson.title}
            </h1>
          </div>

          <button
            onClick={handleMarkComplete}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all ${
              isCompleted || justCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'btn-primary shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
          </button>
        </div>

        {/* Learning Objectives */}
        <div>
          <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Learning Objectives</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {(lang === 'rw' ? lesson.objectivesRw : lesson.objectives).map((obj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-ink-100/60 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 flex items-start gap-2.5 text-xs sm:text-sm text-ink-700 dark:text-ink-300"
              >
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Highway Code Notes */}
        <div className="pt-4 border-t border-ink-200/60 dark:border-ink-800/60">
          <h3 className="font-display font-bold text-base mb-2">
            Official Traffic Code Reference & Summary
          </h3>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed bg-brand-50/50 dark:bg-brand-950/30 p-4 rounded-2xl border border-brand-200 dark:border-brand-900/40">
            {lesson.notes}
          </p>
        </div>
      </div>

      {/* Prev / Next Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {prevLesson ? (
          <Link
            to={`/learning/${prevLesson.id}`}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold btn-ghost border border-ink-200 dark:border-ink-800 inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: Lesson {prevLesson.lessonNumber}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/learning/${nextLesson.id}`}
            className="px-5 py-2.5 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-2 shadow-sm"
          >
            <span>Next: Lesson {nextLesson.lessonNumber}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/mock-exams"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white inline-flex items-center gap-2 shadow-sm"
          >
            <span>Take Practice Mock Exam</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

