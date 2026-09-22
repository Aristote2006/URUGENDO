import React, { useState, useEffect, useId } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Award,
  Lock,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { exerciseService } from '../../services/exerciseService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function ExercisePlayer() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Core Data
  const [exerciseData, setExerciseData] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [attemptStatus, setAttemptStatus] = useState('not_started');
  const [latestAttempt, setLatestAttempt] = useState(null);

  // Active Player State
  // Modes: 'intro' | 'playing' | 'completed' | 'review'
  const [viewMode, setViewMode] = useState('intro');
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [immediateFeedback, setImmediateFeedback] = useState(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());

  // Review State
  const [reviewData, setReviewData] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'correct' | 'incorrect'
  const [loadingReview, setLoadingReview] = useState(false);

  // General Status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch exercise data for this lesson
  const loadExerciseData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await exerciseService.getExerciseForLesson(lessonId);

      if (res.success && res.data) {
        setExerciseData(res.data.exercise || null);
        setLesson(res.data.lesson || null);
        setIsVideoCompleted(Boolean(res.data.progress?.videoCompleted));
        setAttemptStatus(res.data.attemptStatus || 'not_started');
        setLatestAttempt(res.data.latestAttempt || null);

        // If latest attempt is completed and was just finished, stay on completed or intro
        if (res.data.attemptStatus === 'in_progress' && res.data.latestAttempt) {
          // Attempt is in progress
          setActiveAttempt(res.data.latestAttempt);
          const answered = new Set(res.data.latestAttempt.answeredQuestionIds || []);
          setAnsweredQuestionIds(answered);

          // Find first unanswered question index
          const questions = res.data.exercise?.questions || [];
          const nextIdx = questions.findIndex((q) => !answered.has(q._id.toString()));
          setCurrentQuestionIndex(nextIdx >= 0 ? nextIdx : 0);
        }
      }
    } catch (err) {
      console.error('[ExercisePlayer] Error loading exercise:', err);
      setError(err.message || 'Failed to load exercise.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExerciseData();
  }, [lessonId]);

  // Start or resume attempt
  const handleStartAttempt = async (retake = false) => {
    if (!exerciseData?._id) return;
    try {
      setLoading(true);
      setError('');
      const res = await exerciseService.startOrResumeAttempt(exerciseData._id, retake);

      if (res.success && res.data?.attempt) {
        const attempt = res.data.attempt;
        setActiveAttempt(attempt);

        const answered = new Set((attempt.answers || []).map((a) => a.questionId.toString()));
        setAnsweredQuestionIds(answered);

        // Find next unanswered question index
        const questions = exerciseData.questions || [];
        const nextIdx = questions.findIndex((q) => !answered.has(q._id.toString()));
        setCurrentQuestionIndex(nextIdx >= 0 ? nextIdx : 0);

        setSelectedOption('');
        setImmediateFeedback(null);
        setViewMode('playing');
      }
    } catch (err) {
      setError(err.message || 'Failed to start exercise.');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for current question
  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOption || submittingAnswer || immediateFeedback) return;

    const currentQuestion = exerciseData?.questions?.[currentQuestionIndex];
    if (!currentQuestion || !activeAttempt?._id) return;

    try {
      setSubmittingAnswer(true);
      setError('');

      const res = await exerciseService.submitAnswer(
        exerciseData._id,
        activeAttempt._id,
        currentQuestion._id,
        selectedOption
      );

      if (res.success && res.data) {
        const feedback = res.data;
        setImmediateFeedback(feedback);

        // Update answered questions set
        setAnsweredQuestionIds((prev) => new Set([...prev, currentQuestion._id.toString()]));

        // Update active attempt state
        setActiveAttempt((prev) => ({
          ...prev,
          answeredCount: feedback.attempt?.answeredCount || (prev?.answeredCount || 0) + 1,
          completed: feedback.isCompleted,
        }));

        if (feedback.isCompleted && feedback.summary) {
          setLatestAttempt(feedback.summary);
          setAttemptStatus('completed');
        }
      }
    } catch (err) {
      setError(err.message || 'Could not submit your answer. Please check your connection and try again.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Advance to next question or show completed screen
  const handleNextQuestion = () => {
    if (immediateFeedback?.isCompleted) {
      setViewMode('completed');
      setImmediateFeedback(null);
      return;
    }

    const totalQ = exerciseData?.questions?.length || 0;
    if (currentQuestionIndex < totalQ - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption('');
      setImmediateFeedback(null);
      setError('');
    } else {
      // Reached end of questions
      setViewMode('completed');
      setImmediateFeedback(null);
    }
  };

  // Load review questions for completed attempt
  const handleOpenReview = async (attemptId) => {
    const idToLoad = attemptId || activeAttempt?._id || latestAttempt?._id;
    if (!exerciseData?._id || !idToLoad) return;

    try {
      setLoadingReview(true);
      setError('');
      const res = await exerciseService.getAttempt(exerciseData._id, idToLoad);
      if (res.success && res.data) {
        setReviewData(res.data);
        setViewMode('review');
      }
    } catch (err) {
      setError(err.message || 'Failed to load review answers.');
    } finally {
      setLoadingReview(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fadeIn">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {lang === 'rw' ? 'Gufungura imyitozo...' : 'Loading exercise...'}
        </p>
      </div>
    );
  }

  // 2. Exercise Not Available Yet
  if (!exerciseData || exerciseData.questionCount === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {lang === 'rw' ? 'Imyitozo Ntabwo Iraboneka' : 'Exercise Not Available Yet'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {lang === 'rw'
              ? 'Imyitozo y’iri somo ntabwo iratangazwa n’abarimu. Ongera ugerageze mu gihe kiri imbere.'
              : 'The practice exercise for this lesson has not been published yet. Please check back later.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={`/learning/${lessonId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Gusubira ku Isomo' : 'Return to Lesson'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Video Locked State (Phase 2 prerequisite)
  if (!isVideoCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {lang === 'rw' ? 'Reba Video Y’Isomo Mbere' : 'Complete Lesson Video First'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {lang === 'rw'
              ? 'Kugira ngo utangire iyi myitozo, banza urebe video y’isomo kugeza irangiye.'
              : 'To unlock and start this exercise, please watch the full lesson video first.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={`/learning/${lessonId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Komeza Kureba Isomo' : 'Watch Lesson Video'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Current Question
  const questions = exerciseData.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = totalQuestions > 0
    ? Math.round((answeredQuestionIds.size / totalQuestions) * 100)
    : 0;

  // -------------------------------------------------------------
  // VIEW MODE: INTRO SCREEN
  // -------------------------------------------------------------
  if (viewMode === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-4">
        <SEO
          title={`${exerciseData.title} · Practice Exercise`}
          description="Interactive lesson practice quiz with immediate feedback and highway code explanations."
          canonical={`/learning/${lessonId}/exercise`}
        />

        {/* Back link */}
        <div>
          <Link
            to={`/learning/${lessonId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Gusubira ku Isomo' : `Back to Lesson ${lesson?.lessonNumber || ''}`}</span>
          </Link>
        </div>

        {/* Intro Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lesson?.moduleTitle?.en ? `Module ${lesson.moduleNumber || 1}` : 'Official Lesson Practice'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {exerciseData.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {exerciseData.description ||
                (lang === 'rw'
                  ? 'Isuzumire ubumenyi wungutse muri iri somo. Uhabwa ibisubizo nyabyo n’ibisobanuro by’amategeko ako kanya kuri buri kibazo.'
                  : 'Test what you have learned from this lesson. You will receive immediate feedback and traffic law explanations after answering each question.')}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                {lang === 'rw' ? 'Ibibazo Byose' : 'Total Questions'}
              </span>
              <span className="text-xl font-display font-bold text-slate-900 dark:text-white">
                {totalQuestions}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                {lang === 'rw' ? 'Ibisobanuro' : 'Feedback'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {lang === 'rw' ? 'Ako Kanya ✓' : 'Immediate ✓'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                {lang === 'rw' ? 'Ubwoko' : 'Format'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Multiple Choice
              </span>
            </div>
          </div>

          {/* Previous Attempt Summary if Available */}
          {latestAttempt && latestAttempt.completed && (
            <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 block">
                  {lang === 'rw' ? 'Ibyavuye mu myitozo iheruka' : 'Previous Result'}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {latestAttempt.correctCount} / {latestAttempt.totalQuestions} {lang === 'rw' ? 'Byari byo' : 'Correct'} · Score: {latestAttempt.percentage}%
                </p>
              </div>

              <button
                onClick={() => handleOpenReview(latestAttempt._id)}
                disabled={loadingReview}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'rw' ? 'Reba Ibisobanuro' : 'Review Answers'}</span>
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {attemptStatus === 'in_progress' ? (
              <button
                onClick={() => handleStartAttempt(false)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'rw' ? 'Komeza Imyitozo' : 'Continue Exercise'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : latestAttempt && latestAttempt.completed ? (
              <>
                <button
                  onClick={() => handleStartAttempt(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'rw' ? 'Ongera Witoze' : 'Retake Exercise'}</span>
                </button>
                <button
                  onClick={() => handleOpenReview(latestAttempt._id)}
                  disabled={loadingReview}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'rw' ? 'Reba Ibisobanuro' : 'Review Answers'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleStartAttempt(false)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'rw' ? 'Tangira Imyitozo' : 'Start Exercise'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE: PLAYING / ACTIVE QUESTION
  // -------------------------------------------------------------
  if (viewMode === 'playing' && currentQuestion) {
    const isAnswered = Boolean(immediateFeedback);
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-4">
        {/* Header & Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <Link
              to={`/learning/${lessonId}`}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Gusubira ku Isomo' : 'Back to Lesson'}</span>
            </Link>

            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Question Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {lang === 'rw' ? `Ikibazo cya ${currentQuestion.questionNumber}` : `Question ${currentQuestion.questionNumber}`}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {totalQuestions - (currentQuestionIndex + 1)} {lang === 'rw' ? 'bisigaye' : 'remaining'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {/* Options Group (Accessible Semantic Radio Inputs) */}
          <fieldset className="space-y-3">
            <legend className="sr-only">Choose an answer</legend>
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.label;
              const isCorrectAnswer = isAnswered && immediateFeedback?.correctOption === opt.label;
              const isSelectedWrong = isAnswered && isSelected && !immediateFeedback?.correct;

              let cardStyle =
                'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-brand-400 dark:hover:border-brand-600';
              let badgeStyle = 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400';

              if (isSelected && !isAnswered) {
                cardStyle = 'border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-sm';
                badgeStyle = 'border-brand-600 bg-brand-600 text-white font-bold';
              } else if (isCorrectAnswer) {
                cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold';
                badgeStyle = 'border-emerald-600 bg-emerald-600 text-white font-bold';
              } else if (isSelectedWrong) {
                cardStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                badgeStyle = 'border-rose-600 bg-rose-600 text-white font-bold';
              }

              return (
                <label
                  key={opt.label}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-3.5 cursor-pointer transition-all ${cardStyle} ${
                    isAnswered ? 'cursor-default' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="exercise-option"
                    value={opt.label}
                    checked={isSelected}
                    disabled={isAnswered || submittingAnswer}
                    onChange={() => setSelectedOption(opt.label)}
                    className="sr-only"
                  />
                  <span
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${badgeStyle}`}
                  >
                    {opt.label}
                  </span>
                  <span className="flex-1 pt-1 text-slate-800 dark:text-slate-200 leading-normal">
                    {opt.text}
                  </span>
                  {isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  {isSelectedWrong && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                </label>
              );
            })}
          </fieldset>

          {/* Immediate Feedback Card */}
          {isAnswered && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                immediateFeedback.correct
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80'
              }`}
            >
              <div className="flex items-center gap-2">
                {immediateFeedback.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                      {lang === 'rw' ? 'Nibyo Cyane! Akazi keza.' : 'Correct! Well done.'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span className="font-bold text-rose-800 dark:text-rose-200 text-sm">
                      {lang === 'rw'
                        ? `Sibyo. Igisubizo cy’ukuri ni: ${immediateFeedback.correctOption}`
                        : `Incorrect. The correct answer is: ${immediateFeedback.correctOption}`}
                    </span>
                  </>
                )}
              </div>

              {/* Explanation text */}
              {immediateFeedback.explanation && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-bold block mb-1">
                    {lang === 'rw' ? 'Ibisobanuro by’Amategeko:' : 'Official Highway Code Rationale:'}
                  </span>
                  <p>{immediateFeedback.explanation}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              {lang === 'rw' ? 'Hitamo igisubizo kimwe' : 'Select one answer'}
            </span>

            {!isAnswered ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submittingAnswer}
                className={`px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
                  !selectedOption || submittingAnswer
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-brand-600 hover:bg-brand-500 text-white'
                }`}
              >
                {submittingAnswer ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'rw' ? 'Kugenzura...' : 'Checking...'}</span>
                  </>
                ) : (
                  <span>{lang === 'rw' ? 'Suzuma Igisubizo' : 'Check Answer'}</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-7 py-3 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-md inline-flex items-center gap-1.5 transition-all"
              >
                <span>
                  {isLastQuestion
                    ? lang === 'rw'
                      ? 'Reba Ibyavuyemo'
                      : 'View Final Results'
                    : lang === 'rw'
                    ? 'Ikibazo Gikurikira'
                    : 'Next Question'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE: COMPLETED RESULTS SCREEN
  // -------------------------------------------------------------
  if (viewMode === 'completed') {
    const summary = latestAttempt || {};
    const correct = summary.correctCount || 0;
    const total = summary.totalQuestions || totalQuestions;
    const scorePct = summary.percentage !== undefined ? summary.percentage : Math.round((correct / (total || 1)) * 100);
    const incorrect = summary.incorrectCount || Math.max(0, total - correct);

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn py-6">
        <SEO
          title="Exercise Completed · Urugendo Student Portal"
          description="Practice exercise completion summary and score review."
          canonical={`/learning/${lessonId}/exercise`}
        />

        {/* Results Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'rw' ? 'Imyitozo Yarangiye!' : 'Exercise Complete!'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {exerciseData.title} · Lesson {lesson?.lessonNumber}
            </p>
          </div>

          {/* Big Score Counter */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 inline-block px-12">
            <span className="text-4xl sm:text-5xl font-display font-extrabold text-brand-600 dark:text-brand-400 tracking-tight block">
              {scorePct}%
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              {correct} / {total} {lang === 'rw' ? 'Bikozwe neza' : 'Correct'}
            </span>
          </div>

          {/* KPI Mini-cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                {lang === 'rw' ? 'Ibyo Watsinze' : 'Correct'}
              </span>
              <span className="text-lg font-display font-bold text-emerald-800 dark:text-emerald-200">
                {correct}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 block mb-0.5">
                {lang === 'rw' ? 'Ibyakugoye' : 'Incorrect'}
              </span>
              <span className="text-lg font-display font-bold text-rose-800 dark:text-rose-200">
                {incorrect}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                {lang === 'rw' ? 'Ibibazo Byose' : 'Total'}
              </span>
              <span className="text-lg font-display font-bold text-slate-800 dark:text-slate-200">
                {total}
              </span>
            </div>
          </div>

          {/* Lesson Completion Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {lang === 'rw'
                ? 'Imyitozo yanditswe muri sisitemu. Isomo ryuzuye neza!'
                : 'Your exercise has been officially recorded. Lesson requirements satisfied!'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleOpenReview()}
              disabled={loadingReview}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Reba Ibisobanuro' : 'Review Answers'}</span>
            </button>

            <button
              onClick={() => handleStartAttempt(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Ongera Witoze' : 'Retake Exercise'}</span>
            </button>

            <Link
              to={`/learning/${lessonId}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md inline-flex items-center justify-center gap-2 transition-all"
            >
              <span>{lang === 'rw' ? 'Gusubira ku Isomo' : 'Return to Lesson'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE: REVIEW ALL ANSWERS
  // -------------------------------------------------------------
  if (viewMode === 'review') {
    const questionsList = reviewData?.reviewQuestions || [];
    const filteredQuestions = questionsList.filter((q) => {
      if (reviewFilter === 'correct') return q.correct === true;
      if (reviewFilter === 'incorrect') return q.correct === false;
      return true;
    });

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-4">
        <SEO
          title={`Review Answers · ${exerciseData.title}`}
          description="Detailed review of submitted answers and official explanations."
          canonical={`/learning/${lessonId}/exercise`}
        />

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <button
              onClick={() => setViewMode('completed')}
              className="text-xs font-semibold text-slate-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Gusubira ku Byavuyemo' : 'Back to Results'}</span>
            </button>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {lang === 'rw' ? 'Ibisobanuro by’Ibibazo Byose' : 'Review Exercise Answers'}
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reviewFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({questionsList.length})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reviewFilter === 'correct'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Correct ({questionsList.filter((q) => q.correct).length})
            </button>
            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reviewFilter === 'incorrect'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Incorrect ({questionsList.filter((q) => !q.correct).length})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            return (
              <div
                key={q.questionId || idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Question {q.questionNumber || idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.questionText}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 flex-shrink-0 ${
                      q.correct
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {q.correct ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt) => {
                    const isUserChoice = q.selectedOption === opt.label;
                    const isCorrectAnswer = q.correctOption === opt.label;

                    let optStyle =
                      'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300';
                    let labelBadge = 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400';

                    if (isCorrectAnswer) {
                      optStyle =
                        'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold';
                      labelBadge = 'border-emerald-600 bg-emerald-600 text-white';
                    } else if (isUserChoice && !q.correct) {
                      optStyle =
                        'border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                      labelBadge = 'border-rose-600 bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.label}
                        className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${optStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0 ${labelBadge}`}
                        >
                          {opt.label}
                        </span>
                        <span className="flex-1 pt-0.5">{opt.text}</span>
                        {isUserChoice && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Your Choice
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-brand-800 dark:text-brand-300 block mb-1">
                      {lang === 'rw' ? 'Ibisobanuro by’Amategeko:' : 'Traffic Law Explanation:'}
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <button
            onClick={() => setViewMode('completed')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-all"
          >
            {lang === 'rw' ? 'Gusubira ku Byavuyemo' : 'Back to Results'}
          </button>

          <Link
            to={`/learning/${lessonId}`}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            {lang === 'rw' ? 'Gusubira ku Isomo' : 'Return to Lesson'}
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

