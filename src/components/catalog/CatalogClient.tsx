'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';
import type { CategoryId } from '@/types';

type Filter = 'all' | CategoryId;

const categoryFilters: { id: Filter; key: string }[] = [
  { id: 'all', key: 'catalog.filterAll' },
  { id: 'talleres', key: 'catalog.filterTalleres' },
  { id: 'regionales', key: 'catalog.filterRegionales' },
  { id: 'cafe', key: 'catalog.filterCafe' },
  { id: 'vino', key: 'catalog.filterVino' },
];

export function CatalogClient() {
  const { t, locale } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? products : products.filter((product) => product.category === filter)),
    [filter]
  );

  const activeLabel = t(categoryFilters.find((item) => item.id === filter)?.key ?? 'catalog.filterAll');

  return (
    <>
      <section className="relative overflow-hidden bg-jade-950 pb-16 pt-32 text-cream-100 md:pb-20 md:pt-40">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog-hero-cocina.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-jade-950/85 via-jade-950/75 to-jade-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(234,182,76,0.18),transparent_36%)]" />
        </div>
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border border-cream-100/10" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full border border-maize-400/15" />

        <div className="container-tgv relative">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-light animate-fade-up">{t('catalog.eyebrow')}</p>
            <h1 className="mt-5 font-display text-[clamp(3rem,7.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-cream-50">
              {t('catalog.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-cream-100/75">
              {t('catalog.description')}
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-cream-100/15 border-t border-cream-100/15 pt-6">
            {[
              { value: `${products.length}`, label: t('catalog.statRoutes') },
              { value: `${categoryFilters.length - 1}`, label: t('catalog.statCategories') },
              { value: '16', label: t('catalog.statStates') },
            ].map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0 md:px-7">
                <p className="font-display text-[1.8rem] font-medium leading-none text-maize-300 md:text-[2.3rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.55rem] font-bold uppercase leading-tight tracking-[0.16em] text-cream-100/55 md:text-[0.62rem]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          <div className="flex flex-col gap-6 border-b border-jade-900/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-clay-600">
                <Compass className="h-3.5 w-3.5" strokeWidth={1.8} />
                {t('catalog.filterLabel')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryFilters.map((item) => {
                  const active = filter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      aria-pressed={active}
                      className={
                        active
                          ? 'rounded-full border border-jade-900 bg-jade-900 px-4 py-2.5 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-cream-100 transition-all'
                          : 'rounded-full border border-jade-900/20 bg-cream-50 px-4 py-2.5 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-jade-900 transition-all hover:border-jade-900/50 hover:bg-cream-50/80'
                      }
                    >
                      {t(item.key)}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
              {t('catalog.results', { count: visible.length, category: activeLabel })}
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="mt-14 rounded-3xl border border-dashed border-jade-900/20 bg-cream-50 px-6 py-20 text-center">
              <p className="font-display text-2xl text-jade-900">{t('catalog.empty')}</p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="btn btn-outline mt-6"
              >
                {t('catalog.filterAll')}
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 pb-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product, index) => (
                <Reveal
                  key={product.slug}
                  delay={(index % 4) as 0 | 1 | 2 | 3}
                  className={index % 2 === 1 ? 'lg:translate-y-6' : ''}
                >
                  <ProductCard product={product} priority={index < 4} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-jade-900 py-16 text-cream-100 md:py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/mercado-color.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-jade-950/95 via-jade-900/85 to-jade-900/60" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(200,90,58,0.2),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(234,182,76,0.12),transparent_40%)]" />
        <div className="container-tgv relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="script text-[1.7rem] leading-none text-maize-300">
              {t('catalog.quoteAuthor')}
            </p>
            <blockquote className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,3.8vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.03em] text-cream-50">
              “{t('catalog.quote')}”
            </blockquote>
          </Reveal>
          <Reveal delay={1} className="lg:justify-self-end">
            <div className="max-w-md rounded-3xl border border-cream-100/15 bg-cream-100/[0.06] p-6 backdrop-blur-sm md:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maize-400 text-jade-950">
                <Sparkles className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-medium leading-tight text-cream-50 md:text-3xl">
                {t('catalog.ctaTitle')}
              </h2>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-cream-100/70">{t('catalog.ctaText')}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/contacto" className="btn btn-maize">
                  {t('catalog.ctaButton')}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
