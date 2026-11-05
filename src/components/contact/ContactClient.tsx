'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock3, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/lib/site';

type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

const emptyForm: FormState = { name: '', email: '', phone: '', interest: '', message: '' };

export function ContactClient() {
  const { t, locale, messages } = useLanguage();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: false }));
  };

  const validate = () => {
    const next: Record<string, boolean> = {};
    if (!form.name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = true;
    if (!form.interest) next.interest = true;
    if (!form.message.trim()) next.message = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form, locale }),
      });

      if (!response.ok) throw new Error('send_failed');
      setStatus('success');
      setForm(emptyForm);
    } catch {
      setStatus('error');
    }
  };

  const contactCards = [
    {
      icon: Mail,
      label: t('contact.emailCard'),
      value: CONTACT_EMAIL,
      note: t('contact.emailNote'),
      href: `mailto:${CONTACT_EMAIL}`,
    },
    ...(CONTACT_PHONE_HREF
      ? [
          {
            icon: Phone,
            label: t('contact.phoneCard'),
            value: CONTACT_PHONE_DISPLAY,
            note: t('contact.phoneNote'),
            href: CONTACT_PHONE_HREF,
          },
        ]
      : []),
    {
      icon: MapPin,
      label: t('contact.coverageCard'),
      value: t('contact.coverageValue'),
      note: t('contact.coverageNote'),
      href: undefined,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-jade-950 pb-16 pt-32 text-cream-100 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(234,182,76,0.16),transparent_36%),radial-gradient(circle_at_12%_80%,rgba(200,90,58,0.18),transparent_40%)]" />
        <div className="pointer-events-none absolute -right-28 top-6 h-80 w-80 rounded-full border border-cream-100/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full border border-maize-400/15" />

        <div className="container-tgv relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="eyebrow eyebrow-light animate-fade-up">{t('contact.eyebrow')}</p>
            <h1 className="mt-5 max-w-2xl font-display text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.93] tracking-[-0.05em] text-cream-50">
              {t('contact.title')}
            </h1>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-cream-100/75">
              {t('contact.description')}
            </p>
            <p className="script mt-8 max-w-lg text-[1.7rem] leading-tight text-maize-300">
              {t('contact.quote')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:justify-self-end">
            {contactCards.map((card) => {
              const inner = (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/10 text-maize-300">
                    <card.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-cream-100/50">
                      {card.label}
                    </p>
                    <p className="mt-1 truncate text-[0.8rem] font-bold text-cream-50">{card.value}</p>
                    <p className="mt-0.5 text-[0.62rem] leading-relaxed text-cream-100/55">{card.note}</p>
                  </div>
                </>
              );

              return card.href ? (
                <a
                  key={card.label}
                  href={card.href}
                  className="flex items-start gap-3 rounded-2xl border border-cream-100/12 bg-cream-100/[0.05] p-4 transition-colors hover:border-maize-400/40 hover:bg-cream-100/[0.08]"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={card.label}
                  className="flex items-start gap-3 rounded-2xl border border-cream-100/12 bg-cream-100/[0.05] p-4"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{t('contact.formTitle')}</p>
              <h2 className="title-serif mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)] text-jade-900">
                {t('contact.formSubtitle')}
              </h2>

              <div className="mt-8 space-y-4 border-t border-jade-900/10 pt-6">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" strokeWidth={1.8} />
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-jade-900">
                      {t('contact.emailNote')}
                    </p>
                    <p className="mt-1 text-[0.8rem] text-muted">{t('topbar.hours')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" strokeWidth={1.8} />
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-jade-900">
                      {t('contact.coverageValue')}
                    </p>
                    <p className="mt-1 max-w-xs text-[0.8rem] leading-relaxed text-muted">
                      {t('contact.coverageNote')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-jade-900/10 bg-jade-900 p-6 text-cream-100">
                <p className="script text-[1.6rem] leading-tight text-maize-300">{t('contact.quote')}</p>
                <Link
                  href="/rutas"
                  className="mt-5 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream-100/75 transition-colors hover:text-maize-300"
                >
                  {t('contact.ctaButton')}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="rounded-[1.75rem] border border-jade-900/10 bg-cream-50 p-6 shadow-soft md:p-9">
              {status === 'success' ? (
                <div className="animate-rise py-10 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-jade-500/15 text-jade-700">
                    <CheckCircle2 className="h-7 w-7" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-medium text-jade-900">
                    {t('contact.successTitle')}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-muted">
                    {t('contact.successText')}
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/rutas" className="btn btn-primary">
                      {t('contact.ctaButton')}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
                    </Link>
                    <button type="button" onClick={() => setStatus('idle')} className="btn btn-outline">
                      {t('contact.formTitle')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="label">
                        {t('common.name')}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => update('name', event.target.value)}
                        className={`input ${errors.name ? 'input-error' : ''}`}
                        aria-invalid={errors.name}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-[0.68rem] font-semibold text-clay-600">{t('common.required')}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="label">
                        {t('common.email')}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        aria-invalid={errors.email}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[0.68rem] font-semibold text-clay-600">{t('common.required')}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className="label">
                        {t('common.phone')}{' '}
                        <span className="font-medium normal-case tracking-normal text-muted/60">
                          ({t('common.optional')})
                        </span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(event) => update('phone', event.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-interest" className="label">
                        {t('contact.interestLabel')}
                      </label>
                      <select
                        id="contact-interest"
                        value={form.interest}
                        onChange={(event) => update('interest', event.target.value)}
                        className={`select ${errors.interest ? 'input-error' : ''}`}
                        aria-invalid={errors.interest}
                        required
                      >
                        <option value="">{t('contact.interestPlaceholder')}</option>
                        {messages.contact.interestOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.interest && (
                        <p className="mt-1.5 text-[0.68rem] font-semibold text-clay-600">{t('common.required')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="label">
                      {t('contact.messageLabel')}
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(event) => update('message', event.target.value)}
                      placeholder={t('contact.messagePlaceholder')}
                      className={`textarea ${errors.message ? 'input-error' : ''}`}
                      aria-invalid={errors.message}
                      required
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-[0.68rem] font-semibold text-clay-600">{t('common.required')}</p>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="animate-rise rounded-xl border border-clay-500/25 bg-clay-50 px-4 py-3 text-[0.78rem] leading-relaxed text-clay-700">
                      {t('contact.error')}
                    </div>
                  )}

                  <div className="flex flex-col gap-4 border-t border-jade-900/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-[0.65rem] leading-relaxed text-muted/75">{t('contact.privacy')}</p>
                    <button type="submit" disabled={status === 'sending'} className="btn btn-clay shrink-0">
                      {status === 'sending' ? (
                        <>
                          {t('contact.sending')}
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.9} />
                        </>
                      ) : (
                        <>
                          {t('contact.submit')}
                          <Send className="h-4 w-4" strokeWidth={1.9} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-jade-900/10 bg-cream-200 py-14 md:py-16">
        <div className="container-tgv flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-medium text-jade-900 md:text-3xl">{t('contact.ctaTitle')}</h2>
            <p className="mt-2 max-w-xl text-[0.88rem] leading-relaxed text-muted">{t('contact.ctaText')}</p>
          </div>
          <Link href="/rutas" className="btn btn-primary shrink-0">
            {t('contact.ctaButton')}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>
      </section>
    </>
  );
}
