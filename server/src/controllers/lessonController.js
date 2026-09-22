import { Lesson } from '../models/Lesson.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { Exercise } from '../models/Exercise.js';

/**
 * GET /api/lessons
 * Returns all published lessons with user-specific progress and sequential locking status.
 */
export const getLessons = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    // Fetch published lessons sorted by lessonNumber
    const lessons = await Lesson.find({ isPublished: true }).sort({ lessonNumber: 1 });

    // Fetch all published exercises to determine which lessons have exercises
    const publishedExercises = await Exercise.find({ status: 'published' }).select('lessonId');
    const publishedExerciseLessonSet = new Set(publishedExercises.map((e) => e.lessonId.toString()));

    // Fetch all progress records for this user
    const progressRecords = userId
      ? await LessonProgress.find({ user: userId })
      : [];

    const progressMap = new Map();
    progressRecords.forEach((p) => {
      progressMap.set(p.lesson.toString(), p);
    });

    // Determine sequential access
    // Lesson 1 is always unlocked.
    // Lesson N is unlocked if Lesson N-1 is complete (video + exercise if exercise exists).
    let previousCompleted = true; // For the first lesson

    const lessonsWithProgress = lessons.map((lesson, idx) => {
      const progress = progressMap.get(lesson._id.toString()) || {
        watchedSeconds: 0,
        furthestWatchedSeconds: 0,
        durationSeconds: lesson.durationSeconds || 0,
        progressPercentage: 0,
        videoCompleted: false,
        exerciseCompleted: false,
        lessonCompleted: false,
      };

      const hasExercise = publishedExerciseLessonSet.has(lesson._id.toString());
      const isLocked = !previousCompleted;

      // Lesson completed condition: video complete AND (exercise complete if published exercise exists)
      const isThisLessonCompleted = hasExercise
        ? Boolean(progress.videoCompleted && progress.exerciseCompleted)
        : Boolean(progress.videoCompleted);

      // Next lesson unlock requires current lesson completion
      previousCompleted = isThisLessonCompleted;

      return {
        _id: lesson._id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        summary: lesson.summary,
        vimeoUrl: lesson.vimeoUrl,
        vimeoVideoId: lesson.vimeoVideoId,
        durationSeconds: lesson.durationSeconds,
        moduleNumber: lesson.moduleNumber,
        moduleTitle: lesson.moduleTitle,
        thumbnailUrl: lesson.thumbnailUrl,
        isPublished: lesson.isPublished,
        hasExercise,
        isLocked,
        progress: {
          watchedSeconds: progress.watchedSeconds || 0,
          furthestWatchedSeconds: progress.furthestWatchedSeconds || 0,
          durationSeconds: progress.durationSeconds || lesson.durationSeconds || 0,
          progressPercentage: progress.progressPercentage || 0,
          videoCompleted: Boolean(progress.videoCompleted),
          exerciseCompleted: Boolean(progress.exerciseCompleted),
          lessonCompleted: isThisLessonCompleted,
          lastWatchedAt: progress.lastWatchedAt || null,
        },
      };
    });

    // Calculate curriculum stats
    const totalPublished = lessons.length;
    const completedCount = lessonsWithProgress.filter((l) => l.progress.lessonCompleted).length;
    const overallProgressPercent = totalPublished > 0
      ? Math.round((completedCount / totalPublished) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLessons: totalPublished,
        completedLessons: completedCount,
        overallProgressPercent,
        lessons: lessonsWithProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lessons/:id
 * Returns single lesson details with sequential lock verification.
 */
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Check if queried by ObjectId or by lessonNumber
    let lesson;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      lesson = await Lesson.findById(id);
    } else if (!isNaN(Number(id))) {
      lesson = await Lesson.findOne({ lessonNumber: Number(id) });
    }

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Verify sequential unlocking: Find all lessons up to this one
    const allLessons = await Lesson.find({ isPublished: true }).sort({ lessonNumber: 1 });
    const currentIndex = allLessons.findIndex((l) => l._id.toString() === lesson._id.toString());

    let isLocked = false;
    let prevLesson = null;
    let nextLesson = null;

    if (currentIndex > 0) {
      prevLesson = allLessons[currentIndex - 1];
      // Check if previous lesson is fully completed by this user
      if (userId) {
        const prevProgress = await LessonProgress.findOne({
          user: userId,
          lesson: prevLesson._id,
        });
        const prevExercise = await Exercise.findOne({
          lessonId: prevLesson._id,
          status: 'published',
        });
        const prevHasExercise = Boolean(prevExercise);
        const prevIsComplete = prevHasExercise
          ? Boolean(prevProgress?.videoCompleted && prevProgress?.exerciseCompleted)
          : Boolean(prevProgress?.videoCompleted);

        if (!prevIsComplete) {
          isLocked = true;
        }
      } else {
        isLocked = true;
      }
    }

    if (currentIndex < allLessons.length - 1) {
      nextLesson = allLessons[currentIndex + 1];
    }

    if (isLocked) {
      return res.status(403).json({
        success: false,
        message: `Lesson ${lesson.lessonNumber} is locked. Please complete Lesson ${prevLesson?.lessonNumber || 1} first.`,
        locked: true,
        requiredLesson: {
          id: prevLesson?._id,
          lessonNumber: prevLesson?.lessonNumber,
          title: prevLesson?.title,
        },
      });
    }

    // Check if current lesson has a published exercise
    const publishedExercise = await Exercise.findOne({
      lessonId: lesson._id,
      status: 'published',
    });
    const hasExercise = Boolean(publishedExercise);

    // Fetch or initialize progress
    let progress = null;
    if (userId) {
      progress = await LessonProgress.findOne({
        user: userId,
        lesson: lesson._id,
      });

      if (!progress) {
        progress = await LessonProgress.create({
          user: userId,
          lesson: lesson._id,
          durationSeconds: lesson.durationSeconds || 0,
        });
      }
    }

    // Determine current lesson completion
    const isThisLessonCompleted = hasExercise
      ? Boolean(progress?.videoCompleted && progress?.exerciseCompleted)
      : Boolean(progress?.videoCompleted);

    res.status(200).json({
      success: true,
      data: {
        lesson,
        hasExercise,
        exerciseId: publishedExercise?._id || null,
        progress: progress ? {
          watchedSeconds: progress.watchedSeconds || 0,
          furthestWatchedSeconds: progress.furthestWatchedSeconds || 0,
          durationSeconds: progress.durationSeconds || lesson.durationSeconds || 0,
          progressPercentage: progress.progressPercentage || 0,
          videoCompleted: Boolean(progress.videoCompleted),
          exerciseCompleted: Boolean(progress.exerciseCompleted),
          lessonCompleted: isThisLessonCompleted,
          lastWatchedAt: progress.lastWatchedAt || null,
        } : {
          watchedSeconds: 0,
          furthestWatchedSeconds: 0,
          durationSeconds: lesson.durationSeconds || 0,
          progressPercentage: 0,
          videoCompleted: false,
          exerciseCompleted: false,
          lessonCompleted: false,
        },
        navigation: {
          prevLessonId: prevLesson?._id || null,
          prevLessonNumber: prevLesson?.lessonNumber || null,
          nextLessonId: nextLesson?._id || null,
          nextLessonNumber: nextLesson?.lessonNumber || null,
          totalLessons: allLessons.length,
          currentIndex: currentIndex + 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/lessons/:id/progress
 * Syncs user watch time, furthest position, and updates completion status.
 * Enforces forward-seek anti-cheating protection on the server.
 */
export const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const { currentTime, duration } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    let progress = await LessonProgress.findOne({ user: userId, lesson: lesson._id });
    if (!progress) {
      progress = new LessonProgress({
        user: userId,
        lesson: lesson._id,
        durationSeconds: Number(duration) || lesson.durationSeconds || 0,
      });
    }

    const clientCurrentTime = Math.max(0, Number(currentTime) || 0);
    const clientDuration = Math.max(0, Number(duration) || lesson.durationSeconds || progress.durationSeconds || 1);

    // Anti-cheating forward-seek bounds check:
    // Disallow arbitrary leaps in furthestWatchedSeconds beyond 15s latency buffer.
    const currentFurthest = progress.furthestWatchedSeconds || 0;
    let validatedFurthest = currentFurthest;

    if (clientCurrentTime > currentFurthest) {
      // If leap is within reasonable playing/buffering threshold (+15s)
      if (clientCurrentTime <= currentFurthest + 15 || currentFurthest === 0) {
        validatedFurthest = Math.min(clientCurrentTime, clientDuration);
      } else {
        // Capped advancement to prevent artificial forward-seek cheating
        validatedFurthest = Math.min(currentFurthest + 10, clientDuration);
      }
    }

    progress.watchedSeconds = clientCurrentTime;
    progress.furthestWatchedSeconds = validatedFurthest;
    progress.durationSeconds = clientDuration;
    progress.lastWatchedAt = new Date();

    // Calculate percentage (0 - 100)
    const percentage = clientDuration > 0
      ? Math.min(100, Math.round((validatedFurthest / clientDuration) * 100))
      : 0;
    progress.progressPercentage = percentage;

    // Automatic video completion at 90% threshold or near duration end
    if (percentage >= 90 || (clientDuration > 10 && validatedFurthest >= clientDuration - 5)) {
      if (!progress.videoCompleted) {
        progress.videoCompleted = true;
        progress.completedAt = new Date();
      }

      // Check if this lesson has a published exercise
      const hasExercise = await Exercise.exists({ lessonId: lesson._id, status: 'published' });
      if (hasExercise) {
        // Requires both video and exercise to complete the lesson
        progress.lessonCompleted = Boolean(progress.exerciseCompleted);
      } else {
        progress.lessonCompleted = true;
      }
      if (progress.lessonCompleted) {
        progress.completedAt = progress.completedAt || new Date();
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      data: {
        watchedSeconds: progress.watchedSeconds,
        furthestWatchedSeconds: progress.furthestWatchedSeconds,
        durationSeconds: progress.durationSeconds,
        progressPercentage: progress.progressPercentage,
        videoCompleted: progress.videoCompleted,
        exerciseCompleted: progress.exerciseCompleted,
        lessonCompleted: progress.lessonCompleted,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/lessons/:id/video-complete
 * Explicit endpoint called when Vimeo video finishes.
 */
export const markVideoComplete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    let progress = await LessonProgress.findOne({ user: userId, lesson: lesson._id });
    if (!progress) {
      progress = new LessonProgress({
        user: userId,
        lesson: lesson._id,
        durationSeconds: lesson.durationSeconds || 0,
      });
    }

    progress.videoCompleted = true;
    progress.progressPercentage = 100;
    progress.furthestWatchedSeconds = progress.durationSeconds || lesson.durationSeconds || 600;
    progress.lastWatchedAt = new Date();

    // Check if this lesson has a published exercise
    const hasExercise = await Exercise.exists({ lessonId: lesson._id, status: 'published' });
    if (hasExercise) {
      progress.lessonCompleted = Boolean(progress.exerciseCompleted);
    } else {
      progress.lessonCompleted = true;
    }
    if (progress.lessonCompleted) {
      progress.completedAt = progress.completedAt || new Date();
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Video marked as complete',
      data: {
        videoCompleted: true,
        exerciseCompleted: progress.exerciseCompleted,
        lessonCompleted: progress.lessonCompleted,
        progressPercentage: 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

