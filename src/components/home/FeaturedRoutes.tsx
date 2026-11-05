'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { featuredProducts } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

export function FeaturedRoutes() {
  const { t } = useLanguage();
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const container = scroller.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>('[data-route-card]');
    const gap = parseFloat(getComputedStyle(container).columnGap || '20') || 20;
    const step = card ? card.offsetWidth + gap : container.clientWidth * 0.8;
    container.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className="section bg-cream-100">
      <div className="container-tgv">
        <div className="flex flex-col gap-6 border-b border-jade-900/10 pb-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t('home.featured.eyebrow')}</p>
            <h2 className="title-serif mt-4 text-[clamp(2.6rem,5.4vw,5rem)] text-jade-900">
              {t('home.featured.title')}
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
              {t('home.featured.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={1} className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label={t('home.featured.prev')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-jade-900/20 text-jade-900/70 transition-colors hover:border-clay-500 hover:bg-clay-500 hover:text-cream-50"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label={t('home.featured.next')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-jade-900/20 text-jade-900/70 transition-colors hover:border-clay-500 hover:bg-clay-500 hover:text-cream-50"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <Link
              href="/rutas"
              className="group inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-jade-900 transition-colors hover:text-clay-600"
            >
              {t('home.featured.cta')}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-jade-900/20 transition-all group-hover:border-clay-500 group-hover:bg-clay-500 group-hover:text-cream-50">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </span>
            </Link>
          </Reveal>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8"
        >
          {featuredProducts.map((product) => (
            <div
              key={product.slug}
              data-route-card
              className="w-[78vw] max-w-[19rem] shrink-0 snap-start sm:w-[19rem] lg:w-[21rem]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
