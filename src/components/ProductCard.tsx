'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const categoryKey: Record<Product['category'], string> = {
  talleres: 'catalog.filterTalleres',
  regionales: 'catalog.filterRegionales',
  cafe: 'catalog.filterCafe',
  vino: 'catalog.filterVino',
};

export function ProductCard({
  product,
  priority = false,
  className = '',
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { locale, t } = useLanguage();

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`product-card group flex h-full flex-col ${className}`}
      aria-label={product.title[locale]}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-jade-900/10">
        <Image
          src={product.image}
          alt={product.title[locale]}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="product-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jade-950/70 via-jade-950/5 to-transparent opacity-80" />

        <span className="absolute left-4 top-4 rounded-full border border-cream-100/25 bg-jade-950/55 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-cream-100 backdrop-blur-md">
          {product.tag[locale]}
        </span>

        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-cream-100/90 px-2.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-jade-900 backdrop-blur">
          <MapPin className="h-3 w-3 text-clay-500" strokeWidth={2} />
          {product.state[locale]}
        </span>

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-cream-100/70">
              {t(categoryKey[product.category])}
            </p>
            <p className="mt-1 font-display text-[1.1rem] font-medium leading-tight text-cream-50 line-clamp-2">
              {product.title[locale]}
            </p>
          </div>
          <span className="product-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-jade-900">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-[0.78rem] leading-relaxed text-muted">
          {product.short[locale]}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-jade-900/10 pt-4">
          <div>
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-muted/70">
              {t('common.from')}
            </p>
            <p className="font-display text-[1.35rem] font-medium leading-none text-jade-900">
              {formatPrice(product.price, locale)}
              <span className="ml-1 font-sans text-[0.55rem] font-bold tracking-wider text-muted/70">MXN</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-clay-600">
              {t('common.vatIncluded')}
            </p>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-muted/60">
              {t('common.perPerson')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
