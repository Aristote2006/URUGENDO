import { Lesson } from '../models/Lesson.js';
import { LessonProgress } from '../models/LessonProgress.js';

/**
 * Extracts numeric Vimeo Video ID from various URL formats
 */
export const extractVimeoId = (url) => {
  if (!url) return null;
  const str = String(url).trim();
  if (/^\d+$/.test(str)) return str;
  const match = str.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/\d+\/video\/|video\/|))(\d+)/
  );
  return match ? match[1] : null;
};

/**
 * GET /api/admin/lessons
 * Returns all lessons with administrative metrics and curriculum breakdown
 */
export const getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().sort({ lessonNumber: 1 });

    const totalLessons = lessons.length;
    const publishedLessons = lessons.filter((l) => l.isPublished).length;
    const modulesSet = new Set(lessons.map((l) => l.moduleNumber || 1));
    const totalModules = modulesSet.size || 1;

    res.status(200).json({
      success: true,
      data: {
        totalLessons,
        publishedLessons,
        totalModules,
        lessons,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/lessons/:id
 * Returns single lesson details for editing or preview
 */
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/lessons
 * Creates a new lesson
 */
export const createLesson = async (req, res, next) => {
  try {
    const {
      lessonNumber,
      titleEn,
      titleRw,
      summaryEn,
      summaryRw,
      vimeoUrl,
      durationSeconds,
      moduleNumber,
      moduleTitleEn,
      moduleTitleRw,
      notesEn,
      notesRw,
      objectivesEn,
      objectivesRw,
      isPublished,
    } = req.body;

    if (!lessonNumber) {
      return res.status(400).json({
        success: false,
        message: 'Lesson number is required',
      });
    }

    if (!titleEn) {
      return res.status(400).json({
        success: false,
        message: 'English title is required',
      });
    }

    if (!vimeoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Vimeo URL is required',
      });
    }

    const vimeoVideoId = extractVimeoId(vimeoUrl);
    if (!vimeoVideoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Vimeo URL. Could not extract valid Vimeo video ID.',
      });
    }

    // Check duplicate lesson number
    const existing = await Lesson.findOne({ lessonNumber: Number(lessonNumber) });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Lesson number ${lessonNumber} already exists. Please choose a unique lesson number.`,
      });
    }

    // Parse objectives if passed as strings/arrays
    const parsedObjectivesEn = Array.isArray(objectivesEn)
      ? objectivesEn
      : typeof objectivesEn === 'string'
      ? objectivesEn.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const parsedObjectivesRw = Array.isArray(objectivesRw)
      ? objectivesRw
      : typeof objectivesRw === 'string'
      ? objectivesRw.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const lesson = await Lesson.create({
      lessonNumber: Number(lessonNumber),
      title: {
        en: titleEn.trim(),
        rw: (titleRw || titleEn).trim(),
      },
      summary: {
        en: (summaryEn || '').trim(),
        rw: (summaryRw || summaryEn || '').trim(),
      },
      vimeoUrl: vimeoUrl.trim(),
      vimeoVideoId,
      durationSeconds: Number(durationSeconds) || 600,
      moduleNumber: Number(moduleNumber) || 1,
      moduleTitle: {
        en: (moduleTitleEn || 'General Provisions').trim(),
        rw: (moduleTitleRw || moduleTitleEn || 'Amategeko Rusange').trim(),
      },
      objectives: {
        en: parsedObjectivesEn,
        rw: parsedObjectivesRw,
      },
      notes: {
        en: (notesEn || '').trim(),
        rw: (notesRw || notesEn || '').trim(),
      },
      order: Number(lessonNumber),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/lessons/:id
 * Updates an existing lesson
 */
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    const {
      lessonNumber,
      titleEn,
      titleRw,
      summaryEn,
      summaryRw,
      vimeoUrl,
      durationSeconds,
      moduleNumber,
      moduleTitleEn,
      moduleTitleRw,
      notesEn,
      notesRw,
      objectivesEn,
      objectivesRw,
      isPublished,
      order,
    } = req.body;

    if (lessonNumber !== undefined && Number(lessonNumber) !== lesson.lessonNumber) {
      const existing = await Lesson.findOne({
        lessonNumber: Number(lessonNumber),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Lesson number ${lessonNumber} already in use.`,
        });
      }
      lesson.lessonNumber = Number(lessonNumber);
    }

    if (vimeoUrl !== undefined) {
      const vimeoVideoId = extractVimeoId(vimeoUrl);
      if (!vimeoVideoId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Vimeo URL format.',
        });
      }
      lesson.vimeoUrl = vimeoUrl.trim();
      lesson.vimeoVideoId = vimeoVideoId;
    }

    if (titleEn !== undefined) lesson.title.en = titleEn.trim();
    if (titleRw !== undefined) lesson.title.rw = titleRw.trim();
    if (summaryEn !== undefined) lesson.summary.en = summaryEn.trim();
    if (summaryRw !== undefined) lesson.summary.rw = summaryRw.trim();

    if (durationSeconds !== undefined) lesson.durationSeconds = Number(durationSeconds);
    if (moduleNumber !== undefined) lesson.moduleNumber = Number(moduleNumber);
    if (order !== undefined) lesson.order = Number(order);
    if (isPublished !== undefined) lesson.isPublished = Boolean(isPublished);

    if (moduleTitleEn !== undefined) lesson.moduleTitle.en = moduleTitleEn.trim();
    if (moduleTitleRw !== undefined) lesson.moduleTitle.rw = moduleTitleRw.trim();

    if (notesEn !== undefined) lesson.notes.en = notesEn.trim();
    if (notesRw !== undefined) lesson.notes.rw = notesRw.trim();

    if (objectivesEn !== undefined) {
      lesson.objectives.en = Array.isArray(objectivesEn)
        ? objectivesEn
        : typeof objectivesEn === 'string'
        ? objectivesEn.split('\n').map((s) => s.trim()).filter(Boolean)
        : lesson.objectives.en;
    }

    if (objectivesRw !== undefined) {
      lesson.objectives.rw = Array.isArray(objectivesRw)
        ? objectivesRw
        : typeof objectivesRw === 'string'
        ? objectivesRw.split('\n').map((s) => s.trim()).filter(Boolean)
        : lesson.objectives.rw;
    }

    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/lessons/:id/publish
 * Toggles publish status for a lesson
 */
export const togglePublishLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    const { isPublished } = req.body;
    lesson.isPublished = isPublished !== undefined ? Boolean(isPublished) : !lesson.isPublished;
    await lesson.save();

    res.status(200).json({
      success: true,
      message: `Lesson ${lesson.isPublished ? 'published' : 'unpublished'} successfully`,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/lessons/:id
 * Removes a lesson and cleans up progress
 */
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    await Lesson.findByIdAndDelete(id);
    await LessonProgress.deleteMany({ lesson: id });

    res.status(200).json({
      success: true,
      message: `Lesson ${lesson.lessonNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Backward compatibility for legacy route
 */
export const getLearningOverview = getLessons;
