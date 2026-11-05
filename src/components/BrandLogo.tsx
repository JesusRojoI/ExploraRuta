'use client';

import { useI18n } from '@/lib/i18n';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
  className?: string;
}

export default function BrandLogo({
  variant = 'dark',
  compact = false,
  className = '',
}: BrandLogoProps) {
  const { t } = useI18n();

  return (
    <span
      className={`brand-logo brand-logo--${variant} ${
        compact ? 'brand-logo--compact' : ''
      } ${className}`}
      aria-label={t('common.brand')}
    >
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M7 17 19 48 31 17" />
          <path d="M54 22c-3-3.7-7.3-5.5-12-4.8-8.5 1.2-13.2 9.8-11.2 18.3 2 8.4 10.1 13.7 18.1 10.6 2-.8 3.7-2 5.1-3.6" />
          <path d="M48 9.5c-3 0-5.4 2.4-5.4 5.4 0 3.8 5.4 9 5.4 9s5.4-5.2 5.4-9c0-3-2.4-5.4-5.4-5.4Z" />
          <circle cx="48" cy="14.8" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-type">
          <span className="brand-name">{t('common.brand')}</span>
          <span className="brand-tagline">{t('common.tagline')}</span>
        </span>
      )}
    </span>
  );
}
