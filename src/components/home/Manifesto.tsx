'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export function Manifesto() {
  const { t } = useLanguage();

  const images = [
    { src: '/images/gallery/fogon.jpg', alt: t('home.manifesto.imageAltKitchen') },
    { src: '/images/gallery/mercado-color.jpg', alt: t('home.manifesto.imageAltMarket') },
    { src: '/images/gallery/cafe.jpg', alt: t('home.manifesto.imageAltCoffee') },
  ];

  return (
    <section className="relative overflow-hidden bg-jade-950 py-20 text-cream-100 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream-100/10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-maize-400/15" />
      <div className="pointer-events-none absolute -bottom-40 right-[-8rem] h-80 w-80 rounded-full border border-clay-400/20" />

      <div className="container-tgv relative text-center">
        <Reveal>
          <p className="eyebrow eyebrow-light justify-center">{t('home.manifesto.eyebrow')}</p>
        </Reveal>
        <Reveal delay={1}>
          <blockquote className="mx-auto mt-8 max-w-5xl font-display text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.05em] text-cream-50">
            {t('home.manifesto.quoteLine1')}
            <br />
            <span className="italic text-maize-300">{t('home.manifesto.quoteLine2')}</span>
          </blockquote>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-7 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-cream-100/50">
            {t('home.manifesto.author')}
          </p>
        </Reveal>

        <Reveal delay={2} className="mt-14 grid grid-cols-3 gap-3 sm:gap-5">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden ${index === 1 ? 'arch-small mt-8' : 'rounded-2xl'} aspect-[3/4]`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 30vw, 220px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jade-950/55 to-transparent" />
            </div>
          ))}
        </Reveal>

        <Reveal delay={3} className="mt-10">
          <Link
            href="/rutas"
            className="inline-flex items-center gap-2 border-b border-maize-400/40 pb-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-maize-300 transition-colors hover:border-maize-300 hover:text-maize-200"
          >
            {t('home.manifesto.quoteLink')}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
