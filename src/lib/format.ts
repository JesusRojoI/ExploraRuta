export function formatMXN(value: number, locale: 'es' | 'en' = 'es') {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMXNCompact(value: number, locale: 'es' | 'en' = 'es') {
  const formatted = new Intl.NumberFormat(
    locale === 'es' ? 'es-MX' : 'en-US',
    {
      maximumFractionDigits: 0,
    }
  ).format(value);
  return `$${formatted}`;
}

export function formatDate(value: string, locale: 'es' | 'en' = 'es') {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function ivaBreakdown(total: number) {
  const subtotal = total / 1.16;
  const iva = total - subtotal;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function makeOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `ER-${stamp}${rand}`;
}
