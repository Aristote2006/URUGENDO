import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function AdminExerciseImport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractionStep, setExtractionStep] = useState('');
  const [error, setError] = useState('');

  // Files state
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getExerciseById(id);
      if (res.success && res.data) {
        setExercise(res.data.exercise);
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercise.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const validateFile = (file) => {
    if (!file) return 'File is required.';
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'Unsupported file type. Please upload a PDF document (.pdf).';
    }
    if (file.size > 15 * 1024 * 1024) {
      return 'File size exceeds 15MB limit.';
    }
    return null;
  };

  const handleQuestionFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setQuestionFile(file);
  };

  const handleAnswerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setAnswerFile(file);
  };

  const handleUploadAndExtract = async (e) => {
    e.preventDefault();
    if (!questionFile) {
      setError('Please select the Question Document (PDF).');
      return;
    }
    if (!answerFile) {
      setError('Please select the Answer Document (PDF).');
      return;
    }

    try {
      setExtracting(true);
      setError('');
      setExtractionStep('Uploading documents to server...');

      const formData = new FormData();
      formData.append('questionFile', questionFile);
      formData.append('answerFile', answerFile);

      setExtractionStep('Extracting text and parsing questions & answers...');
      const res = await adminService.importExerciseDocuments(id, formData);

      if (res.success) {
        setExtractionStep('Import complete! Redirecting to review...');
        setTimeout(() => {
          navigate(`/admin/exercises/${id}/review`);
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to extract and import questions.');
      setExtracting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-xs text-slate-500 space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
        <p>Loading exercise...</p>
      </div>
    );
  }

  const existingQuestionsCount = exercise?.questions?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={`/admin/exercises/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Details</span>
        </Link>

        <span className="text-xs text-slate-400">
          Lesson {exercise?.lessonId?.lessonNumber}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          Import Questions & Answers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload source PDF documents to automatically parse and match exercise questions with their answer keys.
        </p>
      </div>

      {/* Info Explainer */}
      <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Source Material Extraction Pipeline</p>
          <p className="mt-0.5 leading-relaxed text-brand-800 dark:text-brand-300">
            Upload the document containing the questions and options, then upload the document containing the corresponding correct answers. Questions and answers will be matched strictly by question number. Any discrepancies will be flagged for your review.
          </p>
        </div>
      </div>

      {/* Warning if replacing existing questions */}
      {existingQuestionsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Existing Questions Warning</p>
            <p className="mt-0.5 text-amber-800 dark:text-amber-300 leading-relaxed">
              This exercise already contains <strong>{existingQuestionsCount}</strong> questions. Uploading new documents will replace the current question set with the newly parsed questions.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
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

      {/* Upload Form */}
      <form onSubmit={handleUploadAndExtract} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Question Document Dropzone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500/60 transition-colors flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                1. Question Document (PDF)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Contains questions, question numbers, and options (A, B, C, D).
              </p>
            </div>

            {questionFile ? (
              <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-slate-800/80 border border-brand-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {questionFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(questionFile.size)} • PDF
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuestionFile(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleQuestionFileChange}
                  className="hidden"
                />
                <div className="py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <span className="font-bold text-xs text-brand-600 dark:text-brand-400 block">
                    Choose Questions PDF
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Click to browse or drag & drop
                  </span>
                </div>
              </label>
            )}
          </div>

          {/* Answer Document Dropzone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500/60 transition-colors flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                2. Answer Key Document (PDF)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Contains question numbers and correct option letters (e.g. 1. B, 2. C).
              </p>
            </div>

            {answerFile ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {answerFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(answerFile.size)} • PDF
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAnswerFile(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleAnswerFileChange}
                  className="hidden"
                />
                <div className="py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block">
                    Choose Answer Key PDF
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Click to browse or drag & drop
                  </span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {extracting ? (
              <div className="flex items-center gap-2 text-brand-600 font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{extractionStep}</span>
              </div>
            ) : (
              <span>Ready to extract. Maximum 15MB per document.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={`/admin/exercises/${id}`}
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={extracting || !questionFile || !answerFile}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {extracting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>Upload & Extract</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

