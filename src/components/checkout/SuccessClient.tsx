'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, formatPrice } from '@/lib/utils';
import type { OrderSummary } from '@/types';

export function SuccessClient() {
  const searchParams = useSearchParams();
  const { locale, t } = useLanguage();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [ready, setReady] = useState(false);

  const orderId = searchParams.get('order');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('exploraruta-last-order');
      if (raw) {
        const parsed = JSON.parse(raw) as OrderSummary;
        if (!orderId || parsed.orderId === orderId) setOrder(parsed);
      }
    } catch {
      setOrder(null);
    }
    setReady(true);
  }, [orderId]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-32 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted">
        {t('common.loading')}
      </div>
    );
  }

  if (!order) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-cream-100 px-5 pb-16 pt-32">
        <div className="max-w-lg rounded-[2rem] border border-jade-900/10 bg-cream-50 p-8 text-center shadow-soft">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-jade-900/25 text-jade-700">
            <ReceiptText className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-medium text-jade-900">{t('success.notFoundTitle')}</h1>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{t('success.notFoundText')}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/rutas" className="btn btn-primary">
              {t('success.cta')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link href="/contacto" className="btn btn-outline">
              {t('success.contact')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-jade-950 pb-16 pt-32 text-cream-100 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(234,182,76,0.2),transparent_38%),radial-gradient(circle_at_85%_80%,rgba(200,90,58,0.18),transparent_40%)]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full border border-maize-400/20" />
        <div className="pointer-events-none absolute left-1/2 top-28 h-52 w-52 -translate-x-1/2 rounded-full border border-cream-100/10" />

        <div className="container-tgv relative text-center">
          <span className="animate-rise mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-maize-400/40 bg-maize-400/15 text-maize-300 backdrop-blur">
            <Check className="h-9 w-9" strokeWidth={2.2} />
          </span>
          <p className="eyebrow eyebrow-light mt-7 justify-center">{t('success.eyebrow')}</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.05em] text-cream-50">
            {t('success.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[0.96rem] leading-relaxed text-cream-100/75">
            {t('success.message')}
          </p>

          <div className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-cream-100/15 bg-cream-100/[0.06] px-4 py-4 backdrop-blur-sm">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-cream-100/50">
                {t('success.order')}
              </p>
              <p className="mt-1.5 break-all text-[0.78rem] font-bold text-cream-50">{order.orderId}</p>
            </div>
            <div className="rounded-2xl border border-cream-100/15 bg-cream-100/[0.06] px-4 py-4 backdrop-blur-sm">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-cream-100/50">
                {t('success.total')}
              </p>
              <p className="mt-1.5 font-display text-xl font-medium text-maize-300">
                {formatPrice(order.total, locale)}
              </p>
            </div>
            <div className="rounded-2xl border border-cream-100/15 bg-cream-100/[0.06] px-4 py-4 backdrop-blur-sm">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-cream-100/50">
                {t('success.orderDate')}
              </p>
              <p className="mt-1.5 text-[0.78rem] font-bold text-cream-50">{formatDate(order.date, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-jade-900/10 pb-5">
              <h2 className="font-display text-2xl font-medium text-jade-900">{t('success.summaryTitle')}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-500/12 px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-jade-700">
                <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                {t('success.eyebrow')}
              </span>
            </div>

            <ul className="mt-5 divide-y divide-jade-900/10">
              {order.items.map((item, index) => (
                <li key={`${item.title}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.86rem] font-bold leading-snug text-jade-900">{item.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.66rem] text-muted">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-clay-500" strokeWidth={1.8} />
                        {formatDate(item.date, locale)}
                      </span>
                      <span>
                        {item.quantity}{' '}
                        {item.quantity === 1 ? t('product.adultSuffix') : t('product.adultsSuffix')}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-clay-500" strokeWidth={1.8} />
                        {item.state}
                      </span>
                    </div>
                  </div>
                  <p className="shrink-0 text-[0.82rem] font-bold text-jade-900">
                    {formatPrice(item.price * item.quantity, locale)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-jade-900/10 pt-4">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-jade-900">
                {t('success.total')}
              </span>
              <span className="font-display text-2xl font-medium text-jade-900">
                {formatPrice(order.total, locale)}
              </span>
            </div>

            {order.transactionId && (
              <p className="mt-3 text-[0.66rem] text-muted">
                {t('success.transaction')}: <span className="font-semibold text-jade-900">{order.transactionId}</span>
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-jade-900/10 bg-jade-900 p-6 text-cream-100 md:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maize-400 text-jade-950">
                <Mail className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-2xl font-medium">{t('success.emailTitle')}</h3>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-cream-100/70">{t('success.emailNote')}</p>
              <a
                href={`mailto:${order.customer.email}`}
                className="mt-4 inline-flex items-center gap-2 break-all text-[0.72rem] font-bold text-maize-300 hover:text-maize-200"
              >
                {order.customer.email}
              </a>
            </div>

            <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 text-center">
              <p className="script text-[1.5rem] leading-tight text-clay-600">{t('success.help')}</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/contacto" className="btn btn-primary w-full">
                  {t('success.contact')}
                  <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                </Link>
                <Link href="/rutas" className="btn btn-outline w-full">
                  {t('success.cta')}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
