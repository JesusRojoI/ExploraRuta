'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice, todayISO } from '@/lib/utils';
import { products } from '@/data/products';
import type { Product } from '@/types';

export function ProductDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { addItem } = useCart();
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [added, setAdded] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [copied, setCopied] = useState(false);
  const minDate = todayISO();

  const related = useMemo(() => {
    const sameCategory = products.filter((p) => p.slug !== product.slug && p.category === product.category);
    const rest = products.filter((p) => p.slug !== product.slug && p.category !== product.category);
    return [...sameCategory, ...rest].slice(0, 4);
  }, [product]);

  const total = product.price * adults;

  const handleAdd = () => {
    if (!date) {
      setDateError(true);
      return;
    }
    setDateError(false);
    addItem(product.slug, date, adults);
    setAdded(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.title[locale]} · ExploraRuta`,
      text: product.short[locale],
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      // Sharing was cancelled or is unavailable.
    }
  };

  return (
    <>
      <div className="bg-cream-100 pb-4 pt-28 md:pt-32">
        <div className="container-tgv">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted"
          >
            <Link href="/" className="transition-colors hover:text-clay-600">
              {t('product.breadcrumbHome')}
            </Link>
            <span className="text-jade-900/25">/</span>
            <Link href="/rutas" className="transition-colors hover:text-clay-600">
              {t('product.breadcrumbRoutes')}
            </Link>
            <span className="text-jade-900/25">/</span>
            <span className="line-clamp-1 max-w-[16rem] text-jade-900/70">{product.title[locale]}</span>
          </nav>
        </div>
      </div>

      <section className="bg-cream-100 pb-16 md:pb-24">
        <div className="container-tgv grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-jade-900/10 shadow-soft">
                <Image
                  src={product.image}
                  alt={product.title[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jade-950/45 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cream-100/25 bg-jade-950/60 px-3.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-cream-100 backdrop-blur-md">
                    {product.tag[locale]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100/90 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-jade-900 backdrop-blur">
                    <MapPin className="h-3 w-3 text-clay-500" strokeWidth={2} />
                    {product.state[locale]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/30 bg-jade-950/50 text-cream-100 backdrop-blur-md transition-colors hover:bg-clay-500 hover:text-cream-50"
                  aria-label={t('product.share')}
                  title={copied ? t('product.shareCopied') : t('product.share')}
                >
                  {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Share2 className="h-4 w-4" strokeWidth={1.7} />}
                </button>
              </div>
            </Reveal>

            <Reveal delay={1} className="mt-8">
              <p className="eyebrow">{t('product.aboutEyebrow')}</p>
              <h1 className="title-serif mt-4 text-[clamp(2.4rem,5vw,4.4rem)] text-jade-900">
                {product.title[locale]}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{product.short[locale]}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-jade-700/70">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-clay-500" strokeWidth={1.8} />
                  {product.state[locale]}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-clay-500" strokeWidth={1.8} />
                  {t('product.localGuidesText')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-clay-500" strokeWidth={1.8} />
                  {t('product.durationNote')}
                </span>
              </div>
            </Reveal>

            <Reveal delay={2} className="mt-10 border-t border-jade-900/10 pt-8">
              <h2 className="font-display text-2xl font-medium text-jade-900">{t('product.about')}</h2>
              <div className="mt-4 space-y-4 text-[0.92rem] leading-[1.85] text-muted">
                {product.about[locale].map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={3} className="mt-10">
              <div className="relative overflow-hidden rounded-3xl bg-jade-900 p-6 text-cream-100 md:p-9">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-maize-400/20" />
                <p className="script text-[1.6rem] leading-none text-maize-300">{t('product.why')}</p>
                <p className="mt-3 max-w-3xl font-display text-[1.2rem] font-medium leading-relaxed text-cream-50 md:text-[1.45rem]">
                  {product.why[locale]}
                </p>
              </div>
            </Reveal>
          </div>

          <aside className="lg:relative">
            <Reveal delay={1} className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[1.75rem] border border-jade-900/12 bg-cream-50 shadow-lift">
                <div className="border-b border-jade-900/10 bg-jade-900 px-6 py-5 text-cream-100">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-maize-300">
                    {t('product.priceLabel')}
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="font-display text-[2.3rem] font-medium leading-none">
                      {formatPrice(product.price, locale)}
                      <span className="ml-1.5 font-sans text-[0.6rem] font-bold tracking-widest text-cream-100/60">
                        MXN
                      </span>
                    </p>
                    <span className="rounded-full border border-cream-100/20 bg-cream-100/10 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-cream-100/80">
                      {t('product.taxNote')}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <label htmlFor="tour-date" className="label">
                      {t('product.dateLabel')}
                    </label>
                    <input
                      id="tour-date"
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value);
                        setDateError(false);
                        setAdded(false);
                      }}
                      className={`input ${dateError ? 'input-error' : ''}`}
                      aria-invalid={dateError}
                      aria-describedby={dateError ? 'date-error' : undefined}
                    />
                    {dateError ? (
                      <p id="date-error" className="mt-2 text-[0.7rem] font-semibold text-clay-600">
                        {t('product.selectDate')}
                      </p>
                    ) : (
                      <p className="mt-2 text-[0.68rem] text-muted/75">{t('product.dateHint')}</p>
                    )}
                  </div>

                  <div>
                    <span className="label">{t('product.travelersLabel')}</span>
                    <div className="flex items-center justify-between rounded-xl border border-jade-900/18 bg-white/55 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setAdults((value) => Math.max(1, value - 1))}
                        disabled={adults <= 1}
                        aria-label="-"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-jade-900/15 text-jade-900 transition-colors hover:bg-jade-900/5 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <span className="text-sm font-bold text-jade-900">
                        {adults} {adults === 1 ? t('product.adultSuffix') : t('product.adultsSuffix')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((value) => Math.min(12, value + 1))}
                        disabled={adults >= 12}
                        aria-label="+"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-jade-900/15 text-jade-900 transition-colors hover:bg-jade-900/5 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                    {adults >= 12 && (
                      <p className="mt-2 text-[0.68rem] leading-relaxed text-clay-600">{t('product.maxTravelers')}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-jade-900/[0.055] px-4 py-3">
                    <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted">
                      {t('common.total')}
                    </span>
                    <span className="font-display text-xl font-medium text-jade-900">
                      {formatPrice(total, locale)}
                    </span>
                  </div>

                  <button type="button" onClick={handleAdd} className="btn btn-clay w-full">
                    {t('product.addToCart')}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                  </button>

                  {added && (
                    <div className="animate-rise rounded-xl border border-jade-500/20 bg-jade-500/10 px-4 py-3 text-center">
                      <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-jade-800">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={1.9} />
                        {t('product.added')}
                      </p>
                      <Link
                        href="/carrito"
                        className="mt-2 flex items-center justify-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-clay-600 hover:text-clay-700"
                      >
                        {t('product.addedCta')}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </Link>
                    </div>
                  )}

                  <div className="space-y-3 border-t border-jade-900/10 pt-5">
                    {[
                      { icon: ShieldCheck, title: t('product.secure'), note: t('product.secureText') },
                      { icon: CalendarDays, title: t('product.flexible'), note: t('product.flexibleText') },
                      { icon: Users, title: t('product.localGuides'), note: t('product.localGuidesText') },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jade-900/[0.06] text-jade-700">
                          <item.icon className="h-4 w-4" strokeWidth={1.7} />
                        </span>
                        <div>
                          <p className="text-[0.72rem] font-bold text-jade-900">{item.title}</p>
                          <p className="text-[0.66rem] text-muted">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-jade-900/10 pt-4">
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-muted/70">
                      {t('product.paymentNote')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { src: '/visa.svg', alt: 'Visa' },
                        { src: '/mastercard.svg', alt: 'Mastercard' },
                      ].map((method) => (
                        <span
                          key={method.src}
                          className="flex h-7 w-10 items-center justify-center rounded border border-jade-900/10 bg-white px-1"
                        >
                          <Image src={method.src} alt={method.alt} width={36} height={18} className="h-3.5 w-auto" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-jade-900/10 bg-cream-50/70 p-5 text-center">
                <p className="text-[0.78rem] font-bold text-jade-900">{t('product.contactQuestion')}</p>
                <Link
                  href="/contacto"
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-clay-600 hover:text-clay-700"
                >
                  {t('product.contactCta')}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-t border-jade-900/10 bg-cream-200 py-14 md:py-20">
        <div className="container-tgv grid gap-8 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-jade-900/10 bg-cream-50 p-6 md:p-8">
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-medium text-jade-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jade-500/15 text-jade-700">
                <Check className="h-4 w-4" strokeWidth={2.2} />
              </span>
              {t('product.includes')}
            </h2>
            <ul className="mt-5 space-y-3">
              {product.includes[locale].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-jade-900/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-jade-500" strokeWidth={1.8} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={1} className="rounded-3xl border border-jade-900/10 bg-cream-50 p-6 md:p-8">
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-medium text-jade-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-500/15 text-clay-600">
                <X className="h-4 w-4" strokeWidth={2.2} />
              </span>
              {t('product.excludes')}
            </h2>
            <ul className="mt-5 space-y-3">
              {product.excludes[locale].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-jade-900/75">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" strokeWidth={1.8} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={2} className="rounded-3xl border border-jade-900/10 bg-cream-50 p-6 md:p-8 lg:col-span-2">
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-medium text-jade-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maize-400/25 text-maize-700">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              </span>
              {t('product.special')}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {product.special[locale].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-jade-900/[0.07] bg-cream-100/60 p-4 text-[0.86rem] leading-relaxed text-jade-900/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7 border-t border-jade-900/10 pt-6">
              <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-clay-600">
                {t('product.recommendations')}
              </h3>
              <p className="mt-3 max-w-4xl text-[0.9rem] leading-[1.85] text-muted">
                {product.recommendations[locale]}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          <Reveal className="flex flex-col gap-4 border-b border-jade-900/10 pb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t('product.relatedSubtitle')}</p>
              <h2 className="title-serif mt-4 text-[clamp(2.2rem,4.6vw,3.9rem)] text-jade-900">
                {t('product.related')}
              </h2>
            </div>
            <Link
              href="/rutas"
              className="group inline-flex shrink-0 items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-jade-900 transition-colors hover:text-clay-600"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
              {t('product.backToRoutes')}
            </Link>
          </Reveal>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
