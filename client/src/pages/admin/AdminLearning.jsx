import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Layers,
  CheckCircle2,
  Clock,
  User,
  Plus,
  RefreshCw,
  AlertCircle,
  Eye,
  FileText,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminLearning() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLearning = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getLearningOverview();
      if (res.success && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load learning overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearning();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Learning Management Foundation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curriculum overview, video lecture metadata, and lesson publishing status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLearning}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Info notice explaining Phase 1 scope */}
      <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 text-xs text-brand-800 dark:text-brand-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Phase 1 Content Foundation</p>
          <p className="mt-0.5 leading-relaxed text-brand-700 dark:text-brand-400">
            This administrative screen provides structured visibility into the current 3-module provisional license curriculum. Detailed CRUD video upload pipelines, category creators, and interactive lesson editors will be introduced in subsequent phases.
          </p>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Modules
          </span>
          <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1">
            {overview?.totalModules || 3}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Official Rwanda Police syllabus
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Video Lessons
          </span>
          <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1">
            {overview?.totalLessons || 8}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Certified driving instructor lectures
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Publishing Status
          </span>
          <p className="font-display font-bold text-3xl text-emerald-700 dark:text-emerald-400 mt-1">
            100% Live
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active for paid student access
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {(overview?.modules || []).map((mod, idx) => (
          <div
            key={mod.id || idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {mod.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    {mod.titleEn}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instructor: <strong>{mod.instructor}</strong> • {mod.lessonsCount} lessons
                </p>
              </div>

              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Published
              </span>
            </div>

            {/* Lessons table inside module */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mod.lessons.map((lesson, lIdx) => (
                <div
                  key={lesson.id || lIdx}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {lesson.titleEn}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {lesson.duration}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

