import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Resend } from 'resend';
import esMessages from '../../messages/es.json';
import enMessages from '../../messages/en.json';
import type { Locale, OrderSummary } from '@/types';

const messagesMap = { es: esMessages, en: enMessages };
const BRAND = 'ExploraRuta';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploraruta.com.mx';
const FROM = process.env.EMAIL_FROM || 'soluciones@axbyte.com.mx';

type OutgoingEmail = {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Resend keys start with `re_`; Emailit keys start with `e_`. Both providers
 * accept the same basic payload, so we pick the transport from the key shape.
 */
function emailCredentials() {
  const resend = process.env.RESEND_API_KEY?.trim() || '';
  const emailit = process.env.EMAILIT_API_KEY?.trim() || '';

  if (emailit) return { provider: 'emailit' as const, apiKey: emailit };
  if (resend.startsWith('re_')) return { provider: 'resend' as const, apiKey: resend };
  if (resend.startsWith('e_')) return { provider: 'emailit' as const, apiKey: resend };
  if (resend) return { provider: 'resend' as const, apiKey: resend };
  return null;
}

export function isEmailConfigured() {
  return emailCredentials() !== null;
}

async function sendWithResend(apiKey: string, email: OutgoingEmail) {
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: email.from,
    to: email.to,
    subject: email.subject,
    html: email.html,
    replyTo: email.replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

async function sendWithEmailit(apiKey: string, email: OutgoingEmail) {
  const response = await fetch('https://api.emailit.com/v2/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Emailit ${response.status}: ${detail.slice(0, 300)}`);
  }
}

async function deliver(email: OutgoingEmail) {
  const credentials = emailCredentials();
  if (!credentials) throw new Error('No email provider is configured.');

  if (credentials.provider === 'emailit') {
    await sendWithEmailit(credentials.apiKey, email);
    return;
  }
  await sendWithResend(credentials.apiKey, email);
}

export type DeliveryResult = { sent: boolean; stored: boolean; error?: unknown };

const OUTBOX_DIR =
  process.env.EMAIL_OUTBOX_DIR?.trim() || path.join(process.cwd(), '.mail-outbox');

/** Turns a provider error into a short, actionable hint. */
export function emailErrorHint(error: unknown) {
  const detail = error instanceof Error ? error.message : String(error ?? '');
  if (/401|invalid api key|unauthorized/i.test(detail)) {
    return 'La API key fue rechazada: revisa RESEND_API_KEY/EMAILIT_API_KEY en .env.';
  }
  if (/403|not verified|domain/i.test(detail)) {
    return 'El remitente no está verificado en el proveedor: verifica el dominio de EMAIL_FROM.';
  }
  if (/429|rate limit/i.test(detail)) {
    return 'El proveedor limitó los envíos temporalmente; espera un momento y reintenta.';
  }
  return '';
}

/**
 * On failure the message is written to `.mail-outbox/` so a contact enquiry or
 * a purchase receipt is never lost while the provider key or sender domain is
 * being fixed. The checkout keeps working and the contact form reports success.
 */
async function saveToOutbox(email: OutgoingEmail, error: unknown) {
  try {
    await mkdir(OUTBOX_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTo = email.to.replace(/[^a-zA-Z0-9@._-]/g, '_').slice(0, 80);
    const file = path.join(OUTBOX_DIR, `${stamp}-${safeTo}.json`);
    await writeFile(
      file,
      JSON.stringify(
        {
          savedAt: new Date().toISOString(),
          providerError: error instanceof Error ? error.message : String(error ?? ''),
          ...email,
        },
        null,
        2
      ),
      'utf8'
    );
    return file;
  } catch (fsError) {
    console.error('[email] could not write to outbox:', fsError);
    return null;
  }
}

async function deliverSafely(email: OutgoingEmail): Promise<DeliveryResult> {
  try {
    await deliver(email);
    return { sent: true, stored: false };
  } catch (error) {
    const hint = emailErrorHint(error);
    console.error(`[email] send to ${email.to} failed${hint ? ` — ${hint}` : ''}`, error);
    const stored = await saveToOutbox(email, error);
    if (stored) console.warn(`[email] message saved to outbox: ${stored}`);
    return { sent: false, stored: Boolean(stored), error };
  }
}

const palette = {
  jade: '#1E3A32',
  jadeDeep: '#142B25',
  clay: '#B86542',
  maize: '#EFD7A1',
  cream: '#FFFDF8',
  paper: '#FBF7EF',
  ink: '#26322E',
  muted: '#6E746D',
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  locale: Locale;
}

function escapeHtml(value: string | number | undefined | null) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function currency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);
}

function longDate(value: string, locale: Locale) {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function shell({
  title,
  preheader,
  body,
  locale,
}: {
  title: string;
  preheader: string;
  body: string;
  locale: Locale;
}) {
  const m = messagesMap[locale].emails;

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${palette.paper};font-family:Georgia,'Times New Roman',serif;color:${palette.ink};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${palette.paper};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid rgba(12,59,53,0.14);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:${palette.jade};padding:26px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${palette.maize};">${escapeHtml(m.brand)}</p>
                <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;line-height:1.1;color:${palette.cream};">${escapeHtml(title)}</p>
                <div style="margin-top:14px;height:2px;width:54px;background:${palette.maize};"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${palette.ink};">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="background:${palette.cream};border-top:1px solid rgba(12,59,53,0.1);padding:22px 32px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:${palette.muted};">
                <p style="margin:0;">${escapeHtml(m.footer)}</p>
                <p style="margin:6px 0 0;"><a href="${escapeHtml(SITE_URL)}" style="color:${palette.clay};text-decoration:none;">exploraruta.com.mx</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function contactRows(payload: ContactEmailPayload, locale: Locale) {
  const c = messagesMap[locale].emails.contact;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${[
        [c.name, payload.name],
        [c.email, payload.email],
        [c.phone, payload.phone || '—'],
        [c.interest, payload.interest || '—'],
      ]
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:9px 0;border-bottom:1px solid rgba(12,59,53,0.1);width:38%;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};">${escapeHtml(label)}</td>
          <td style="padding:9px 0;border-bottom:1px solid rgba(12,59,53,0.1);color:${palette.ink};font-weight:bold;">${escapeHtml(value)}</td>
        </tr>`
        )
        .join('')}
    </table>
    <p style="margin:20px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};">${escapeHtml(c.message)}</p>
    <div style="background:${palette.cream};border-left:3px solid ${palette.maize};border-radius:0 10px 10px 0;padding:14px 16px;white-space:pre-wrap;color:${palette.ink};">${escapeHtml(payload.message)}</div>`;
}

export async function sendContactEmails(payload: ContactEmailPayload) {
  const m = messagesMap[payload.locale].emails.contact;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!isEmailConfigured()) {
    console.warn('[email] No email provider key is configured; contact email skipped.');
    return { ok: false, skipped: true as const };
  }

  const adminHtml = shell({
    title: m.adminTitle,
    preheader: `${payload.name} · ${payload.email}`,
    locale: payload.locale,
    body: contactRows(payload, payload.locale),
  });

  const clientHtml = shell({
    title: m.clientTitle,
    preheader: m.clientIntro,
    locale: payload.locale,
    body: `
      <p style="margin:0 0 14px;">${escapeHtml(
        payload.locale === 'es' ? `Hola ${payload.name},` : `Hello ${payload.name},`
      )}</p>
      <p style="margin:0 0 14px;">${escapeHtml(m.clientIntro)}</p>
      <p style="margin:0 0 14px;color:${palette.muted};">${escapeHtml(m.clientOutro)}</p>
      <div style="margin-top:22px;">
        <a href="${escapeHtml(SITE_URL)}/rutas" style="display:inline-block;background:${palette.jade};color:${palette.cream};text-decoration:none;padding:12px 22px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${
          payload.locale === 'es' ? 'Ver rutas' : 'View routes'
        }</a>
      </div>`,
  });

  const tasks: Promise<DeliveryResult>[] = [
    deliverSafely({
      from: FROM,
      to: payload.email,
      subject: m.clientSubject,
      html: clientHtml,
      replyTo: adminEmail || undefined,
    }),
  ];

  if (adminEmail) {
    tasks.push(
      deliverSafely({
        from: FROM,
        to: adminEmail,
        subject: m.adminSubject,
        html: adminHtml,
        replyTo: payload.email,
      })
    );
  }

  const results = await Promise.all(tasks);
  const delivered = results.some((result) => result.sent);
  const stored = results.some((result) => result.stored);

  return { ok: delivered, stored, skipped: false as const };
}

function orderRows(order: OrderSummary, locale: Locale) {
  const p = messagesMap[locale].emails.purchase;
  return order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid rgba(12,59,53,0.1);vertical-align:top;">
          <p style="margin:0;font-weight:bold;color:${palette.jade};">${escapeHtml(item.title)}</p>
          <p style="margin:4px 0 0;font-size:12px;color:${palette.muted};">${escapeHtml(
            longDate(item.date, locale)
          )} · ${item.quantity} ${escapeHtml(p.travelers)}</p>
        </td>
        <td style="padding:11px 0;border-bottom:1px solid rgba(12,59,53,0.1);text-align:right;white-space:nowrap;vertical-align:top;color:${palette.jade};font-weight:bold;">
          ${escapeHtml(currency(item.price * item.quantity, locale))}
        </td>
      </tr>`
    )
    .join('');
}

function orderTotals(order: OrderSummary, locale: Locale) {
  const p = messagesMap[locale].emails.purchase;
  const included = order.total - order.total / 1.16;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;background:${palette.cream};border-radius:12px;padding:4px;">
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:${palette.muted};">${escapeHtml(p.subtotal)}</td>
        <td style="padding:10px 14px;text-align:right;font-size:13px;color:${palette.ink};">${escapeHtml(currency(order.total, locale))}</td>
      </tr>
      <tr>
        <td style="padding:0 14px 10px;font-size:13px;color:${palette.muted};">${escapeHtml(p.tax)}</td>
        <td style="padding:0 14px 10px;text-align:right;font-size:13px;color:${palette.ink};">${escapeHtml(currency(included, locale))}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border-top:1px solid rgba(12,59,53,0.14);font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;color:${palette.jade};">${escapeHtml(p.total)}</td>
        <td style="padding:10px 14px;border-top:1px solid rgba(12,59,53,0.14);text-align:right;font-size:20px;font-weight:bold;color:${palette.jade};">${escapeHtml(currency(order.total, locale))} MXN</td>
      </tr>
    </table>`;
}

export async function sendPurchaseEmails(order: OrderSummary, locale: Locale) {
  const p = messagesMap[locale].emails.purchase;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!isEmailConfigured()) {
    console.warn('[email] No email provider key is configured; purchase email skipped.');
    return { ok: false, skipped: true as const };
  }

  const clientSubject = p.clientSubject;
  const adminSubject = p.adminSubject.replace('{name}', order.customer.name);

  const detailBody = `
    <p style="margin:0 0 14px;">${escapeHtml(
      locale === 'es' ? `Hola ${order.customer.name},` : `Hello ${order.customer.name},`
    )}</p>
    <p style="margin:0 0 6px;">${escapeHtml(p.clientIntro)}</p>
    <p style="margin:0 0 18px;font-size:12px;color:${palette.muted};">${escapeHtml(p.order)}: <strong style="color:${palette.jade};">${escapeHtml(
      order.orderId
    )}</strong></p>
    <h2 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;color:${palette.jade};">${escapeHtml(
      p.summary
    )}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${orderRows(order, locale)}
    </table>
    ${orderTotals(order, locale)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;font-size:12px;color:${palette.muted};">
      <tr>
        <td style="padding:4px 0;">${escapeHtml(p.customer)}</td>
        <td style="padding:4px 0;text-align:right;color:${palette.ink};">${escapeHtml(order.customer.name)} · ${escapeHtml(
          order.customer.email
        )}</td>
      </tr>
      ${
        order.transactionId
          ? `<tr><td style="padding:4px 0;">${escapeHtml(p.transaction)}</td><td style="padding:4px 0;text-align:right;color:${palette.ink};">${escapeHtml(
              order.transactionId
            )}</td></tr>`
          : ''
      }
      <tr>
        <td style="padding:4px 0;">${escapeHtml(p.date)}</td>
        <td style="padding:4px 0;text-align:right;color:${palette.ink};">${escapeHtml(longDate(order.date, locale))}</td>
      </tr>
    </table>
    <p style="margin:22px 0 0;">${escapeHtml(p.thankYou)} <strong>${escapeHtml(BRAND)}</strong>.</p>
    <p style="margin:8px 0 0;color:${palette.muted};">${escapeHtml(p.questions)}</p>`;

  const clientHtml = shell({
    title: p.clientTitle,
    preheader: p.clientIntro,
    locale,
    body: detailBody,
  });

  const adminHtml = shell({
    title: p.adminTitle,
    preheader: `${order.customer.name} · ${currency(order.total, locale)}`,
    locale,
    body: detailBody,
  });

  const tasks: Promise<DeliveryResult>[] = [
    deliverSafely({
      from: FROM,
      to: order.customer.email,
      subject: clientSubject,
      html: clientHtml,
      replyTo: adminEmail || undefined,
    }),
  ];

  if (adminEmail) {
    tasks.push(
      deliverSafely({
        from: FROM,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
        replyTo: order.customer.email,
      })
    );
  }

  const results = await Promise.all(tasks);
  const delivered = results.some((result) => result.sent);
  const stored = results.some((result) => result.stored);

  return { ok: delivered, stored, skipped: false as const };
}
