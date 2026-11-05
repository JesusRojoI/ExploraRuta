'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Users,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';
import { formatDate, formatPrice } from '@/lib/utils';

export function CartClient() {
  const { locale, t } = useLanguage();
  const { items, subtotal: total, updateQuantity, removeItem, getSubtotal, getTaxIncluded } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = getSubtotal();
  const tax = getTaxIncluded();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-32 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <>
      <section className="bg-jade-950 pb-12 pt-32 text-cream-100 md:pb-16 md:pt-40">
        <div className="container-tgv">
          <p className="eyebrow eyebrow-light">{t('cart.eyebrow')}</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] font-medium leading-none tracking-[-0.045em] text-cream-50">
              {t('cart.title')}
            </h1>
            {items.length > 0 && (
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cream-100/55">
                {count} {count === 1 ? t('common.traveler') : t('common.travelers')} ·{' '}
                {items.length} {items.length === 1 ? t('common.experience') : t('common.experiences')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          {items.length === 0 ? (
            <Reveal className="mx-auto max-w-xl rounded-[2rem] border border-jade-900/10 bg-cream-50 px-6 py-16 text-center shadow-soft">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-jade-900/25 text-jade-700">
                <ShoppingBag className="h-6 w-6" strokeWidth={1.4} />
              </span>
              <h2 className="mt-5 font-display text-3xl font-medium text-jade-900">{t('cart.emptyTitle')}</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-muted">{t('cart.emptyText')}</p>
              <Link href="/rutas" className="btn btn-primary mt-7">
                {t('cart.emptyCta')}
                <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              </Link>
            </Reveal>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
              <div className="space-y-4">
                {items.map((item, index) => {
                  const product = products.find((p) => p.slug === item.slug);
                  if (!product) return null;
                  return (
                    <Reveal
                      key={`${item.slug}-${item.date}`}
                      delay={(index % 3) as 0 | 1 | 2}
                      className="overflow-hidden rounded-3xl border border-jade-900/10 bg-cream-50 shadow-soft"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <Link
                          href={`/product/${product.slug}`}
                          className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44"
                        >
                          <Image
                            src={product.image}
                            alt={product.title[locale]}
                            fill
                            sizes="(max-width: 640px) 100vw, 176px"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-clay-600">
                                {product.tag[locale]} · {product.state[locale]}
                              </p>
                              <Link
                                href={`/product/${product.slug}`}
                                className="mt-1.5 block font-display text-xl font-medium leading-snug text-jade-900 transition-colors hover:text-clay-600"
                              >
                                {product.title[locale]}
                              </Link>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.slug, item.date)}
                              aria-label={t('cart.remove')}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-jade-900/12 text-jade-900/45 transition-colors hover:border-clay-500/40 hover:bg-clay-50 hover:text-clay-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.68rem] text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-clay-500" strokeWidth={1.8} />
                              {formatDate(item.date, locale)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-clay-500" strokeWidth={1.8} />
                              {item.quantity}{' '}
                              {item.quantity === 1 ? t('product.adultSuffix') : t('product.adultsSuffix')}
                            </span>
                          </div>

                          <div className="mt-auto flex items-end justify-between gap-4 border-t border-jade-900/10 pt-4">
                            <div>
                              <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-muted/70">
                                {t('common.quantity')}
                              </span>
                              <div className="mt-1 flex w-fit items-center rounded-full border border-jade-900/15 bg-cream-100">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.slug, item.date, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="-"
                                  className="flex h-8 w-8 items-center justify-center text-jade-900 transition-colors hover:bg-jade-900/5 disabled:opacity-30"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={2} />
                                </button>
                                <span className="w-6 text-center text-[0.72rem] font-bold text-jade-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.slug, item.date, item.quantity + 1)}
                                  disabled={item.quantity >= 12}
                                  aria-label="+"
                                  className="flex h-8 w-8 items-center justify-center text-jade-900 transition-colors hover:bg-jade-900/5 disabled:opacity-30"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-xl font-medium text-jade-900">
                                {formatPrice(product.price * item.quantity, locale)}
                              </p>
                              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted/65">
                                {t('common.vatIncluded')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
                  <Link
                    href="/rutas"
                    className="group inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-jade-900 transition-colors hover:text-clay-600"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
                    {t('cart.continue')}
                  </Link>
                  <Link
                    href="/contacto"
                    className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-clay-600 transition-colors hover:text-clay-700"
                  >
                    {t('cart.questionCta')}
                  </Link>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <Reveal delay={1} className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft">
                  <h2 className="font-display text-2xl font-medium text-jade-900">{t('cart.summary')}</h2>

                  <dl className="mt-6 space-y-3 text-[0.82rem]">
                    <div className="flex items-center justify-between text-muted">
                      <dt>{t('cart.subtotal')}</dt>
                      <dd className="font-semibold text-jade-900">{formatPrice(subtotal, locale)}</dd>
                    </div>
                    <div className="flex items-center justify-between text-muted">
                      <dt>{t('cart.taxIncluded')}</dt>
                      <dd className="font-semibold text-jade-900">{formatPrice(tax, locale)}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-jade-900/10 pt-3">
                      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-jade-900">
                        {t('cart.total')}
                      </dt>
                      <dd className="font-display text-2xl font-medium text-jade-900">
                        {formatPrice(total, locale)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-4 text-[0.66rem] leading-relaxed text-muted/80">{t('cart.vatNote')}</p>

                  <Link href="/checkout" className="btn btn-clay mt-5 w-full">
                    {t('cart.checkout')}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                  </Link>
                  <Link href="/rutas" className="btn btn-outline mt-2 w-full">
                    {t('cart.continue')}
                  </Link>

                  <div className="mt-6 space-y-3 border-t border-jade-900/10 pt-5">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" strokeWidth={1.8} />
                      <div>
                        <p className="text-[0.7rem] font-bold text-jade-900">{t('cart.secure')}</p>
                        <p className="text-[0.64rem] text-muted">{t('product.secureText')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" strokeWidth={1.8} />
                      <div>
                        <p className="text-[0.7rem] font-bold text-jade-900">{t('cart.flexible')}</p>
                        <p className="text-[0.64rem] text-muted">{t('product.flexibleText')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    {[
                      { src: '/visa.svg', alt: 'Visa' },
                      { src: '/mastercard.svg', alt: 'Mastercard' },
                      { src: '/secure.svg', alt: 'Pago seguro' },
                    ].map((method) => (
                      <span
                        key={method.src}
                        className="flex h-7 w-10 items-center justify-center rounded border border-jade-900/10 bg-white px-1"
                      >
                        <Image src={method.src} alt={method.alt} width={36} height={18} className="h-3.5 w-auto" />
                      </span>
                    ))}
                  </div>
                </Reveal>

                <div className="mt-4 rounded-2xl border border-jade-900/10 bg-cream-200/70 p-5 text-center">
                  <p className="text-[0.72rem] font-bold text-jade-900">{t('cart.question')}</p>
                  <Link
                    href="/contacto"
                    className="mt-1.5 inline-flex items-center gap-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-clay-600 hover:text-clay-700"
                  >
                    {t('cart.questionCta')}
                    <ArrowRight className="h-3 w-3" strokeWidth={1.9} />
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
