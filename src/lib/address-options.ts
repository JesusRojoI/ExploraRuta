import type { Locale } from '@/types';

const COUNTRY_CODES = [
  'MX', 'US', 'CA', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA',
  'CU', 'DO', 'HT', 'JM', 'TT', 'BS', 'AR', 'BO', 'BR', 'CL',
  'CO', 'EC', 'PY', 'PE', 'UY', 'VE', 'ES', 'FR', 'DE', 'IT',
  'PT', 'GB', 'IE', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK',
  'PL', 'JP', 'CN', 'KR', 'IN', 'AU', 'NZ', 'ZA', 'IL', 'AE',
] as const;

const MEXICAN_STATES = [
  { code: 'AGU', es: 'Aguascalientes', en: 'Aguascalientes' },
  { code: 'BCN', es: 'Baja California', en: 'Baja California' },
  { code: 'BCS', es: 'Baja California Sur', en: 'Baja California Sur' },
  { code: 'CAM', es: 'Campeche', en: 'Campeche' },
  { code: 'COA', es: 'Coahuila', en: 'Coahuila' },
  { code: 'COL', es: 'Colima', en: 'Colima' },
  { code: 'CHP', es: 'Chiapas', en: 'Chiapas' },
  { code: 'CHH', es: 'Chihuahua', en: 'Chihuahua' },
  { code: 'CMX', es: 'Ciudad de México', en: 'Mexico City' },
  { code: 'DUR', es: 'Durango', en: 'Durango' },
  { code: 'GUA', es: 'Guanajuato', en: 'Guanajuato' },
  { code: 'GRO', es: 'Guerrero', en: 'Guerrero' },
  { code: 'HID', es: 'Hidalgo', en: 'Hidalgo' },
  { code: 'JAL', es: 'Jalisco', en: 'Jalisco' },
  { code: 'MEX', es: 'Estado de México', en: 'State of Mexico' },
  { code: 'MIC', es: 'Michoacán', en: 'Michoacán' },
  { code: 'MOR', es: 'Morelos', en: 'Morelos' },
  { code: 'NAY', es: 'Nayarit', en: 'Nayarit' },
  { code: 'NLE', es: 'Nuevo León', en: 'Nuevo León' },
  { code: 'OAX', es: 'Oaxaca', en: 'Oaxaca' },
  { code: 'PUE', es: 'Puebla', en: 'Puebla' },
  { code: 'QUE', es: 'Querétaro', en: 'Querétaro' },
  { code: 'ROO', es: 'Quintana Roo', en: 'Quintana Roo' },
  { code: 'SLP', es: 'San Luis Potosí', en: 'San Luis Potosí' },
  { code: 'SIN', es: 'Sinaloa', en: 'Sinaloa' },
  { code: 'SON', es: 'Sonora', en: 'Sonora' },
  { code: 'TAB', es: 'Tabasco', en: 'Tabasco' },
  { code: 'TAM', es: 'Tamaulipas', en: 'Tamaulipas' },
  { code: 'TLA', es: 'Tlaxcala', en: 'Tlaxcala' },
  { code: 'VER', es: 'Veracruz', en: 'Veracruz' },
  { code: 'YUC', es: 'Yucatán', en: 'Yucatán' },
  { code: 'ZAC', es: 'Zacatecas', en: 'Zacatecas' },
] as const;

export function getCountryOptions(locale: Locale) {
  const displayNames = new Intl.DisplayNames(
    [locale === 'es' ? 'es-MX' : 'en'],
    { type: 'region' }
  );

  return COUNTRY_CODES.map((code) => ({
    code,
    name: displayNames.of(code) ?? code,
  }));
}

export function getMexicanStateOptions(locale: Locale) {
  return MEXICAN_STATES.map(({ code, es, en }) => ({
    code,
    name: locale === 'es' ? es : en,
  }));
}

export function getMexicanStateName(code: string, locale: Locale) {
  const state = MEXICAN_STATES.find((entry) => entry.code === code);
  return state ? state[locale] : '';
}
