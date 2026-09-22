import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Send,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const statusBadgeStyles = {
  valid: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  needs_review: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
};

export default function AdminExerciseReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    validCount: 0,
    needsReviewCount: 0,
    approvedCount: 0,
  });

  const [filterTab, setFilterTab] = useState('all'); // all | needs_review | valid | approved
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Question Editor Modal State
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    questionNumber: 1,
    questionText: '',
    options: [],
    correctOption: '',
    explanation: '',
    reviewNotes: '',
  });

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      setError('');
      const [exRes, qRes] = await Promise.all([
        adminService.getExerciseById(id),
        adminService.getExerciseQuestions(id),
      ]);

      if (exRes.success && exRes.data) {
        setExercise(exRes.data.exercise);
      }
      if (qRes.success && qRes.data) {
        setQuestions(qRes.data.questions || []);
        setSummary(qRes.data.summary || { total: 0, validCount: 0, needsReviewCount: 0, approvedCount: 0 });
      }
    } catch (err) {
      setError(err.message || 'Failed to load questions for review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [id]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Open Question Editor Modal
  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setEditForm({
      questionNumber: q.questionNumber,
      questionText: q.questionText || '',
      options: (q.options || []).map((o) => ({ label: o.label, text: o.text })),
      correctOption: q.correctOption || '',
      explanation: q.explanation || '',
      reviewNotes: q.reviewNotes || '',
    });
  };

  // Save Question Edits
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      setActionLoading(true);
      setError('');
      const res = await adminService.updateExerciseQuestion(id, editingQuestion._id, editForm);
      if (res.success) {
        setEditingQuestion(null);
        showNotification(`Question ${editForm.questionNumber} updated and re-validated!`);
        await fetchReviewData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update question.');
    } finally {
      setActionLoading(false);
    }
  };

  // Approve single question
  const handleApproveQuestion = async (questionId) => {
    try {
      setError('');
      const res = await adminService.approveExerciseQuestion(id, questionId);
      if (res.success) {
        showNotification('Question approved!');
        await fetchReviewData();
      }
    } catch (err) {
      setError(err.message || 'Failed to approve question.');
    }
  };

  // Bulk approve all valid questions
  const handleApproveAllValid = async () => {
    try {
      setActionLoading(true);
      setError('');
      const res = await adminService.approveAllValidQuestions(id);
      if (res.success) {
        showNotification(res.message || 'All valid questions approved!');
        await fetchReviewData();
      }
    } catch (err) {
      setError(err.message || 'Failed to bulk approve questions.');
    } finally {
      setActionLoading(false);
    }
  };

  // Publish Exercise
  const handlePublishExercise = async () => {
    try {
      setActionLoading(true);
      setError('');
      const res = await adminService.publishExercise(id);
      if (res.success) {
        showNotification('Exercise published successfully!');
        await fetchReviewData();
      }
    } catch (err) {
      setError(err.message || 'Failed to publish exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helpers for editing options list
  const handleOptionChange = (idx, field, val) => {
    const updated = [...editForm.options];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditForm({ ...editForm, options: updated });
  };

  const handleAddOption = () => {
    const nextChar = String.fromCharCode(65 + editForm.options.length); // A, B, C, D, E...
    setEditForm({
      ...editForm,
      options: [...editForm.options, { label: nextChar, text: '' }],
    });
  };

  const handleRemoveOption = (idx) => {
    if (editForm.options.length <= 2) {
      setError('A question must contain at least 2 options.');
      return;
    }
    const updated = editForm.options.filter((_, i) => i !== idx);
    setEditForm({ ...editForm, options: updated });
  };

  // Filtered list
  const filteredQuestions = questions.filter((q) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'needs_review') return q.importStatus === 'needs_review';
    if (filterTab === 'valid') return q.importStatus === 'valid';
    if (filterTab === 'approved') return q.approved === true;
    return true;
  });

  const canPublish =
    questions.length > 0 &&
    summary.needsReviewCount === 0 &&
    summary.approvedCount === questions.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/admin/exercises/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exercise Details</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Review Exercise Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {exercise?.title} • Lesson {exercise?.lessonId?.lessonNumber}
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          {summary.validCount > 0 && (
            <button
              onClick={handleApproveAllValid}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Approve All Valid ({summary.validCount})</span>
            </button>
          )}

          <button
            onClick={handlePublishExercise}
            disabled={actionLoading || !canPublish}
            title={
              !canPublish
                ? 'All questions must be reviewed and approved before publishing.'
                : 'Publish exercise live for students'
            }
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Publish Exercise</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Imported
          </span>
          <p className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            {summary.total}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Needs Review
          </span>
          <p className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400 mt-1">
            {summary.needsReviewCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Valid (Pending Approval)
          </span>
          <p className="font-display font-bold text-2xl text-blue-600 dark:text-blue-400 mt-1">
            {summary.validCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Approved
          </span>
          <p className="font-display font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.approvedCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterTab === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Questions ({questions.length})
        </button>

        <button
          onClick={() => setFilterTab('needs_review')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterTab === 'needs_review'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Needs Review ({summary.needsReviewCount})
        </button>

        <button
          onClick={() => setFilterTab('valid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterTab === 'valid'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Valid ({summary.validCount})
        </button>

        <button
          onClick={() => setFilterTab('approved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Approved ({summary.approvedCount})
        </button>
      </div>

      {/* Question Cards List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
          <p>Loading questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileQuestion className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            No questions match this filter
          </h3>
          <p className="text-xs text-slate-500">
            Select another filter tab above or import questions from PDF documents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isApproved = q.approved === true;
            const needsReview = q.importStatus === 'needs_review';

            return (
              <div
                key={q._id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm space-y-4 transition-all ${
                  needsReview
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20'
                    : isApproved
                    ? 'border-emerald-200 dark:border-emerald-800/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 font-bold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-800">
                      {q.questionNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-500">
                      Question {q.questionNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isApproved
                          ? statusBadgeStyles.approved
                          : statusBadgeStyles[q.importStatus] || statusBadgeStyles.valid
                      }`}
                    >
                      {isApproved ? '✓ Approved' : needsReview ? '⚠ Needs Review' : 'Valid'}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <p className="font-semibold text-sm text-slate-900 dark:text-white leading-relaxed">
                  {q.questionText}
                </p>

                {/* Multiple Choice Options Grid */}
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(q.options || []).map((opt, idx) => {
                    const isCorrect = opt.label === q.correctOption;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                          isCorrect
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Discrepancy Callout (if needs review) */}
                {needsReview && q.reviewNotes && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Review Reason:</p>
                      <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                        {q.reviewNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Explanation: </span>
                    <span>{q.explanation}</span>
                  </div>
                )}

                {/* Card Bottom Actions */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="font-mono text-slate-400">
                    Correct: <strong>{q.correctOption || 'None'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {!isApproved && (
                      <button
                        onClick={() => handleApproveQuestion(q._id)}
                        disabled={needsReview}
                        title={needsReview ? 'Fix review issues before approving' : 'Approve question'}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= IN-PLACE QUESTION EDITOR MODAL ================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Edit Question #{editForm.questionNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Update question text, options, and designated correct answer. Saving will re-validate instantly.
                </p>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Question #
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.questionNumber}
                    onChange={(e) => setEditForm({ ...editForm, questionNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Correct Option *
                  </label>
                  <select
                    required
                    value={editForm.correctOption}
                    onChange={(e) => setEditForm({ ...editForm, correctOption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value="">-- Select Correct Option --</option>
                    {editForm.options.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        Option {opt.label}: {opt.text ? opt.text.slice(0, 45) + '...' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.questionText}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              {/* Options Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Multiple Choice Options ({editForm.options.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={2}
                        required
                        value={opt.label}
                        onChange={(e) => handleOptionChange(idx, 'label', e.target.value.toUpperCase())}
                        className="w-12 text-center py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt.label} text`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Explanation (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Reference traffic code rule or explanation..."
                  value={editForm.explanation}
                  onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save & Re-validate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

