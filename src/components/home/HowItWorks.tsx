'use client';

import { Compass, Flame, PencilRuler } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';

const icons = [Compass, PencilRuler, Flame];

export function HowItWorks() {
  const { t, messages } = useLanguage();
  const steps = messages.home.how.steps;

  return (
    <section id="como" className="section relative overflow-hidden bg-cream-100">
      <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full border border-jade-900/[0.06]" />
      <div className="container-tgv relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">{t('home.how.eyebrow')}</p>
            <h2 className="title-serif mt-5 max-w-2xl text-[clamp(2.5rem,5vw,4.5rem)] text-jade-900">
              {t('home.how.title')}
            </h2>
          </Reveal>
          <Reveal delay={1} className="lg:pb-2">
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted lg:ml-auto">
              {t('home.how.subtitle')}
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14 grid gap-0 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-[5.4rem] hidden h-px bg-[radial-gradient(circle,rgba(12,59,53,0.45)_1px,transparent_1.2px)] bg-[length:11px_1px] md:block" />
          {steps.map((step, index) => {
            const Icon = icons[index] ?? Compass;
            return (
              <Reveal
                key={step.number}
                delay={(index + 1) as 1 | 2 | 3}
                className="group relative border-b border-jade-900/10 py-8 md:border-b-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                {index > 0 && (
                  <span className="absolute left-0 top-0 hidden h-full w-px bg-jade-900/10 md:block" />
                )}
                <div className="relative">
                  <span className="font-display text-[4.2rem] font-light leading-none text-jade-900/[0.12] transition-colors duration-500 group-hover:text-clay-500/25">
                    {step.number}
                  </span>
                  <span className="absolute left-[4.5rem] top-4 flex h-11 w-11 items-center justify-center rounded-full border border-jade-900/15 bg-cream-50 text-jade-800 transition-all duration-500 group-hover:border-clay-500/40 group-hover:bg-clay-500 group-hover:text-cream-50">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[1.65rem] font-medium leading-tight text-jade-900">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.88rem] leading-relaxed text-muted">{step.text}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={2} className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-jade-900/10 pt-5">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted/70">
            {t('product.durationNote')}
          </p>
          <div className="dotted-line h-px w-28 opacity-60 md:w-44" />
        </Reveal>
      </div>
    </section>
  );
}
