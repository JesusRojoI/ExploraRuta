'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import esMessages from '../../messages/es.json';
import enMessages from '../../messages/en.json';
import type { Locale } from '@/types';

export type Messages = typeof esMessages;

const messagesMap: Record<Locale, Messages> = {
  es: esMessages,
  en: enMessages as Messages,
};

type Primitive = string | number | boolean | null;
type TranslationValue =
  | Primitive
  | TranslationValue[]
  | { [key: string]: TranslationValue };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  messages: Messages;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getByPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === 'object' &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLocale = 'es',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = (
      readCookie('NEXT_LOCALE') ||
      localStorage.getItem('tgv-locale') ||
      initialLocale
    ) as Locale;
    const valid: Locale = stored === 'en' ? 'en' : 'es';
    setLocaleState(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('tgv-locale', locale);
    writeCookie('NEXT_LOCALE', locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next === 'en' ? 'en' : 'es');
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => (current === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const value = getByPath(messagesMap[locale], path);
      if (typeof value !== 'string') return path;
      if (!vars) return value;
      return Object.entries(vars).reduce(
        (text, [key, replacement]) =>
          text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(replacement)),
        value
      );
    },
    [locale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      messages: messagesMap[locale],
      t,
    }),
    [locale, setLocale, toggleLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
