import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  Eye,
  FileText,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  X,
  Play,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

// Extract Vimeo Video ID helper
const extractVimeoId = (url) => {
  if (!url) return '';
  const str = String(url).trim();
  if (/^\d+$/.test(str)) return str;
  const match = str.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/\d+\/video\/|video\/|))(\d+)/
  );
  return match ? match[1] : '';
};

// Format seconds into MM:SS or M min
const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return '0 min';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
};

export default function AdminLearning() {
  const [lessons, setLessons] = useState([]);
  const [metrics, setMetrics] = useState({
    totalLessons: 0,
    publishedLessons: 0,
    totalModules: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const initialFormState = {
    lessonNumber: '',
    titleEn: '',
    titleRw: '',
    summaryEn: '',
    summaryRw: '',
    vimeoUrl: '',
    durationMinutes: 15,
    moduleNumber: 1,
    moduleTitleEn: 'General Traffic Rules & Highway Code',
    moduleTitleRw: 'Amategeko Rusange n’Iby’ibanze by’Umuhanda',
    notesEn: '',
    notesRw: '',
    objectivesEn: '',
    objectivesRw: '',
    isPublished: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getLessons();
      if (res.success && res.data) {
        const lessonList = res.data.lessons || [];
        setLessons(lessonList);
        setMetrics({
          totalLessons: res.data.totalLessons ?? lessonList.length,
          publishedLessons: res.data.publishedLessons ?? lessonList.filter((l) => l.isPublished).length,
          totalModules: res.data.totalModules ?? new Set(lessonList.map((l) => l.moduleNumber || 1)).size,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNumber = lessons.length > 0
      ? Math.max(...lessons.map((l) => Number(l.lessonNumber) || 0)) + 1
      : 1;

    setFormData({
      ...initialFormState,
      lessonNumber: nextNumber,
      moduleNumber: nextNumber <= 3 ? 1 : nextNumber <= 6 ? 2 : 3,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (lesson) => {
    setCurrentLesson(lesson);
    setFormData({
      lessonNumber: lesson.lessonNumber,
      titleEn: lesson.title?.en || '',
      titleRw: lesson.title?.rw || '',
      summaryEn: lesson.summary?.en || '',
      summaryRw: lesson.summary?.rw || '',
      vimeoUrl: lesson.vimeoUrl || '',
      durationMinutes: Math.round((lesson.durationSeconds || 600) / 60),
      moduleNumber: lesson.moduleNumber || 1,
      moduleTitleEn: lesson.moduleTitle?.en || '',
      moduleTitleRw: lesson.moduleTitle?.rw || '',
      notesEn: lesson.notes?.en || '',
      notesRw: lesson.notes?.rw || '',
      objectivesEn: (lesson.objectives?.en || []).join('\n'),
      objectivesRw: (lesson.objectives?.rw || []).join('\n'),
      isPublished: Boolean(lesson.isPublished),
    });
    setIsEditModalOpen(true);
  };

  // Open Preview Modal
  const handleOpenPreview = (lesson) => {
    setCurrentLesson(lesson);
    setIsPreviewModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (lesson) => {
    setCurrentLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Lesson
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!formData.lessonNumber || !formData.titleEn || !formData.vimeoUrl) {
      setError('Please fill in all required fields (Lesson Number, Title, Vimeo URL).');
      return;
    }

    const vId = extractVimeoId(formData.vimeoUrl);
    if (!vId) {
      setError('Invalid Vimeo URL. Please check the URL format (e.g., https://vimeo.com/824804225).');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      const payload = {
        ...formData,
        durationSeconds: (Number(formData.durationMinutes) || 10) * 60,
        vimeoVideoId: vId,
      };
      await adminService.createLesson(payload);
      setIsAddModalOpen(false);
      showNotification(`Lesson ${formData.lessonNumber} created successfully!`);
      await fetchLessons();
    } catch (err) {
      setError(err.message || 'Failed to create lesson.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Edit Lesson
  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!currentLesson) return;

    const vId = extractVimeoId(formData.vimeoUrl);
    if (!vId) {
      setError('Invalid Vimeo URL. Please check the URL format.');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      const payload = {
        ...formData,
        durationSeconds: (Number(formData.durationMinutes) || 10) * 60,
      };
      await adminService.updateLesson(currentLesson._id, payload);
      setIsEditModalOpen(false);
      showNotification(`Lesson ${formData.lessonNumber} updated successfully!`);
      await fetchLessons();
    } catch (err) {
      setError(err.message || 'Failed to update lesson.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (lesson) => {
    try {
      setError('');
      const newStatus = !lesson.isPublished;
      await adminService.togglePublishLesson(lesson._id, newStatus);
      showNotification(`Lesson ${lesson.lessonNumber} is now ${newStatus ? 'Published' : 'Unpublished'}.`);
      await fetchLessons();
    } catch (err) {
      setError(err.message || 'Failed to change publish status.');
    }
  };

  // Confirm Delete Lesson
  const handleDeleteLesson = async () => {
    if (!currentLesson) return;
    try {
      setActionLoading(true);
      setError('');
      await adminService.deleteLesson(currentLesson._id);
      setIsDeleteModalOpen(false);
      showNotification(`Lesson ${currentLesson.lessonNumber} deleted successfully.`);
      await fetchLessons();
    } catch (err) {
      setError(err.message || 'Failed to delete lesson.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Learning Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, preview, and organize official Highway Code Vimeo video lectures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLessons}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lesson</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Lessons
          </span>
          <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1">
            {metrics.totalLessons}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active in curriculum database
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Published For Students
          </span>
          <p className="font-display font-bold text-3xl text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.publishedLessons}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Visible in student learning portal
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Curriculum Modules
          </span>
          <p className="font-display font-bold text-3xl text-brand-600 dark:text-brand-400 mt-1">
            {metrics.totalModules}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Structured topical sections
          </p>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Curriculum Lessons</span>
          </h2>
          <span className="text-xs text-slate-500">
            Showing {lessons.length} lessons
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto mb-2" />
            <span>Loading lessons from database...</span>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No lessons created yet
            </p>
            <p className="text-xs text-slate-500">
              Click the "Add New Lesson" button to publish your first Vimeo video lesson.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16">#</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Vimeo Video</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-brand-600 dark:text-brand-400">
                      {lesson.lessonNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {lesson.title?.en}
                      </div>
                      {lesson.title?.rw && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {lesson.title.rw}
                        </div>
                      )}
                      {lesson.summary?.en && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 max-w-sm">
                          {lesson.summary.en}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Mod 0{lesson.moduleNumber || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {formatDuration(lesson.durationSeconds)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        <Video className="w-3.5 h-3.5 text-brand-600" />
                        <span>{lesson.vimeoVideoId || extractVimeoId(lesson.vimeoUrl)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(lesson)}
                        title="Click to toggle publish status"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border transition-all ${
                          lesson.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${lesson.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{lesson.isPublished ? 'Live' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Preview Button */}
                        <button
                          onClick={() => handleOpenPreview(lesson)}
                          title="Preview Lesson Video"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(lesson)}
                          title="Edit Lesson"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDelete(lesson)}
                          title="Delete Lesson"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ADD LESSON MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Add New Video Lesson
                </h3>
                <p className="text-xs text-slate-500">
                  Input lesson details, objectives, and official Vimeo video link.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lesson # *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.lessonNumber}
                    onChange={(e) => setFormData({ ...formData, lessonNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Module #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.moduleNumber}
                    onChange={(e) => setFormData({ ...formData, moduleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Vimeo URL or Video ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://vimeo.com/824804225 or https://player.vimeo.com/video/824804225"
                  value={formData.vimeoUrl}
                  onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono"
                />
                {extractVimeoId(formData.vimeoUrl) && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Extracted Video ID: <strong>{extractVimeoId(formData.vimeoUrl)}</strong></span>
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Rwandan Highway Code"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kinyarwanda Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Intangiriro ku Mategeko y’Umuhanda"
                    value={formData.titleRw}
                    onChange={(e) => setFormData({ ...formData, titleRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    English Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short overview of what the video covers..."
                    value={formData.summaryEn}
                    onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kinyarwanda Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Incamake y’ibiri mu isomo..."
                    value={formData.summaryRw}
                    onChange={(e) => setFormData({ ...formData, summaryRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Objectives (English - one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Objective 1&#10;Objective 2&#10;Objective 3"
                    value={formData.objectivesEn}
                    onChange={(e) => setFormData({ ...formData, objectivesEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Objectives (Kinyarwanda - one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Intego ya 1&#10;Intego ya 2&#10;Intego ya 3"
                    value={formData.objectivesRw}
                    onChange={(e) => setFormData({ ...formData, objectivesRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Highway Code Legal Reference / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Official traffic code article reference..."
                  value={formData.notesEn}
                  onChange={(e) => setFormData({ ...formData, notesEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addPublish"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="addPublish" className="font-semibold text-slate-700 dark:text-slate-300">
                  Publish immediately (Visible in student learning portal)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Create Lesson</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT LESSON MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Edit Lesson #{formData.lessonNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Update title, Vimeo link, summary, and objectives.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLesson} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lesson # *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.lessonNumber}
                    onChange={(e) => setFormData({ ...formData, lessonNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Module #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.moduleNumber}
                    onChange={(e) => setFormData({ ...formData, moduleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Vimeo URL or Video ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vimeoUrl}
                  onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono"
                />
                {extractVimeoId(formData.vimeoUrl) && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Extracted Video ID: <strong>{extractVimeoId(formData.vimeoUrl)}</strong></span>
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kinyarwanda Title
                  </label>
                  <input
                    type="text"
                    value={formData.titleRw}
                    onChange={(e) => setFormData({ ...formData, titleRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    English Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summaryEn}
                    onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kinyarwanda Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summaryRw}
                    onChange={(e) => setFormData({ ...formData, summaryRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Objectives (English)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.objectivesEn}
                    onChange={(e) => setFormData({ ...formData, objectivesEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Objectives (Kinyarwanda)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.objectivesRw}
                    onChange={(e) => setFormData({ ...formData, objectivesRw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Highway Code Legal Reference / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notesEn}
                  onChange={(e) => setFormData({ ...formData, notesEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editPublish"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="editPublish" className="font-semibold text-slate-700 dark:text-slate-300">
                  Published (Visible to students)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PREVIEW LESSON MODAL ================= */}
      {isPreviewModalOpen && currentLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Lesson Preview • Lesson {currentLesson.lessonNumber}
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {currentLesson.title?.en}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vimeo Player Embed */}
            <div className="relative aspect-video bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://player.vimeo.com/video/${currentLesson.vimeoVideoId || extractVimeoId(currentLesson.vimeoUrl)}?autoplay=1`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={currentLesson.title?.en || 'Lesson Video Preview'}
              />
            </div>

            {/* Video Details */}
            <div className="p-5 text-xs space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {formatDuration(currentLesson.durationSeconds)}</span>
                </span>
                <span className="font-mono text-[11px]">
                  Vimeo ID: {currentLesson.vimeoVideoId || extractVimeoId(currentLesson.vimeoUrl)}
                </span>
              </div>
              {currentLesson.summary?.en && (
                <p className="text-slate-600 dark:text-slate-300">
                  {currentLesson.summary.en}
                </p>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && currentLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Delete Lesson {currentLesson.lessonNumber}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <strong>"{currentLesson.title?.en}"</strong>? This will also remove any student watch progress for this lesson.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteLesson}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
