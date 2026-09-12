import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-28 pb-20 px-5 flex items-center justify-center min-h-[75vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-400">
            404 Error
          </span>
        </div>
        <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tightest mb-4">
          Road not found.
        </h1>
        <p className="text-base text-ink-600 dark:text-ink-400 mb-8 leading-relaxed">
          The page you are looking for has taken a detour or does not exist yet in this phase.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold btn-primary rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
