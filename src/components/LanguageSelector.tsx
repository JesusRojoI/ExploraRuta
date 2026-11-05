'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useI18n, type Locale } from '@/lib/i18n';

function FlagMX({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#006847" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" rx="2" fill="#CE1126" />
      <circle cx="12" cy="8" r="2.6" fill="#8C6239" />
      <path
        d="M10.2 8c.5-1.6 3.1-1.6 3.6 0"
        stroke="#4b7f52"
        strokeWidth=".7"
        fill="none"
      />
    </svg>
  );
}

function FlagUS({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((y) => (
        <rect key={y} y={y} width="24" height="1" fill="#B22234" />
      ))}
      {[1, 3, 5, 7, 9, 11, 13, 15].map((y) => (
        <rect key={`w${y}`} y={y} width="24" height="1" fill="#fff" />
      ))}
      <rect width="10.5" height="8.6" rx="1" fill="#3C3B6E" />
      {[1.6, 3.6, 5.6, 7.6].map((y) =>
        [1.3, 3.3, 5.3, 7.3, 9.3].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r=".38" fill="#fff" />
        ))
      )}
    </svg>
  );
}

export default function LanguageSelector({
  variant = 'header',
}: {
  variant?: 'header' | 'mobile' | 'footer';
}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div
      className={`lang-select lang-select--${variant}`}
      ref={ref}
      data-open={open}
    >
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('common.language.select')}
        onClick={() => setOpen((value) => !value)}
      >
        {locale === 'es' ? <FlagMX /> : <FlagUS />}
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={12} strokeWidth={2} className="lang-chevron" />
      </button>
      <div className="lang-menu" role="listbox" aria-label={t('common.language.select')}>
        <button
          type="button"
          role="option"
          aria-selected={locale === 'es'}
          onClick={() => choose('es')}
          className={locale === 'es' ? 'is-active' : ''}
        >
          <FlagMX />
          <span>{t('common.language.es')}</span>
          {locale === 'es' && <Check size={13} />}
        </button>
        <button
          type="button"
          role="option"
          aria-selected={locale === 'en'}
          onClick={() => choose('en')}
          className={locale === 'en' ? 'is-active' : ''}
        >
          <FlagUS />
          <span>{t('common.language.en')}</span>
          {locale === 'en' && <Check size={13} />}
        </button>
      </div>
    </div>
  );
}
