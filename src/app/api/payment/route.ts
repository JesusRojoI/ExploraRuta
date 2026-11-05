import { NextResponse } from 'next/server';
import { processOctanoPayment, isOctanoConfigured } from '@/lib/octano';
import { sendPurchaseEmails } from '@/lib/email';
import { generateOrderId, todayISO } from '@/lib/utils';
import { products } from '@/data/products';
import type { Locale, OrderSummary } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IncomingItem = { slug?: unknown; quantity?: unknown; date?: unknown };

function text(value: unknown, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const MAX_TRAVELERS_PER_LINE = 20;

/**
 * Accepts `YYYY-MM-DD` as well as a full ISO timestamp. Older carts may have
 * stored a timestamp instead of a plain date, which used to make the whole
 * checkout fail with "Invalid cart item".
 */
function normalizeDate(value: string) {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return '';
  const date = new Date(`${match[1]}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return match[1];
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return value >= todayISO();
}

function message(
  locale: Locale,
  key: 'cart' | 'item' | 'total' | 'data' | 'auth' | 'token' | 'declined'
) {
  const messages = {
    cart: {
      es: 'Tu carrito está vacío o no es válido.',
      en: 'Your cart is empty or invalid.',
    },
    item: {
      es: 'Una experiencia de tu carrito ya no está disponible o su fecha ya pasó. Vuelve al carrito, actualízala y prueba de nuevo.',
      en: 'An experience in your cart is no longer available or its date has passed. Go back to the cart, update it and try again.',
    },
    total: {
      es: 'No pudimos calcular el total de tu reserva.',
      en: 'We could not calculate your booking total.',
    },
    data: {
      es: 'Revisa los datos del viajero y de la tarjeta.',
      en: 'Please review the traveller and card details.',
    },
    auth: {
      es: 'La pasarela de pago no está disponible en este momento. Intenta de nuevo en unos minutos.',
      en: 'The payment gateway is unavailable right now. Please try again in a few minutes.',
    },
    token: {
      es: 'No pudimos validar los datos de la tarjeta. Revísalos e intenta de nuevo.',
      en: 'We could not validate the card details. Please check them and try again.',
    },
    declined: {
      es: 'El banco no aprobó el cargo o no respondió a tiempo. Verifica los datos o usa otra tarjeta.',
      en: 'The bank did not approve the charge or did not respond in time. Check the details or use another card.',
    },
  } as const;
  return messages[key][locale];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    }

    const locale: Locale = body.locale === 'en' ? 'en' : 'es';
    const items = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];

    if (items.length === 0 || items.length > 20) {
      return NextResponse.json(
        { success: false, code: 'invalid_cart', message: message(locale, 'cart') },
        { status: 422 }
      );
    }

    const lines = [];
    for (const item of items) {
      const slug = text(item.slug, 120);
      const quantity = Number(item.quantity);
      const date = normalizeDate(text(item.date, 40));
      const product = products.find((entry) => entry.slug === slug);

      if (
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_TRAVELERS_PER_LINE ||
        !isValidDate(date)
      ) {
        return NextResponse.json(
          { success: false, code: 'invalid_item', message: message(locale, 'item') },
          { status: 422 }
        );
      }

      lines.push({ product, quantity, date });
    }

    const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { success: false, code: 'invalid_total', message: message(locale, 'total') },
        { status: 422 }
      );
    }

    const customerInput = (body.customer ?? {}) as Record<string, unknown>;
    const cardInput = (body.card ?? {}) as Record<string, unknown>;

    const customer = {
      firstName: text(customerInput.firstName, 80),
      lastName: text(customerInput.lastName, 80),
      email: text(customerInput.email, 180),
      phone: text(customerInput.phone, 40),
      address: text(customerInput.address, 200),
      address2: text(customerInput.address2, 200),
      city: text(customerInput.city, 100),
      state: text(customerInput.state, 100),
      postalCode: text(customerInput.postalCode, 20),
      country: text(customerInput.country, 80) || 'MX',
      company: text(customerInput.company, 120),
    };

    const card = {
      number: text(cardInput.number, 25).replace(/\D/g, ''),
      name: text(cardInput.name, 120),
      month: text(cardInput.month, 2).replace(/\D/g, ''),
      // Octano expects a two-digit expiration year (30, not 2030).
      year: text(cardInput.year, 4).replace(/\D/g, '').slice(-2),
      cvv: text(cardInput.cvv, 4).replace(/\D/g, ''),
    };

    const requiredCustomer = [
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      customer.state,
      customer.postalCode,
    ];

    if (
      requiredCustomer.some((value) => !value) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      card.number.length < 15 ||
      card.number.length > 19 ||
      !card.name ||
      !card.month ||
      !card.year ||
      card.cvv.length < 3
    ) {
      return NextResponse.json(
        { success: false, code: 'invalid_data', message: message(locale, 'data') },
        { status: 422 }
      );
    }

    if (!isOctanoConfigured()) {
      return NextResponse.json(
        {
          success: false,
          code: 'not_configured',
          message: 'Payment gateway is not configured.',
        },
        { status: 503 }
      );
    }

    const orderId = generateOrderId();
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';

    const result = await processOctanoPayment({
      amount: total,
      currency: 'MXN',
      orderId,
      description: `ExploraRuta ${orderId}`,
      card,
      customer,
      metadata: {
        ip,
        notes: lines.map((line) => `${line.product.slug} x${line.quantity} (${line.date})`).join(' | '),
      },
    });

    if (!result.success) {
      const key =
        result.error === 'auth_error' || result.error === 'not_configured'
          ? 'auth'
          : result.error === 'token_error'
            ? 'token'
            : 'declined';
      return NextResponse.json(
        {
          success: false,
          code: result.error || 'payment_error',
          message: message(locale, key),
        },
        { status: 402 }
      );
    }

    const summary: OrderSummary = {
      orderId,
      transactionId: result.transactionId,
      total,
      date: todayISO(),
      customer: {
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
      },
      items: lines.map(({ product, quantity, date }) => ({
        title: product.title[locale],
        quantity,
        price: product.price,
        date,
        image: product.image,
        state: product.state[locale],
      })),
    };

    try {
      await sendPurchaseEmails(summary, locale);
    } catch (emailError) {
      console.error('[api/payment] purchase email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      transactionId: result.transactionId,
      total,
      status: result.status,
    });
  } catch (error) {
    console.error('[api/payment]', error);
    return NextResponse.json(
      { success: false, code: 'payment_error', message: 'Unexpected error.' },
      { status: 500 }
    );
  }
}
