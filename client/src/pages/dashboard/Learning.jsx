import React from 'react';
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
} from 'lucide-react';
import { learningCurriculum } from '../../data/learningData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { plansConfig } from '../../config/plans';
import SEO from '../../components/common/SEO';

export default function Learning() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const planId = user?.subscription?.plan || 'monthly';
  const planDetails = plansConfig[planId] || plansConfig.monthly;
  const maxAllowedLessons = planDetails.limits?.maxLessons || Infinity;

  const completedLessons = user?.progress?.completedLessons || [];

  return (
    <div className="space-y-10 animate-fadeIn">
      <SEO
        title="Learning Modules · Urugendo Student Portal"
        description="Structured highway code lessons prepared by certified Rwandan road safety instructors."
        canonical="/learning"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Official Syllabus Alignment</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            {lang === 'rw' ? 'Integanyanyigisho y’Amasomo' : 'Curriculum & Video Lessons'}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            {lang === 'rw'
              ? 'Amasomo yateguwe n’umwarimu wemewe agabanyije mu byiciro byoroshye kwiga.'
              : 'Lessons prepared by our certified road safety instructor, broken down by core highway code topics.'}
          </p>
        </div>

        {/* Plan Quota Pill */}
        <div className="p-3 rounded-2xl bg-ink-100/70 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 text-xs">
          <span className="text-ink-500 block">Plan Allowance:</span>
          <span className="font-bold text-ink-900 dark:text-ink-100">
            {maxAllowedLessons === Infinity
              ? 'Unlimited Lessons (Monthly)'
              : `${completedLessons.length} / ${maxAllowedLessons} lessons completed`}
          </span>
        </div>
      </div>

      {/* Curriculum Modules */}
      <div className="space-y-8">
        {learningCurriculum.map((module) => {
          return (
            <div
              key={module.id}
              className="p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm"
            >
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ink-200 dark:border-ink-800 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                    Module 0{module.moduleNumber}
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl">
                    {lang === 'rw' ? module.titleRw : module.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 mt-1">
                    {lang === 'rw' ? module.descriptionRw : module.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessons.length} Lessons</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{module.totalDuration}</span>
                  </div>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {module.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isLockedByQuota =
                    maxAllowedLessons !== Infinity && index >= maxAllowedLessons;

                  return (
                    <div
                      key={lesson.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isLockedByQuota
                          ? 'opacity-60 bg-ink-100/50 dark:bg-ink-900/20 border-ink-200 dark:border-ink-800'
                          : 'bg-ink-100/50 dark:bg-ink-900/40 border-ink-200 dark:border-ink-800 hover:border-brand-500/60 shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Thumbnail / Video badge */}
                        <div className="relative aspect-video rounded-xl bg-ink-200 dark:bg-ink-800 mb-4 overflow-hidden flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>

                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                            {lesson.duration}
                          </div>

                          {isCompleted && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Finished</span>
                            </div>
                          )}
                        </div>

                        <div className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mb-1">
                          Lesson {lesson.lessonNumber}
                        </div>

                        <h3 className="font-display font-bold text-base mb-1.5 leading-snug">
                          {lang === 'rw' ? lesson.titleRw : lesson.title}
                        </h3>

                        <div className="text-[11px] text-ink-500 mb-4 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-ink-400" />
                          <span>{lang === 'rw' ? lesson.teacherRw : lesson.teacher}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-3 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
                        {isLockedByQuota ? (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Upgrade to access</span>
                          </div>
                        ) : (
                          <Link
                            to={`/learning/${lesson.id}`}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                            <Play className="w-3 h-3 fill-current" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

