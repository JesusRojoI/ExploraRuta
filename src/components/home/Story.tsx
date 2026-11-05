'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export function Story() {
  const { t } = useLanguage();

  return (
    <section id="historia" className="section relative overflow-hidden bg-cream-200">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-jade-900/[0.06]" />
      <div className="container-tgv grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t('home.story.eyebrow')}</p>
          <h2 className="title-serif mt-5 max-w-xl text-[clamp(2.5rem,5vw,4.6rem)] text-jade-900">
            {t('home.story.title')}
          </h2>
          <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-muted">
            <p>{t('home.story.body1')}</p>
            <p>{t('home.story.body2')}</p>
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-jade-900/12 pt-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay-500/10 text-clay-600">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="script text-[1.55rem] leading-none text-clay-600">
                {t('home.story.signature')}
              </p>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted/60">
                {t('home.story.role')}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1} className="relative mx-auto w-full max-w-lg">
          <div className="relative ml-auto w-[82%]">
            <div className="arch relative aspect-[4/5] overflow-hidden border border-cream-50/70 shadow-card">
              <Image
                src="/images/gallery/fogon.jpg"
                alt={t('home.story.imageAltCook')}
                fill
                sizes="(max-width: 1024px) 70vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jade-950/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-8 w-[48%] rounded-2xl border-4 border-cream-200 shadow-soft">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src="/images/gallery/mercado-color.jpg"
                  alt={t('home.story.imageAltMarket')}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="absolute -right-3 top-8 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full border border-clay-500/40 bg-cream-100 text-center shadow-soft md:-right-6">
            <span className="font-display text-2xl font-medium leading-none text-clay-600">100%</span>
            <span className="mt-1 text-[0.42rem] font-bold uppercase leading-tight tracking-[0.12em] text-jade-800/70">
              {t('home.story.badgeLine1')}
              <br />
              {t('home.story.badgeLine2')}
            </span>
          </div>

          <p className="script mt-10 text-center text-[1.4rem] text-jade-800/60">
            {t('home.story.imageCaption')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
