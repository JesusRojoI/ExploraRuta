'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';

const images = [
  '/images/gallery/hacienda.jpg',
  '/images/gallery/cafe-altura.jpg',
  '/images/gallery/costa.jpg',
  '/images/gallery/fogon.jpg',
  '/images/gallery/mercado-color.jpg',
  '/images/gallery/estero.jpg',
];

const collageLayout = [
  'col-span-2 row-span-2 min-h-[18rem] md:min-h-0',
  'col-span-1 min-h-[9rem] md:min-h-0',
  'col-span-1 min-h-[9rem] md:min-h-0',
  'col-span-1 min-h-[9rem] md:min-h-0',
  'col-span-1 min-h-[9rem] md:min-h-0',
  'col-span-2 min-h-[9rem] md:col-span-1 md:min-h-0',
];

export function MomentsGallery() {
  const { t, messages } = useLanguage();
  const items = messages.home.gallery.items;

  return (
    <section className="relative overflow-hidden bg-jade-950 py-20 text-cream-100 md:py-28">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full border border-cream-100/10" />
      <div className="container-tgv relative">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow eyebrow-light">{t('home.gallery.eyebrow')}</p>
            <h2 className="title-serif mt-4 text-[clamp(2.5rem,5vw,4.6rem)] text-cream-50">
              {t('home.gallery.title')}
            </h2>
            <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-cream-100/60">
              {t('home.gallery.subtitle')}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid auto-rows-[10rem] grid-cols-2 gap-3 md:grid-cols-3 md:auto-rows-[12rem] lg:auto-rows-[13rem]">
          {items.map((item, index) => (
            <Reveal
              key={item.label}
              delay={(index % 3) as 0 | 1 | 2}
              className={`group relative overflow-hidden ${collageLayout[index] ?? ''}`}
            >
              <article className="relative h-full min-h-[9rem] w-full overflow-hidden rounded-2xl">
                <Image
                  src={images[index]}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jade-950/85 via-jade-950/20 to-transparent" />
                <span className="absolute left-4 top-4 font-display text-xl font-light text-cream-100/60">
                  0{index + 1}
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="font-display text-[1.05rem] font-medium leading-tight text-cream-50 md:text-[1.2rem]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.14em] text-maize-300/85">
                    {item.place}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2} className="mt-10 flex justify-center">
          <Link href="/contacto" className="btn btn-maize">
            {t('home.gallery.cta')}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
