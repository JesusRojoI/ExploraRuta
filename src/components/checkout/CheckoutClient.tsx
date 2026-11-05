'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CreditCard,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';
import {
  getCountryOptions,
  getMexicanStateName,
  getMexicanStateOptions,
} from '@/lib/address-options';
import { formatDate, formatPrice } from '@/lib/utils';
import type { OrderSummary } from '@/types';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company: string;
  cardNumber: string;
  cardName: string;
  month: string;
  year: string;
  cvv: string;
};

const REQUIRED: (keyof FormState)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postalCode',
  'country',
  'cardNumber',
  'cardName',
  'month',
  'year',
  'cvv',
];

function onlyDigits(value: string, max: number) {
  return value.replace(/\D/g, '').slice(0, max);
}

function formatCardNumber(value: string) {
  return onlyDigits(value, 16).replace(/(.{4})/g, '$1 ').trim();
}

/** Octano expects a two-digit expiration year. */
function twoDigitYear(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 2 ? digits.slice(-2) : digits.padStart(2, '0');
}

export function CheckoutClient() {
  const router = useRouter();
  const { locale, t } = useLanguage();
  const { items, subtotal: total, getSubtotal, getTaxIncluded, clearCart } = useCart();
  const countryOptions = getCountryOptions(locale);
  const stateOptions = getMexicanStateOptions(locale);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: 'CMX',
    postalCode: '',
    country: 'MX',
    company: '',
    cardNumber: '',
    cardName: '',
    month: '',
    year: '',
    cvv: '',
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'processing'>('idle');
  const [serverError, setServerError] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<'invalid' | 'required' | ''>('');

  useEffect(() => setMounted(true), []);

  const tax = getTaxIncluded();
  const subtotal = getSubtotal();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  const lineItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          return product ? { ...item, product } : null;
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [items]
  );

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: false }));
    setServerError('');
  };

  const applyCoupon = () => {
    setCouponError(couponCode.trim() ? 'invalid' : 'required');
  };

  const validate = () => {
    const next: Record<string, boolean> = {};
    REQUIRED.forEach((key) => {
      if (!form[key].trim()) next[key] = true;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = true;
    if (form.cardNumber && onlyDigits(form.cardNumber, 16).length < 15) next.cardNumber = true;
    if (form.cvv && onlyDigits(form.cvv, 4).length < 3) next.cvv = true;
    if (form.month) {
      const month = Number(form.month);
      if (!Number.isInteger(month) || month < 1 || month > 12) next.month = true;
    }
    if (form.year) {
      const year = form.year.length === 2 ? `20${form.year}` : form.year;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expiration = new Date(Number(year), Number(form.month || 1));
      if (Number.isNaN(expiration.getTime()) || expiration < new Date(currentYear, currentMonth - 1)) {
        next.year = true;
      }
    }
    if (!terms) next.terms = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || items.length === 0) return;

    setStatus('processing');
    setServerError('');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          items,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            address2: form.address2,
            city: form.city,
            state: getMexicanStateName(form.state, locale),
            postalCode: form.postalCode,
            country: form.country,
            company: form.company,
          },
          card: {
            number: onlyDigits(form.cardNumber, 16),
            name: form.cardName,
            month: onlyDigits(form.month, 2),
            year: twoDigitYear(form.year),
            cvv: onlyDigits(form.cvv, 4),
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.success) {
        if (payload.code === 'not_configured') {
          setServerError(t('checkout.paymentNotConfigured'));
        } else {
          setServerError(payload.message || t('checkout.errorGeneric'));
        }
        setStatus('idle');
        return;
      }

      const summary: OrderSummary = {
        orderId: payload.orderId,
        transactionId: payload.transactionId,
        total: payload.total,
        date: new Date().toISOString().slice(0, 10),
        customer: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
        },
        items: lineItems.map(({ product, quantity, date }) => ({
          title: product.title[locale],
          quantity,
          price: product.price,
          date,
          image: product.image,
          state: product.state[locale],
        })),
      };

      localStorage.setItem('exploraruta-last-order', JSON.stringify(summary));
      clearCart();
      router.push(`/compra-exitosa?order=${encodeURIComponent(payload.orderId)}`);
    } catch {
      setServerError(t('checkout.errorGeneric'));
      setStatus('idle');
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-32 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted">
        {t('common.loading')}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-cream-100 px-5 pt-28 pb-16">
        <div className="max-w-lg rounded-[2rem] border border-jade-900/10 bg-cream-50 p-8 text-center shadow-soft">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-jade-900/25 text-jade-700">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.4} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-medium text-jade-900">{t('cart.emptyTitle')}</h1>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{t('checkout.empty')}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/rutas" className="btn btn-primary">
              {t('cart.emptyCta')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link href="/carrito" className="btn btn-outline">
              {t('checkout.backToCart')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const fieldClass = (key: string) => `input ${errors[key] ? 'input-error' : ''}`;

  return (
    <>
      <section className="bg-jade-950 pb-12 pt-32 text-cream-100 md:pb-16 md:pt-40">
        <div className="container-tgv">
          <Link
            href="/carrito"
            className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-cream-100/60 transition-colors hover:text-maize-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.9} />
            {t('checkout.backToCart')}
          </Link>
          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow eyebrow-light">{t('checkout.eyebrow')}</p>
              <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-medium leading-none tracking-[-0.045em] text-cream-50">
                {t('checkout.title')}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-cream-100/70">
                {t('checkout.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft md:p-8">
                <div className="flex items-center gap-3 border-b border-jade-900/10 pb-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jade-900 text-cream-100">
                    <span className="font-display text-sm">01</span>
                  </span>
                  <h2 className="font-display text-2xl font-medium text-jade-900">{t('checkout.customerTitle')}</h2>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="label">
                      {t('checkout.firstName')}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(event) => update('firstName', event.target.value)}
                      className={fieldClass('firstName')}
                      aria-invalid={errors.firstName}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label">
                      {t('checkout.lastName')}
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => update('lastName', event.target.value)}
                      className={fieldClass('lastName')}
                      aria-invalid={errors.lastName}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      {t('checkout.email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => update('email', event.target.value)}
                      className={fieldClass('email')}
                      aria-invalid={errors.email}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">
                      {t('checkout.phone')}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      className={fieldClass('phone')}
                      aria-invalid={errors.phone}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="label">
                      {t('checkout.address')}
                    </label>
                    <input
                      id="address"
                      type="text"
                      autoComplete="address-line1"
                      value={form.address}
                      onChange={(event) => update('address', event.target.value)}
                      className={fieldClass('address')}
                      aria-invalid={errors.address}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address2" className="label">
                      {t('checkout.address2')}{' '}
                      <span className="font-medium normal-case tracking-normal text-muted/60">
                        ({t('common.optional')})
                      </span>
                    </label>
                    <input
                      id="address2"
                      type="text"
                      autoComplete="address-line2"
                      value={form.address2}
                      onChange={(event) => update('address2', event.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="label">
                      {t('checkout.city')}
                    </label>
                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(event) => update('city', event.target.value)}
                      className={fieldClass('city')}
                      aria-invalid={errors.city}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="label">
                      {t('checkout.state')}
                    </label>
                    <select
                      id="state"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={(event) => update('state', event.target.value)}
                      className={`${fieldClass('state')} select`}
                      aria-invalid={errors.state}
                      required
                    >
                      {stateOptions.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="label">
                      {t('checkout.postalCode')}
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      autoComplete="postal-code"
                      value={form.postalCode}
                      onChange={(event) => update('postalCode', event.target.value)}
                      className={fieldClass('postalCode')}
                      aria-invalid={errors.postalCode}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="label">
                      {t('checkout.country')}
                    </label>
                    <select
                      id="country"
                      autoComplete="country-name"
                      value={form.country}
                      onChange={(event) => update('country', event.target.value)}
                      className={`${fieldClass('country')} select`}
                      aria-invalid={errors.country}
                      required
                    >
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className="label">
                      {t('checkout.company')}{' '}
                      <span className="font-medium normal-case tracking-normal text-muted/60">
                        ({t('common.optional')})
                      </span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(event) => update('company', event.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft md:p-8">
                <div className="flex items-center justify-between gap-3 border-b border-jade-900/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jade-900 text-cream-100">
                      <CreditCard className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <h2 className="font-display text-2xl font-medium text-jade-900">{t('checkout.cardTitle')}</h2>
                  </div>
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
                    <span className="flex h-7 items-center justify-center rounded border border-jade-900/10 bg-white px-2">
                      <Image src="/octano.png" alt="Octano" width={70} height={20} className="h-4 w-auto" />
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className="label">
                      {t('checkout.cardNumber')}
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      value={form.cardNumber}
                      onChange={(event) => update('cardNumber', formatCardNumber(event.target.value))}
                      className={`${fieldClass('cardNumber')} tracking-[0.08em]`}
                      aria-invalid={errors.cardNumber}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cardName" className="label">
                      {t('checkout.cardName')}
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      autoComplete="cc-name"
                      value={form.cardName}
                      onChange={(event) => update('cardName', event.target.value)}
                      className={fieldClass('cardName')}
                      aria-invalid={errors.cardName}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="month" className="label">
                      {t('checkout.month')}
                    </label>
                    <input
                      id="month"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp-month"
                      placeholder="MM"
                      maxLength={2}
                      value={form.month}
                      onChange={(event) => update('month', onlyDigits(event.target.value, 2))}
                      className={fieldClass('month')}
                      aria-invalid={errors.month}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="year" className="label">
                        {t('checkout.year')}
                      </label>
                      <input
                        id="year"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        placeholder="AA"
                        maxLength={4}
                        value={form.year}
                        onChange={(event) => update('year', onlyDigits(event.target.value, 4))}
                        className={fieldClass('year')}
                        aria-invalid={errors.year}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="label">
                        {t('checkout.cvv')}
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVV"
                        maxLength={4}
                        value={form.cvv}
                        onChange={(event) => update('cvv', onlyDigits(event.target.value, 4))}
                        className={fieldClass('cvv')}
                        aria-invalid={errors.cvv}
                        required
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <label
                  htmlFor="terms"
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                    errors.terms ? 'border-clay-500/40 bg-clay-50' : 'border-jade-900/10 bg-cream-50'
                  }`}
                >
                  <input
                    id="terms"
                    type="checkbox"
                    checked={terms}
                    onChange={(event) => {
                      setTerms(event.target.checked);
                      setErrors((current) => ({ ...current, terms: false }));
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3A32]"
                  />
                  <span className="text-[0.78rem] leading-relaxed text-muted">
                    {t('checkout.terms')}{' '}
                    <Link href="/terminos-y-condiciones" className="font-semibold text-jade-900 underline underline-offset-2">
                      {t('checkout.termsLink')}
                    </Link>{' '}
                    {t('checkout.termsConjunction')}{' '}
                    <Link href="/politica-privacidad" className="font-semibold text-jade-900 underline underline-offset-2">
                      {t('checkout.privacyLink')}
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-2 text-[0.68rem] font-semibold text-clay-600">{t('common.required')}</p>
                )}
              </div>

              {serverError && (
                <div className="animate-rise flex items-start gap-3 rounded-2xl border border-clay-500/25 bg-clay-50 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay-600" strokeWidth={1.9} />
                  <div>
                    <p className="text-[0.8rem] font-bold text-clay-700">{t('checkout.errorTitle')}</p>
                    <p className="mt-1 text-[0.74rem] leading-relaxed text-clay-700/85">{serverError}</p>
                  </div>
                </div>
              )}

              <p className="text-[0.68rem] leading-relaxed text-muted/70">{t('checkout.requiredNote')}</p>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft">
                <h2 className="font-display text-2xl font-medium text-jade-900">{t('checkout.summaryTitle')}</h2>
                <p className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-muted/70">
                  {count} {count === 1 ? t('product.adultSuffix') : t('product.adultsSuffix')} · {items.length}{' '}
                  {items.length === 1 ? t('common.experience') : t('common.experiences')}
                </p>

                <div className="mt-5 rounded-xl border border-jade-900/10 bg-cream-100/70 p-4">
                  <button
                    type="button"
                    aria-expanded={couponOpen}
                    aria-controls="checkout-coupon-panel"
                    onClick={() => setCouponOpen((open) => !open)}
                    className="flex w-full items-center justify-between gap-3 text-left text-[0.72rem] font-semibold text-jade-900 transition-colors hover:text-clay-600"
                  >
                    <span>{t('checkout.couponPrompt')}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${couponOpen ? 'rotate-180' : ''}`}
                      strokeWidth={1.8}
                    />
                  </button>
                  {couponOpen && (
                    <div id="checkout-coupon-panel" className="mt-4">
                      <label htmlFor="checkout-coupon" className="label">
                        {t('checkout.couponLabel')}
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          id="checkout-coupon"
                          type="text"
                          autoComplete="off"
                          value={couponCode}
                          onChange={(event) => {
                            setCouponCode(event.target.value);
                            setCouponError('');
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              applyCoupon();
                            }
                          }}
                          className="input min-w-0 flex-1"
                          aria-invalid={Boolean(couponError)}
                          aria-describedby={couponError ? 'checkout-coupon-error' : undefined}
                        />
                        <button type="button" onClick={applyCoupon} className="btn btn-outline">
                          {t('checkout.couponApply')}
                        </button>
                      </div>
                      {couponError && (
                        <p
                          id="checkout-coupon-error"
                          role="alert"
                          className="mt-2 text-[0.68rem] font-semibold text-clay-600"
                        >
                          {t(couponError === 'invalid' ? 'checkout.couponInvalid' : 'checkout.couponRequired')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <ul className="mt-5 space-y-3">
                  {lineItems.map(({ product, quantity, date }) => (
                    <li key={`${product.slug}-${date}`} className="flex gap-3">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={product.image}
                          alt={product.title[locale]}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[0.74rem] font-bold leading-snug text-jade-900">
                          {product.title[locale]}
                        </p>
                        <p className="mt-0.5 text-[0.62rem] text-muted">
                          {formatDate(date, locale)} · {quantity}{' '}
                          {quantity === 1 ? t('product.adultSuffix') : t('product.adultsSuffix')}
                        </p>
                      </div>
                      <p className="shrink-0 text-[0.72rem] font-bold text-jade-900">
                        {formatPrice(product.price * quantity, locale)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 space-y-2.5 border-t border-jade-900/10 pt-4 text-[0.78rem]">
                  <div className="flex items-center justify-between text-muted">
                    <dt>{t('checkout.subtotal')}</dt>
                    <dd className="font-semibold text-jade-900">{formatPrice(subtotal, locale)}</dd>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <dt>{t('cart.taxIncluded')}</dt>
                    <dd className="font-semibold text-jade-900">{formatPrice(tax, locale)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-jade-900/10 pt-3">
                    <dt className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-jade-900">
                      {t('checkout.total')}
                    </dt>
                    <dd className="font-display text-2xl font-medium text-jade-900">
                      {formatPrice(total, locale)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-[0.62rem] leading-relaxed text-muted/75">{t('checkout.summaryNote')}</p>

                <button type="submit" disabled={status === 'processing'} className="btn btn-clay mt-5 w-full">
                  {status === 'processing' ? (
                    <>
                      {t('checkout.processing')}
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.9} />
                    </>
                  ) : (
                    <>
                      {t('checkout.pay')}
                      <LockKeyhole className="h-4 w-4" strokeWidth={1.9} />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 border-t border-jade-900/10 pt-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-jade-600" strokeWidth={1.8} />
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-muted/75">
                    {t('checkout.acceptedCards')}
                  </span>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}
