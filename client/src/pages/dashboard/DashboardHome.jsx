import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ListChecks,
  LineChart,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { plansConfig } from '../../config/plans';
import { lessonService } from '../../services/lessonService';

export default function DashboardHome() {
  const { user, isExpired, replayTutorial } = useAuth();
  const { lang } = useLanguage();

  const planId = user?.subscription?.plan || 'monthly';
  const planDetails = plansConfig[planId] || plansConfig.monthly;

  const [realLessons, setRealLessons] = useState([]);
  const [curriculumStats, setCurriculumStats] = useState({
    total: 0,
    completed: 0,
    percent: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await lessonService.getLessons();
        if (res.success && res.data) {
          const list = res.data.lessons || [];
          setRealLessons(list);
          setCurriculumStats({
            total: res.data.totalLessons !== undefined ? res.data.totalLessons : list.length,
            completed: res.data.completedLessons || 0,
            percent: res.data.overallProgressPercent || 0,
          });
        }
      } catch (err) {
        console.warn('[DashboardHome] Could not load lessons progress:', err.message);
      }
    };
    fetchProgress();
  }, []);

  const totalLessonsCount = curriculumStats.total;
  const completedLessonsCount = curriculumStats.completed;
  const courseProgressPercent = curriculumStats.percent;

  const completedExercisesCount = user?.progress?.completedExercises || 0;
  const examAttemptsCount = user?.progress?.examAttempts?.length || 0;
  const readinessScore = user?.progress?.readinessScore || 0;

  // Format expiration date
  const formatExpiryDate = (isoString) => {
    if (!isoString) return 'Active';
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Find next uncompleted and unlocked lesson
  const nextRealLesson =
    realLessons.find((les) => !les.progress?.videoCompleted && !les.isLocked) ||
    realLessons[0];

  const nextLesson = nextRealLesson
    ? {
        id: nextRealLesson._id,
        lessonNumber: nextRealLesson.lessonNumber,
        title: nextRealLesson.title?.en,
        titleRw: nextRealLesson.title?.rw || nextRealLesson.title?.en,
        notes: nextRealLesson.summary?.en || nextRealLesson.notes?.en || 'Official Highway Code Video Lecture',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: nextRealLesson.durationSeconds ? `${Math.round(nextRealLesson.durationSeconds / 60)} mins` : '15 mins',
      }
    : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/40 text-brand-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rwandan Provisional License Preparation</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-2">
            {lang === 'rw'
              ? `Murakaza neza, ${user?.name || 'Munyeshuri'} 👋`
              : `Welcome back, ${user?.name || 'Learner'} 👋`}
          </h1>

          <p className="text-sm sm:text-base text-brand-100 leading-relaxed mb-6">
            {lang === 'rw'
              ? 'Komeza urugendo rwawe rwo kumenya amategeko y’umuhanda no kwitegura ikizamini cya Polisi y’u Rwanda.'
              : 'Continue your journey toward mastering Rwandan traffic rules and passing your official provisional driving license examination.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {nextLesson ? (
              <Link
                to={`/learning/${nextLesson.id}`}
                className="px-5 py-3 rounded-xl bg-white hover:bg-brand-100 text-brand-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {lang === 'rw'
                    ? `Komeza: Isomo rya ${nextLesson.lessonNumber}`
                    : `Resume: Lesson ${nextLesson.lessonNumber}`}
                </span>
              </Link>
            ) : (
              <Link
                to="/learning"
                className="px-5 py-3 rounded-xl bg-white hover:bg-brand-100 text-brand-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {lang === 'rw' ? 'Reba Integanyanyigisho' : 'Explore Curriculum'}
                </span>
              </Link>
            )}

            <Link
              to="/mock-exams"
              className="px-5 py-3 rounded-xl bg-brand-800/80 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm border border-brand-600/60 inline-flex items-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Kora Ikizamini' : 'Take Mock Exam'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Expiration Notice if expired */}
      {isExpired && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-red-900 dark:text-red-200">
                Your subscription plan has expired
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                Renew your plan now to unlock unlimited access to all lessons and official mock exams.
              </p>
            </div>
          </div>
          <Link
            to="/payment"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm"
          >
            Renew Plan &rarr;
          </Link>
        </div>
      )}

      {/* Progress & Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Course Progress */}
        <div className="p-5 sm:p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Course Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="font-grotesk font-bold text-3xl sm:text-4xl text-ink-900 dark:text-ink-50 mb-2">
            {courseProgressPercent}%
          </div>
          <div className="w-full bg-ink-200 dark:bg-ink-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-ink-500 mt-2 block">
            {completedLessonsCount} of {totalLessonsCount} lessons finished
          </span>
        </div>

        {/* Exercises Done */}
        <div className="p-5 sm:p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Exercises
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ListChecks className="w-4 h-4" />
            </div>
          </div>
          <div className="font-grotesk font-bold text-3xl sm:text-4xl text-ink-900 dark:text-ink-50 mb-2">
            {completedExercisesCount}
          </div>
          <span className="text-[11px] text-ink-500 block">
            Drill questions practiced
          </span>
        </div>

        {/* Mock Exams */}
        <div className="p-5 sm:p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Mock Exams
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-grotesk font-bold text-3xl sm:text-4xl text-ink-900 dark:text-ink-50 mb-2">
            {examAttemptsCount}
          </div>
          <span className="text-[11px] text-ink-500 block">
            Timed 20-question simulations
          </span>
        </div>

        {/* Readiness Score */}
        <div className="p-5 sm:p-6 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Readiness Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-grotesk font-bold text-3xl sm:text-4xl text-brand-600 dark:text-brand-400 mb-2">
            {readinessScore}%
          </div>
          <span className="text-[11px] text-ink-500 block">
            Target: 80% (16/20 pass score)
          </span>
        </div>
      </div>

      {/* Active Subscription Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Subscription Status
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl mt-1">
              {lang === 'rw' ? planDetails.nameRw : planDetails.name} Plan
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isExpired
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {isExpired ? 'EXPIRED' : 'ACTIVE'}
            </span>
            <Link
              to="/payment"
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-ghost border border-ink-200 dark:border-ink-800"
            >
              {isExpired ? 'Renew Plan' : 'Upgrade Plan'}
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-ink-200/60 dark:border-ink-800/60 text-xs">
          <div>
            <span className="text-ink-500 block mb-1">Access Level:</span>
            <span className="font-semibold text-ink-900 dark:text-ink-100">
              {planId === 'monthly' ? 'Full Unlimited Access' : `${planDetails.name} Access Limit`}
            </span>
          </div>
          <div>
            <span className="text-ink-500 block mb-1">Plan Expiration:</span>
            <span className="font-semibold text-ink-900 dark:text-ink-100">
              {formatExpiryDate(user?.subscription?.expiresAt)}
            </span>
          </div>
          <div>
            <span className="text-ink-500 block mb-1">Assistance:</span>
            <a
              href="https://wa.me/250784227283"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 hover:underline"
            >
              WhatsApp Support (0784227283)
            </a>
          </div>
        </div>
      </div>

      {/* Next Recommended Activity Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {nextLesson ? (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                  Up Next In Your Curriculum
                </span>
                <span className="text-xs text-ink-500 font-medium">
                  Lesson {nextLesson.lessonNumber}
                </span>
              </div>
              <h4 className="font-display font-bold text-xl sm:text-2xl mb-2">
                {lang === 'rw' ? nextLesson.titleRw : nextLesson.title}
              </h4>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
                {lang === 'rw' ? nextLesson.notes : nextLesson.notes}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-ink-200/60 dark:border-ink-800/60">
              <span className="text-xs text-ink-500">
                Instructor: {lang === 'rw' ? nextLesson.teacherRw : nextLesson.teacher} · {nextLesson.duration}
              </span>
              <Link
                to={`/learning/${nextLesson.id}`}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                  {lang === 'rw' ? 'Amasomo Yiteganyijwe' : 'Curriculum Status'}
                </span>
              </div>
              <h4 className="font-display font-bold text-xl sm:text-2xl mb-2">
                {lang === 'rw' ? 'Nta masomo arashyirwaho' : 'New Lessons Coming Soon'}
              </h4>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
                {lang === 'rw'
                  ? 'Abarimu b’inzobere mu mategeko y’umuhanda bari gutegura amashusho mashya y’amasomo. Fungura kuri iyi paji mu kanya gato.'
                  : 'Official lessons and video lectures are currently being published by certified instructors. Please check back shortly.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-ink-200/60 dark:border-ink-800/60">
              <span className="text-xs text-ink-500">
                {lang === 'rw' ? 'Integanyanyigisho y’u Rwanda' : 'Rwanda Highway Code Syllabus'}
              </span>
              <Link
                to="/learning"
                className="px-4 py-2 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>{lang === 'rw' ? 'Reba Integanyanyigisho' : 'View Curriculum'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-ink-100/60 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg mb-2">
              Need a Refresher?
            </h4>
            <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed mb-6">
              You can replay the 8-step dashboard guide walkthrough at any time to discover all features of your student hub.
            </p>
          </div>

          <button
            onClick={replayTutorial}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold btn-ghost border border-ink-200 dark:border-ink-800 inline-flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>Launch Guide Walkthrough</span>
          </button>
        </div>
      </div>
    </div>
  );
}

