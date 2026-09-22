import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Player from '@vimeo/player';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ArrowLeft,
  Check,
  Lock,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  FileText,
  Volume2,
  Play,
  Eye,
  FileQuestion,
} from 'lucide-react';
import { lessonService } from '../../services/lessonService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return '0:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function LessonViewer() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lockDetails, setLockDetails] = useState(null);

  // Video & Exercise State
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [hasExercise, setHasExercise] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [seekWarning, setSeekWarning] = useState('');
  const [syncingProgress, setSyncingProgress] = useState(false);
  const [currentProgressPct, setCurrentProgressPct] = useState(0);

  // References
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const furthestWatchedRef = useRef(0);
  const lastSyncTimeRef = useRef(0);
  const isCompletedRef = useRef(false);

  // Fetch lesson data and verify sequential lock
  const loadLesson = async () => {
    try {
      setLoading(true);
      setError('');
      setLockDetails(null);

      const res = await lessonService.getLessonById(lessonId);
      if (res.success && res.data) {
        const { lesson: lessonData, progress: progressData, navigation: navData } = res.data;
        setLesson(lessonData);
        setProgress(progressData);
        setNavigation(navData);
        setHasExercise(Boolean(res.data.hasExercise));
        setExerciseId(res.data.exerciseId || null);

        const furthest = progressData?.furthestWatchedSeconds || 0;
        furthestWatchedRef.current = furthest;

        const videoCompleted = Boolean(progressData?.videoCompleted);
        const exerciseCompleted = Boolean(progressData?.exerciseCompleted);
        const lessonCompleted = Boolean(progressData?.lessonCompleted);

        setIsVideoCompleted(videoCompleted);
        setIsExerciseCompleted(exerciseCompleted);
        setIsLessonCompleted(lessonCompleted);
        isCompletedRef.current = videoCompleted;

        setCurrentProgressPct(progressData?.progressPercentage || 0);
      }
    } catch (err) {
      console.error('[LessonViewer] Error loading lesson:', err);
      if (err.locked) {
        setLockDetails(err.requiredLesson || { lessonNumber: 1 });
      } else {
        setError(err.message || 'Failed to load lesson details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
    return () => {
      // Cleanup player instance when component unmounts or lessonId changes
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => {});
        playerRef.current = null;
      }
    };
  }, [lessonId]);

  // Sync progress to backend
  const syncProgressToBackend = async (currentTime, duration) => {
    if (!lesson?._id) return;
    try {
      setSyncingProgress(true);
      const res = await lessonService.updateProgress(lesson._id, {
        currentTime,
        duration,
      });

      if (res.success && res.data) {
        setCurrentProgressPct(res.data.progressPercentage);
        if (res.data.videoCompleted && !isCompletedRef.current) {
          setIsVideoCompleted(true);
          isCompletedRef.current = true;
        }
      }
    } catch (err) {
      console.warn('[LessonViewer] Failed to sync progress:', err.message);
    } finally {
      setSyncingProgress(false);
    }
  };

  // Setup Vimeo Player once lesson data is ready and container is in DOM
  useEffect(() => {
    if (!lesson || !lesson.vimeoVideoId || lockDetails || !videoContainerRef.current) return;

    // Destroy any existing player instance before creating a new one
    if (playerRef.current) {
      playerRef.current.destroy().catch(() => {});
      playerRef.current = null;
    }

    // Determine numeric video ID
    const videoId = lesson.vimeoVideoId;

    // Clear container
    videoContainerRef.current.innerHTML = '';

    // Initialize Vimeo Player
    const player = new Player(videoContainerRef.current, {
      id: videoId,
      responsive: true,
      autoplay: false,
      title: false,
      byline: false,
      portrait: false,
      speed: true,
    });

    playerRef.current = player;

    player.ready().then(async () => {
      try {
        const duration = await player.getDuration();

        // Resume from last watched position if valid and not already finished
        const resumeTime = progress?.watchedSeconds || 0;
        if (resumeTime > 5 && !isCompletedRef.current && resumeTime < duration - 10) {
          await player.setCurrentTime(resumeTime);
        }
      } catch (e) {
        console.warn('[Vimeo] Ready initialization error:', e);
      }
    });

    // 1. Time Update Listener (tracks furthest watched)
    player.on('timeupdate', (data) => {
      const now = data.seconds;
      const duration = data.duration || lesson.durationSeconds || 600;

      // Update furthest watched point if current playback is further
      if (now > furthestWatchedRef.current) {
        furthestWatchedRef.current = now;
      }

      // Calculate progress percentage
      if (duration > 0) {
        const pct = Math.min(100, Math.round((furthestWatchedRef.current / duration) * 100));
        setCurrentProgressPct(pct);

        // Auto mark complete when passing 90% threshold
        if (pct >= 90 && !isCompletedRef.current) {
          setIsVideoCompleted(true);
          isCompletedRef.current = true;
          lessonService.markVideoComplete(lesson._id).catch(() => {});
        }
      }

      // Throttle backend sync to every 6 seconds
      const currentTimeStamp = Date.now();
      if (currentTimeStamp - lastSyncTimeRef.current >= 6000) {
        lastSyncTimeRef.current = currentTimeStamp;
        syncProgressToBackend(now, duration);
      }
    });

    // 2. Seeked Listener (Anti-forward seeking enforcement)
    player.on('seeked', async (data) => {
      const seekTarget = data.seconds;
      const furthest = furthestWatchedRef.current;

      // If user is already completed, allow free forward seeking for revision
      if (isCompletedRef.current) return;

      // Check if user is attempting to skip forward past watched point (+2.5s tolerance)
      if (seekTarget > furthest + 2.5) {
        // Enforce backward/watched boundary
        await player.setCurrentTime(furthest);
        setSeekWarning(
          'Fast-forwarding is disabled. You must watch the video sequentially to complete this lesson.'
        );

        // Dismiss warning after 4 seconds
        setTimeout(() => setSeekWarning(''), 4000);
      }
    });

    // 3. Pause Listener (instant sync on pause)
    player.on('pause', async (data) => {
      syncProgressToBackend(data.seconds, data.duration);
    });

    // 4. Ended Listener (mark 100% complete)
    player.on('ended', async () => {
      setIsVideoCompleted(true);
      isCompletedRef.current = true;
      setCurrentProgressPct(100);
      try {
        await lessonService.markVideoComplete(lesson._id);
      } catch (err) {
        console.warn('[Vimeo] markVideoComplete error:', err);
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => {});
        playerRef.current = null;
      }
    };
  }, [lesson, lockDetails]);

  // Render Sequential Lock Barrier
  if (lockDetails) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Lesson Locked
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            To ensure comprehensive knowledge of Rwandan traffic law, lessons must be completed sequentially.
            Please finish watching the required previous lesson first.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 max-w-md mx-auto text-left text-xs space-y-2">
          <span className="font-bold text-amber-900 dark:text-amber-200 block uppercase tracking-wider text-[11px]">
            Required Lesson
          </span>
          <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm">
            Lesson {lockDetails.lessonNumber}: {lockDetails.title?.en || 'Previous Lesson'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to="/learning"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Back to Curriculum
          </Link>

          {lockDetails.id && (
            <Link
              to={`/learning/${lockDetails.id}`}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
            >
              <span>Go to Lesson {lockDetails.lessonNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Render Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading video lecture...</p>
      </div>
    );
  }

  // Render Error State
  if (error || !lesson) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
          Unable to load lesson
        </h3>
        <p className="text-xs text-slate-500">{error || 'Lesson not found.'}</p>
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Curriculum</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <SEO
        title={`Lesson ${lesson.lessonNumber}: ${lesson.title?.en} · Urugendo`}
        description={lesson.summary?.en || 'Highway Code Video Lecture'}
        canonical={`/learning/${lesson._id}`}
      />

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Curriculum Lessons</span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">
          Module {lesson.moduleNumber || 1} • Lesson {lesson.lessonNumber} of {navigation?.totalLessons || 8}
        </span>
      </div>

      {/* Anti-Forward Seeking Warning Alert */}
      {seekWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{seekWarning}</span>
          </div>
          <button onClick={() => setSeekWarning('')} className="text-amber-500 hover:text-amber-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Video Completed Notification Banner */}
      {isVideoCompleted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                Video Lecture Completed!
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                You have fulfilled the video requirement for this lesson. (Practice exercises will unlock in Phase 3).
              </p>
            </div>
          </div>

          {navigation?.nextLessonId && (
            <Link
              to={`/learning/${navigation.nextLessonId}`}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Proceed to Lesson {navigation.nextLessonNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Video Player Container */}
      <div className="rounded-3xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="relative aspect-video">
          {lesson.vimeoVideoId ? (
            <div ref={videoContainerRef} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-3">
              <Video className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'rw' ? 'Nta mashusho arashyirwaho kuri iri somo' : 'No video published for this lesson yet'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                {lang === 'rw'
                  ? 'Amashusho y’iri somo azashyirwaho n’umuyobozi w’integanyanyigisho.'
                  : 'The instructor has not attached a video lecture to this lesson yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Video Sub-bar */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isVideoCompleted ? 'bg-emerald-400' : 'bg-brand-500 animate-pulse'}`} />
            <span className="font-semibold text-slate-200">
              {isVideoCompleted ? 'Status: Completed ✓' : `Watch Progress: ${currentProgressPct}%`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Duration: {formatDuration(lesson.durationSeconds)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Details & Objectives */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Module 0{lesson.moduleNumber || 1}: {lang === 'rw' && lesson.moduleTitle?.rw ? lesson.moduleTitle.rw : lesson.moduleTitle?.en}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white mt-1">
              {lang === 'rw' && lesson.title?.rw ? lesson.title.rw : lesson.title?.en}
            </h1>
            {lesson.summary?.en && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                {lang === 'rw' && lesson.summary?.rw ? lesson.summary.rw : lesson.summary?.en}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 transition-all ${
                isLessonCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : isVideoCompleted
                  ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 border border-brand-300 dark:border-brand-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isLessonCompleted
                  ? 'Lesson Completed ✓'
                  : isVideoCompleted
                  ? hasExercise && !isExerciseCompleted
                    ? 'Video Complete ✓ (Exercise Next)'
                    : 'Video Completed ✓'
                  : `${currentProgressPct}% Watched`}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        {((lesson.objectives?.en && lesson.objectives.en.length > 0) || (lesson.objectives?.rw && lesson.objectives.rw.length > 0)) && (
          <div>
            <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>{lang === 'rw' ? 'Ibyo Witeguye Kumenya' : 'Learning Objectives'}</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(lang === 'rw' && lesson.objectives?.rw?.length > 0
                ? lesson.objectives.rw
                : lesson.objectives?.en || []
              ).map((obj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Highway Code Notes */}
        {(lesson.notes?.en || lesson.notes?.rw) && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-bold text-base mb-2 text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{lang === 'rw' ? 'Amategeko Y’Umuhanda n’Ibisobanuro' : 'Official Traffic Code Reference & Summary'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-brand-50/50 dark:bg-brand-950/30 p-4 rounded-2xl border border-brand-200 dark:border-brand-900/40">
              {lang === 'rw' && lesson.notes?.rw ? lesson.notes.rw : lesson.notes?.en}
            </p>
          </div>
        )}
      </div>

      {/* Connected Practice Exercise Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Imyitozo y’Isomo' : 'Lesson Practice Exercise'}</span>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {lang === 'rw' ? 'Isuzumire Ubumenyi Wungutse' : 'Test What You Have Learned'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {hasExercise
                ? (lang === 'rw'
                    ? 'Ibibazo by’amahitamo byemejwe n’abarimu biteguye kukugaragariza uburyo wumvise iri somo.'
                    : 'Reinforce your highway code understanding with official multiple-choice questions and immediate feedback.')
                : (lang === 'rw'
                    ? 'Imyitozo y’iri somo ntabwo iratangazwa n’abarimu. Nyuma yo kureba video, urahita ukomereza ku isomo rikurikira.'
                    : 'The practice exercise for this lesson has not been published yet. Completing the video allows you to continue.')}
            </p>
          </div>

          <div className="flex-shrink-0">
            {!hasExercise ? (
              <span className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold inline-flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Nta myitozo iratangazwa' : 'Exercise Not Available Yet'}</span>
              </span>
            ) : !isVideoCompleted ? (
              <div
                title="Watch the full lesson video first to unlock this exercise"
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs inline-flex items-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                <Lock className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Banza urebe video y’isomo' : 'Complete Video First'}</span>
              </div>
            ) : isExerciseCompleted ? (
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'rw' ? 'Yarangiye ✓' : 'Completed ✓'}</span>
                </span>
                <Link
                  to={`/learning/${lessonId}/exercise`}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'rw' ? 'Ongera Usure' : 'Review Exercise'}</span>
                </Link>
              </div>
            ) : (
              <Link
                to={`/learning/${lessonId}/exercise`}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{lang === 'rw' ? 'Tangira Imyitozo' : 'Start Practice Exercise'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 pb-6">
        {navigation?.prevLessonId ? (
          <Link
            to={`/learning/${navigation.prevLessonId}`}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: Lesson {navigation.prevLessonNumber}</span>
          </Link>
        ) : (
          <div />
        )}

        {navigation?.nextLessonId ? (
          (hasExercise ? isLessonCompleted : isVideoCompleted) ? (
            <Link
              to={`/learning/${navigation.nextLessonId}`}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span>Next: Lesson {navigation.nextLessonNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              disabled
              title={
                hasExercise && isVideoCompleted && !isExerciseCompleted
                  ? 'Complete the practice exercise to unlock next lesson'
                  : 'Complete current video to unlock next lesson'
              }
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 inline-flex items-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Next: Lesson {navigation.nextLessonNumber}</span>
            </button>
          )
        ) : (
          <Link
            to="/mock-exams"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white inline-flex items-center gap-2 shadow-md"
          >
            <span>Take Practice Mock Exam</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
