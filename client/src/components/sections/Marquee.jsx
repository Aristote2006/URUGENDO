import React from 'react';

const marqueeItems = [
  'Road Signs',
  'Traffic Rules',
  'Mock Exams',
  'Practice Questions',
  'Progress Tracking',
  'Bilingual Learning',
  'Road Safety',
  "Amategeko y'Umuhanda",
];

export default function Marquee() {
  return (
    <section className="py-10 md:py-14 border-y border-ink-200 dark:border-ink-800 overflow-hidden bg-ink-50 dark:bg-ink-950">
      <div className="marquee whitespace-nowrap flex">
        <div className="flex items-center gap-16 px-8 text-ink-400 dark:text-ink-600 font-grotesk text-xl md:text-2xl tracking-tight flex-shrink-0">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              <span className="text-brand-500">·</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-16 px-8 text-ink-400 dark:text-ink-600 font-grotesk text-xl md:text-2xl tracking-tight flex-shrink-0" aria-hidden="true">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={`dup-${idx}`}>
              <span>{item}</span>
              <span className="text-brand-500">·</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
