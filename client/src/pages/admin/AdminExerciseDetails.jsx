import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  BookOpen,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  EyeOff,
  RefreshCw,
  AlertCircle,
  FileText,
  ShieldAlert,
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

export default function AdminExerciseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getExerciseById(id);
      if (res.success && res.data) {
        setExercise(res.data.exercise);
        setStats(res.data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercise details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const handlePublish = async () => {
    try {
      setActionLoading(true);
      setError('');
      const res = await adminService.publishExercise(id);
      setSuccessMsg('Exercise published successfully and linked to lesson!');
      await fetchExercise();
    } catch (err) {
      setError(err.message || 'Failed to publish exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setActionLoading(true);
      setError('');
      await adminService.unpublishExercise(id);
      setSuccessMsg('Exercise status set to unpublished.');
      await fetchExercise();
    } catch (err) {
      setError(err.message || 'Failed to unpublish exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-xs text-slate-500 space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
        <p>Loading exercise details...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-slate-900 dark:text-white">Exercise Not Found</h3>
        <Link
          to="/admin/exercises"
          className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercises</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/exercises"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercises</span>
        </Link>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            statusBadgeStyles[exercise.status] || statusBadgeStyles.draft
          }`}
        >
          {exercise.status}
        </span>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Info Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>
                Lesson {exercise.lessonId?.lessonNumber}: {exercise.lessonId?.title?.en || 'Associated Lesson'}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                {exercise.description}
              </p>
            )}
          </div>

          {/* Publishing CTA */}
          <div className="flex items-center gap-2">
            {exercise.status === 'published' ? (
              <button
                onClick={handleUnpublish}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <EyeOff className="w-4 h-4" />
                <span>Unpublish Exercise</span>
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={actionLoading || !stats?.canPublish}
                title={!stats?.canPublish ? stats?.publishBlockers?.join(' • ') : 'Publish live for students'}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Publish Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Questions
            </span>
            <p className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
              {stats?.totalQuestions || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Valid Questions
            </span>
            <p className="font-display font-bold text-2xl text-blue-600 dark:text-blue-400 mt-1">
              {stats?.validCount || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Needs Review
            </span>
            <p className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400 mt-1">
              {stats?.needsReviewCount || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Approved
            </span>
            <p className="font-display font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
              {stats?.approvedCount || 0}
            </p>
          </div>
        </div>

        {/* Publishing Safety Notice */}
        {!stats?.canPublish && stats?.totalQuestions > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Publishing Blocked</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300">
              {stats.publishBlockers.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Source Files Info */}
        {exercise.sourceFiles?.questionFileName && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span className="text-slate-500">Imported From:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {exercise.sourceFiles.questionFileName} & {exercise.sourceFiles.answerFileName}
              </span>
            </div>
            {exercise.sourceFiles.uploadedAt && (
              <span className="text-slate-400">
                Uploaded: {new Date(exercise.sourceFiles.uploadedAt).toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={`/admin/exercises/${exercise._id}/import`}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{exercise.questions?.length > 0 ? 'Re-import Documents' : 'Import Questions & Answers'}</span>
          </Link>

          <Link
            to={`/admin/exercises/${exercise._id}/review`}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <FileQuestion className="w-4 h-4 text-brand-600" />
            <span>Review & Approve Questions ({stats?.totalQuestions || 0})</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

