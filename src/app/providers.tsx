'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { CartProvider } from '@/context/CartContext';
import type { Locale } from '@/types';

export function Providers({
  children,
  initialLocale = 'es',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <CartProvider>{children}</CartProvider>
    </I18nProvider>
  );
}
