'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT_EMAIL } from '@/lib/site';

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-clay-600 text-cream-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(234,182,76,0.2),transparent_38%),radial-gradient(circle_at_88%_80%,rgba(12,59,53,0.45),transparent_45%)]" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-cream-100/15" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-cream-100/10" />
      <div className="pointer-events-none absolute right-[12%] top-16 hidden h-4 w-4 rounded-full bg-maize-300 md:block" />
      <div className="pointer-events-none absolute bottom-20 left-[18%] hidden h-2.5 w-2.5 rounded-full bg-cream-100/50 md:block" />

      <div className="container-tgv relative py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow eyebrow-light justify-center">{t('home.final.eyebrow')}</p>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,6.4vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em] text-cream-50">
              {t('home.final.title')}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-cream-100/80">
              {t('home.final.description')}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-9 flex flex-col items-center justify-center">
              <Link href="/contacto" className="btn btn-maize w-full sm:w-auto">
                {t('home.final.cta')}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream-100/20 pt-6 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cream-100/55 md:flex-row">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-maize-300"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={1.7} />
            {CONTACT_EMAIL}
          </a>
          <p className="script text-lg normal-case tracking-normal text-maize-200/80">{t('footer.madeIn')}</p>
        </div>
      </div>
    </section>
  );
}
