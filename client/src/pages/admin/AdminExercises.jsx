import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Eye,
  Trash2,
  X,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const statusBadgeStyles = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  importing: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  review: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  ready: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  unpublished: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
};

export default function AdminExercises() {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [metrics, setMetrics] = useState({
    totalExercises: 0,
    publishedExercises: 0,
    reviewExercises: 0,
    totalQuestionsInBank: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    lessonId: '',
  });
  const [creating, setCreating] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await adminService.getExercises(params);
      if (res.success && res.data) {
        setExercises(res.data.exercises || []);
        setMetrics({
          totalExercises: res.data.totalExercises || 0,
          publishedExercises: res.data.publishedExercises || 0,
          reviewExercises: res.data.reviewExercises || 0,
          totalQuestionsInBank: res.data.totalQuestionsInBank || 0,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercises.');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonsForSelect = async () => {
    try {
      const res = await adminService.getLessons();
      if (res.success && res.data) {
        const list = res.data.lessons || [];
        setLessons(list);
        if (list.length > 0 && !createForm.lessonId) {
          setCreateForm((prev) => ({ ...prev, lessonId: list[0]._id }));
        }
      }
    } catch (err) {
      console.warn('Failed to load lessons for selection:', err.message);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    loadLessonsForSelect();
    setIsCreateModalOpen(true);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      setError('Please provide an exercise title.');
      return;
    }
    if (!createForm.lessonId) {
      setError('Please select an associated lesson.');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const res = await adminService.createExercise(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({ title: '', description: '', lessonId: '' });
      await fetchExercises();

      // Navigate to import page for this exercise
      if (res.data?._id) {
        navigate(`/admin/exercises/${res.data._id}/import`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create exercise.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteExercise = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminService.deleteExercise(deleteTarget._id);
      setDeleteTarget(null);
      await fetchExercises();
    } catch (err) {
      setError(err.message || 'Failed to delete exercise.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Exercise & Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Import, extract, validate, and publish lesson exercise questions from source documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchExercises}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exercise</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Exercises
          </span>
          <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1">
            {metrics.totalExercises}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Configured for syllabus</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Questions in Bank
          </span>
          <p className="font-display font-bold text-3xl text-brand-600 dark:text-brand-400 mt-1">
            {metrics.totalQuestionsInBank}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Parsed from source PDFs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Published Live
          </span>
          <p className="font-display font-bold text-3xl text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.publishedExercises}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">100% verified & approved</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            In Review
          </span>
          <p className="font-display font-bold text-3xl text-amber-600 dark:text-amber-400 mt-1">
            {metrics.reviewExercises}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Pending admin review</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'draft', 'review', 'ready', 'published', 'unpublished'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchExercises()}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Exercises Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
            <p>Loading exercises...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <FileQuestion className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                No exercises found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first exercise associated with a lesson to start importing question and answer documents.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Exercise</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Exercise Title</th>
                  <th className="py-3 px-4">Associated Lesson</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Approved</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exercises.map((ex) => (
                  <tr
                    key={ex._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/exercises/${ex._id}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        {ex.title}
                      </Link>
                      {ex.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                          {ex.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {ex.lessonId ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                          <span>Lesson {ex.lessonId.lessonNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {ex.questionCount || ex.questions?.length || 0}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={ex.approvedQuestionCount > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {ex.approvedQuestionCount || 0} / {ex.questionCount || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusBadgeStyles[ex.status] || statusBadgeStyles.draft
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/exercises/${ex._id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Link>

                        <Link
                          to={`/admin/exercises/${ex._id}/import`}
                          title="Import Questions & Answers"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-all"
                        >
                          <UploadCloud className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/exercises/${ex._id}/review`}
                          title="Review Questions"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all"
                        >
                          <FileQuestion className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(ex)}
                          title="Delete Exercise"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
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

      {/* ================= CREATE EXERCISE MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Create New Exercise
                </h3>
                <p className="text-xs text-slate-500">
                  Associate an exercise with a certified Highway Code lesson.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Exercise Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Road Signs & Priority Rules — Drill 1"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Associated Lesson *
                </label>
                <select
                  required
                  value={createForm.lessonId}
                  onChange={(e) => setCreateForm({ ...createForm, lessonId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold"
                >
                  {lessons.map((les) => (
                    <option key={les._id} value={les._id}>
                      Lesson {les.lessonNumber}: {les.title?.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief note about the scope of this exercise..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {creating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create & Proceed to Import</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Delete Exercise?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>"{deleteTarget.title}"</strong> and all its imported questions?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteExercise}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

