import { NextResponse } from 'next/server';
import { sendContactEmails } from '@/lib/email';
import type { Locale } from '@/types';

export const runtime = 'nodejs';

const MAX_LENGTH = { name: 120, email: 180, phone: 40, interest: 120, message: 5000 };

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    }

    const name = clean(body.name, MAX_LENGTH.name);
    const email = clean(body.email, MAX_LENGTH.email);
    const phone = clean(body.phone, MAX_LENGTH.phone);
    const interest = clean(body.interest, MAX_LENGTH.interest);
    const message = clean(body.message, MAX_LENGTH.message);
    const locale: Locale = body.locale === 'en' ? 'en' : 'es';

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 422 });
    }

    const result = await sendContactEmails({ name, email, phone, interest, message, locale });

    if (result.skipped) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, code: 'email_not_configured', message: 'Email service is not configured.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!result.ok) {
      if (result.stored) {
        // The message could not reach the provider but is safely queued on disk.
        return NextResponse.json({ success: true, delivery: 'stored' });
      }
      return NextResponse.json({ success: false, message: 'Email delivery failed.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, delivery: 'sent' });
  } catch (error) {
    console.error('[api/send-email]', error);
    return NextResponse.json({ success: false, message: 'Unexpected error.' }, { status: 500 });
  }
}
