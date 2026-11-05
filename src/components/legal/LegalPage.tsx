'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function LegalPage({ titleKey }: { titleKey: string }) {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative overflow-hidden bg-jade-950 pb-14 pt-32 text-cream-100 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(234,182,76,0.14),transparent_38%),radial-gradient(circle_at_10%_85%,rgba(200,90,58,0.16),transparent_40%)]" />
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full border border-cream-100/10" />
        <div className="container-tgv relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-100/20 bg-cream-100/5 text-maize-300">
            <FileText className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,6.5vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-cream-50">
            {t(titleKey)}
          </h1>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-jade-900/20 bg-cream-50 px-6 py-20 text-center">
            <span className="script text-[2rem] leading-none text-clay-500">
              {t('meta.siteName')}
            </span>
            <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted">
              {t('legal.pending')}
            </p>
            <div className="mx-auto mt-8 h-px w-24 bg-jade-900/15" />
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-jade-900 transition-colors hover:text-clay-600"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              {t('legal.back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
