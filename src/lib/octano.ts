/**
 * Octano payment gateway (sandbox-friendly).
 *
 * Flow: signin -> card tokenizer -> sale.
 * Card data is used only on the server and is never logged or persisted.
 *
 * The expiration year is sent to Octano as two digits (e.g. 30), not 2030.
 */

export interface OctanoPaymentInput {
  amount: number;
  currency?: string;
  description?: string;
  orderId: string;
  card: {
    number: string;
    name: string;
    month: string;
    year: string;
    cvv: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    company?: string;
  };
  metadata?: {
    ip?: string;
    notes?: string;
  };
}

export interface OctanoPaymentResult {
  success: boolean;
  status: string;
  orderId?: string;
  transactionId?: string;
  reference?: string;
  authorizationNumber?: string;
  error?: 'not_configured' | 'auth_error' | 'token_error' | 'payment_error';
  details?: string;
}

const OCTANO_BASE_URL =
  process.env.OCTANO_BASE_URL?.replace(/\/$/, '') ||
  'https://pagos.octanopayments.com/api/v1';

const OCTANO_EMAIL = process.env.OCTANO_EMAIL || process.env.OCTANO_USER || '';
const OCTANO_PASSWORD = process.env.OCTANO_PASSWORD || '';
const REQUEST_TIMEOUT = 75_000;

let authToken: string | null = null;
let tokenExpiry = 0;

export function isOctanoConfigured() {
  return Boolean(OCTANO_EMAIL && OCTANO_PASSWORD);
}

async function post(path: string, body: unknown, token?: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(`${OCTANO_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    return { response, data } as const;
  } finally {
    clearTimeout(timer);
  }
}

async function getToken(): Promise<string> {
  if (authToken && Date.now() < tokenExpiry) return authToken;

  if (!isOctanoConfigured()) {
    throw new Error('Octano credentials are not configured.');
  }

  const { response, data } = await post('/signin', {
    email: OCTANO_EMAIL,
    password: OCTANO_PASSWORD,
  });

  if (!response.ok || !data?.authToken) {
    throw new Error(data?.message || 'Octano authentication failed.');
  }

  authToken = data.authToken as string;
  // The token is valid for 24 h; refresh safely before that.
  tokenExpiry = Date.now() + 14 * 60 * 1000;
  return authToken;
}

/** Octano expects MM and a two-digit YY (30, not 2030). */
function normalizeMonth(value: string) {
  return String(value ?? '').replace(/\D/g, '').padStart(2, '0').slice(-2);
}

function normalizeYear(value: string) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.slice(-2).padStart(2, '0');
}

async function tokenizeCard(token: string, input: OctanoPaymentInput): Promise<string> {
  const { response, data } = await post(
    '/card/tokenizer',
    {
      cardData: {
        cardNumber: input.card.number.replace(/\s/g, ''),
        cardholderName: input.card.name,
        expirationMonth: normalizeMonth(input.card.month),
        expirationYear: normalizeYear(input.card.year),
      },
    },
    token
  );

  if (!response.ok || !data?.cardNumberToken) {
    throw new Error(data?.message || 'Octano card tokenization failed.');
  }

  return data.cardNumberToken as string;
}

export async function processOctanoPayment(
  input: OctanoPaymentInput
): Promise<OctanoPaymentResult> {
  if (!isOctanoConfigured()) {
    return {
      success: false,
      status: 'not_configured',
      error: 'not_configured',
      details: 'Octano credentials are not configured.',
    };
  }

  let stage: 'auth' | 'tokenize' | 'sale' = 'auth';

  try {
    const token = await getToken();

    stage = 'tokenize';
    const cardToken = await tokenizeCard(token, input);

    stage = 'sale';
    const currency = (input.currency || 'MXN').toUpperCase();
    const currencyCode = currency === 'USD' ? '840' : '484';

    const { response, data } = await post(
      '/sale',
      {
        amount: Number(input.amount),
        currency: currencyCode,
        reference: input.orderId,
        description: input.description || 'ExploraRuta booking',
        customerInformation: {
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          email: input.customer.email,
          phone1: input.customer.phone,
          address1: input.customer.address,
          address2: input.customer.address2 || '',
          city: input.customer.city,
          state: input.customer.state,
          postalCode: input.customer.postalCode,
          country: input.customer.country || 'MX',
          company: input.customer.company || '',
          ip: input.metadata?.ip || '127.0.0.1',
        },
        cardData: {
          cardNumberToken: cardToken,
          cvv: input.card.cvv,
        },
      },
      token
    );

    const status = String(data?.status || '').toUpperCase();
    const approved = response.ok && status === 'APPROVED';

    if (!approved) {
      return {
        success: false,
        status: data?.status || 'declined',
        error: 'payment_error',
        details: data?.responseMessage || data?.message || 'The payment was declined.',
      };
    }

    return {
      success: true,
      status,
      orderId: data?.orderId ? String(data.orderId) : undefined,
      transactionId: data?.transactionId ? String(data.transactionId) : undefined,
      reference: data?.reference,
      authorizationNumber: data?.authorizationNumber,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected Octano error.';
    return {
      success: false,
      status: 'error',
      error:
        stage === 'auth'
          ? 'auth_error'
          : stage === 'tokenize'
            ? 'token_error'
            : 'payment_error',
      details: message,
    };
  }
}
