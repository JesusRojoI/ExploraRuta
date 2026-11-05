/**
 * Single source for public contact details. Set NEXT_PUBLIC_CONTACT_PHONE to
 * a different public number. Defaults to the published ExploraRuta phone.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'soluciones@axbyte.com.mx';

const rawPhone = (
  process.env.NEXT_PUBLIC_CONTACT_PHONE || '+52 1 55 5662 5469'
).trim();
export const CONTACT_PHONE_DISPLAY = rawPhone;
export const CONTACT_PHONE_HREF = rawPhone
  ? `tel:${rawPhone.replace(/[^\d+]/g, '')}`
  : '';
export const SITE_DOMAIN = 'exploraruta.com.mx';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  `https://${SITE_DOMAIN}`;
