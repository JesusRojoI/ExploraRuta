'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export function FAQ() {
  const { t, messages } = useLanguage();
  const [open, setOpen] = useState(0);
  const items = messages.home.faq.items;

  return (
    <section id="faq" className="section bg-cream-100">
      <div className="container-tgv grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t('home.faq.eyebrow')}</p>
          <h2 className="title-serif mt-5 max-w-md text-[clamp(2.5rem,4.8vw,4.3rem)] text-jade-900">
            {t('home.faq.title')}
          </h2>
          <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-muted">
            {t('home.faq.subtitle')}
          </p>
          <div className="mt-8 rounded-2xl border border-jade-900/10 bg-cream-50 p-5">
            <p className="script text-[1.45rem] leading-tight text-clay-600">
              {t('contact.quote')}
            </p>
            <Link
              href="/contacto"
              className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-jade-900 transition-colors hover:text-clay-600"
            >
              {t('home.faq.cta')}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={1} className="divide-y divide-jade-900/10 border-y border-jade-900/10">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span
                    className={`font-display text-[1.15rem] font-medium leading-snug transition-colors md:text-[1.3rem] ${
                      isOpen ? 'text-clay-600' : 'text-jade-900 group-hover:text-clay-600'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? 'rotate-45 border-clay-500 bg-clay-500 text-cream-50'
                        : 'border-jade-900/20 text-jade-900 group-hover:border-clay-500'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-10 text-[0.88rem] leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
