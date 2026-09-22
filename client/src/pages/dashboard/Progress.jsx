import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  ListChecks,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { lessonService } from '../../services/lessonService';

export default function Progress() {
  const { user } = useAuth();
  const { lang } = useLanguage();

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
          setCurriculumStats({
            total: res.data.totalLessons !== undefined ? res.data.totalLessons : (res.data.lessons?.length || 0),
            completed: res.data.completedLessons || 0,
            percent: res.data.overallProgressPercent || 0,
          });
        }
      } catch (err) {
        console.warn('[Progress] Could not load lessons:', err.message);
      }
    };
    fetchProgress();
  }, []);

  const completedLessons = user?.progress?.completedLessons || [];
  const completedExercises = user?.progress?.completedExercises || 0;
  const examAttempts = user?.progress?.examAttempts || [];

  const totalLessons = curriculumStats.total;
  const lessonsPercentage = totalLessons > 0 ? curriculumStats.percent : 0;

  // Compute average and best mock exam scores
  let avgExamScore = 0;
  let bestExamScore = 0;
  let passedExamsCount = 0;

  if (examAttempts.length > 0) {
    const totalScore = examAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0);
    avgExamScore = Math.round(totalScore / examAttempts.length);
    bestExamScore = Math.max(...examAttempts.map((a) => a.percentage || 0));
    passedExamsCount = examAttempts.filter((a) => a.passed).length;
  }

  // Calculate readiness score
  // Based on lessons progress (35%), exercises practice (25%), and exam performance (40%)
  const readiness = Math.min(
    100,
    Math.round(
      lessonsPercentage * 0.35 +
        Math.min(100, completedExercises * 4) * 0.25 +
        (examAttempts.length > 0 ? bestExamScore : 0) * 0.4
    )
  );

  // Topic mastery estimations
  const topicMastery = [
    {
      id: 'signs',
      title: lang === 'rw' ? "Ibyapa n'ibimenyetso byo mu muhanda" : 'Traffic Signs & Signals',
      desc: lang === 'rw' ? 'Ibyapa biburira, ibitegeka, n’ibibuza' : 'Warning, mandatory, and regulatory road signs',
      progress: Math.min(
        100,
        (completedLessons.includes('les-4') ? 50 : 0) +
          (completedLessons.includes('les-5') ? 30 : 0) +
          Math.min(20, completedExercises * 2)
      ),
    },
    {
      id: 'rules',
      title: lang === 'rw' ? "Amategeko rusange yo kugenda mu muhanda" : 'General Rules of the Road',
      desc: lang === 'rw' ? 'Umuvuduko, kunyuranaho, n’ibisabwa' : 'Speed limits, overtaking, and road positioning',
      progress: Math.min(
        100,
        (completedLessons.includes('les-1') ? 50 : 0) +
          (completedLessons.includes('les-2') ? 30 : 0) +
          Math.min(20, completedExercises * 2)
      ),
    },
    {
      id: 'priority',
      title: lang === 'rw' ? 'Uburenganzira bwo gutambuka (Priorities)' : 'Right of Way & Intersections',
      desc: lang === 'rw' ? 'Ibyerekezo, roundabouts, n’amasangano' : 'Junctions, roundabouts, and priority from the right',
      progress: Math.min(
        100,
        (completedLessons.includes('les-3') ? 60 : 0) +
          (completedLessons.includes('les-6') ? 25 : 0) +
          Math.min(15, completedExercises * 2)
      ),
    },
    {
      id: 'safety',
      title: lang === 'rw' ? "Umutekano n'ibihano byo mu muhanda" : 'Vehicle Safety, Lights & Penalties',
      desc: lang === 'rw' ? 'Amatara, amande, n’ubutabazi bw’ibanze' : 'Lighting, police fines, and emergency procedures',
      progress: Math.min(
        100,
        (completedLessons.includes('les-7') ? 50 : 0) +
          (completedLessons.includes('les-8') ? 35 : 0) +
          Math.min(15, completedExercises * 2)
      ),
    },
  ];

  const getReadinessLevel = (score) => {
    if (score >= 80) {
      return {
        label: lang === 'rw' ? 'Witeguye neza gukora ikizamini!' : 'Ready for Official Exam!',
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
        desc:
          lang === 'rw'
            ? 'Amanota yawe yarenze igipimo cyo gutsinda cya 80% (16/20). Ushobora kwiyandikisha ku kizamini cya Polisi!'
            : 'Your performance exceeds the official 80% (16/20) passing mark. You are well prepared for the Rwanda National Police exam!',
      };
    }
    if (score >= 50) {
      return {
        label: lang === 'rw' ? 'Ugeze kure (Gukomeza gukora)' : 'On Track (Keep Practicing)',
        color: 'text-brand-700 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/60 border-brand-300 dark:border-brand-800',
        desc:
          lang === 'rw'
            ? 'Ufite intambwe ishimishije ariko uracyakeneye gukora ibizamini by’imyitozo kugira ngo urenze 80%.'
            : 'Good progress, but you still need more timed mock exam drills to consistently beat the 80% pass threshold.',
      };
    }
    return {
      label: lang === 'rw' ? 'Uracyakeneye imyitozo' : 'Needs Practice',
      color: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
      desc:
        lang === 'rw'
          ? 'Reba amasomo y’amashusho yose kandi ukore imyitozo myinshi mbere yo gukora ibizamini by’igerageza.'
          : 'Watch video lessons and complete topic exercises to build your foundational knowledge before taking mock exams.',
    };
  };

  const readinessStatus = getReadinessLevel(readiness);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Ibarurishamibare ry’imyigire' : 'Learning Analytics'}</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          {lang === 'rw' ? 'Iterambere ryange' : 'My Exam Readiness & Progress'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'rw'
            ? 'Kurikirana aho ugeze witegura ikizamini cy’uruhushya rwa buri gihe rwo gutwara ibinyabiziga (Provisional).'
            : 'Track your readiness score and benchmark your performance against Rwanda National Police requirements.'}
        </p>
      </div>

      {/* Main Readiness Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Circular/Gauge visual */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="text-slate-100 dark:text-slate-800 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className={`${
                    readiness >= 80
                      ? 'text-emerald-700'
                      : readiness >= 50
                      ? 'text-brand-700'
                      : 'text-amber-700'
                  } stroke-current transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - readiness / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">
                  {readiness}%
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  {lang === 'rw' ? 'Ubushobozi' : 'Readiness'}
                </span>
              </div>
            </div>

            <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold border ${readinessStatus.color}`}>
              {readinessStatus.label}
            </div>
          </div>

          {/* Explanation and Pass benchmark info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-700 dark:text-brand-400" />
                <span>
                  {lang === 'rw'
                    ? 'Igipimo cyo gutsinda cya Polisi y’u Rwanda: 80% (16/20)'
                    : 'Official Rwanda Police Passing Standard: 80% (16/20)'}
                </span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {readinessStatus.desc}
              </p>
            </div>

            {/* Benchmark meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>0% (Beginner)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">80% Pass Target (16/20)</span>
                <span>100%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-brand-700 transition-all duration-700 rounded-full"
                  style={{ width: `${readiness}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-700 z-10"
                  style={{ left: '80%' }}
                  title="Official passing mark: 80%"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/mock-exams"
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-sm"
              >
                <Target className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Kora ikizamini cy’igerageza' : 'Take a Mock Exam'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/learning"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Reba amasomo asigaye' : 'Study Remaining Lessons'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'rw' ? 'Amasomo Yarangiye' : 'Lessons Completed'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-700 dark:text-brand-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            {completedLessons.length}{' '}
            <span className="text-sm font-normal text-slate-400">/ {totalLessons}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lessonsPercentage}% {lang === 'rw' ? 'y’integanyanyigisho' : 'curriculum covered'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'rw' ? 'Imyitozo Yakozwe' : 'Exercises Practiced'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <ListChecks className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            {completedExercises}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'rw' ? 'Ibibazo byakozwe' : 'Questions drilled'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'rw' ? 'Ibizamini Byakozwe' : 'Mock Exams Taken'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            {examAttempts.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {passedExamsCount} {lang === 'rw' ? 'byatsinzwe (≥16/20)' : 'passed (≥16/20)'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'rw' ? 'Amanota Meza Cyane' : 'Best Exam Score'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            {bestExamScore > 0 ? `${bestExamScore}%` : '—'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {avgExamScore > 0 ? `${avgExamScore}% avg score` : lang === 'rw' ? 'Nta kizamini kirakorwa' : 'No attempts yet'}
          </p>
        </div>
      </div>

      {/* Topic Mastery Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            {lang === 'rw' ? 'Ubumenyi ku ngingo z’ingenzi' : 'Topic Mastery Breakdown'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'rw'
              ? 'Aho ugeze ku byiciro 4 by’ingenzi bigize ikizamini cya Polisi y’u Rwanda.'
              : 'Detailed breakdown across the 4 primary knowledge categories required for the Rwanda provisional exam.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicMastery.map((topic) => (
            <div
              key={topic.id}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {topic.desc}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-brand-700 dark:text-brand-400">
                  {topic.progress}%
                </span>
              </div>

              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    topic.progress >= 80
                      ? 'bg-emerald-700'
                      : topic.progress >= 50
                      ? 'bg-brand-700'
                      : 'bg-amber-700'
                  }`}
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Exam History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              {lang === 'rw' ? 'Amateka y’ibizamini wakoze' : 'Mock Exam Attempt History'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'rw'
                ? 'Ibizamini byose by’igerageza watsinze cyangwa wakoze.'
                : 'Complete log of your timed 20-question mock exam sessions.'}
            </p>
          </div>

          <Link
            to="/mock-exams"
            className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 inline-flex items-center gap-1"
          >
            <span>{lang === 'rw' ? 'Kora ikindi kizamini' : 'Take Exam'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {examAttempts.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {lang === 'rw'
                ? 'Nta kizamini cy’igerageza urakora kugeza ubu.'
                : 'No mock exam attempts recorded yet.'}
            </p>
            <Link
              to="/mock-exams"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Target className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Tangira Ikizamini cya 1' : 'Start Mock Exam 1'}</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 pr-4">{lang === 'rw' ? 'Ikizamini' : 'Exam'}</th>
                  <th className="pb-3 px-4">{lang === 'rw' ? 'Itariki' : 'Date'}</th>
                  <th className="pb-3 px-4">{lang === 'rw' ? 'Amanota' : 'Score'}</th>
                  <th className="pb-3 px-4">{lang === 'rw' ? 'Ijanisha' : 'Percentage'}</th>
                  <th className="pb-3 pl-4">{lang === 'rw' ? 'Ibisubizo' : 'Result'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examAttempts.map((attempt, idx) => {
                  const dateStr = attempt.date
                    ? new Date(attempt.date).toLocaleDateString(lang === 'rw' ? 'rw-RW' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                        {attempt.examId ? attempt.examId.toUpperCase() : `Exam #${idx + 1}`}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {dateStr}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {attempt.score} / {attempt.total || 20}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {attempt.percentage}%
                      </td>
                      <td className="py-3.5 pl-4">
                        {attempt.passed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'rw' ? 'Watsinze' : 'PASSED'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{lang === 'rw' ? 'Watsinzwe' : 'RETRY'}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

