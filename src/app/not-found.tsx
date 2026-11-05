'use client';

import Link from 'next/link';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-jade-950 px-5 pb-16 pt-32 text-cream-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(234,182,76,0.16),transparent_36%),radial-gradient(circle_at_12%_82%,rgba(200,90,58,0.18),transparent_40%)]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full border border-cream-100/10" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full border border-maize-400/15" />

      <div className="container-tgv relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cream-100/20 bg-cream-100/5 text-maize-300">
            <Compass className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <p className="eyebrow eyebrow-light mt-7 justify-center">{t('notFound.eyebrow')}</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.05em] text-cream-50">
            {t('notFound.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-relaxed text-cream-100/70">
            {t('notFound.text')}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-maize">
              {t('notFound.cta')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link href="/rutas" className="btn btn-outline-light">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              {t('notFound.routes')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
