import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqData } from '../../data/faqData';
import { useLanguage } from '../../context/LanguageContext';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const { t } = useLanguage();

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="help" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              {t('faq.label')}
            </span>
            <div className="w-8 h-px bg-brand-600 dark:bg-brand-400"></div>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] mb-6">
            {t('faq.headlinePrefix')}
            <span className="font-grotesk italic font-medium text-brand-600 dark:text-brand-400">
              {t('faq.headlineSuffix')}
            </span>
          </h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 max-w-xl mx-auto">
            {t('faq.description')}
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item border border-ink-200 dark:border-ink-800 rounded-xl bg-ink-50 dark:bg-ink-950 overflow-hidden transition-colors ${
                  isOpen ? 'open' : ''
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="faq-toggle w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left focus:outline-none"
                >
                  <span className="font-display font-semibold text-base md:text-lg tracking-tight">
                    {item.question}
                  </span>
                  <span
                    className={`faq-icon flex-shrink-0 w-8 h-8 rounded-full border border-ink-300 dark:border-ink-700 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <div
                  className="faq-content transition-all duration-400 ease-in-out"
                  style={{ maxHeight: isOpen ? '500px' : '0px' }}
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-ink-600 dark:text-ink-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
