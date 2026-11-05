'use client';

import { useId } from 'react';
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
  const forkMaskId = `fork-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <span
      className={`brand-logo brand-logo--${variant} ${
        compact ? 'brand-logo--compact' : ''
      } ${className}`}
      aria-label={t('common.brand')}
    >
      <span className="brand-mark" aria-hidden="true">
        {/* A destination pin carved with a fork: exploration and gastronomy in one mark. */}
        <svg viewBox="0 0 64 64" fill="none">
          <defs>
            <mask
              id={forkMaskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="64"
              height="64"
            >
              <rect width="64" height="64" fill="#fff" stroke="none" />
              <g
                fill="none"
                stroke="#000"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M24 14V23M32 13V25M40 14V23" />
                <path d="M24 23C27 23 29 25 32 25C35 25 37 23 40 23" />
                <path d="M32 25V46" />
              </g>
            </mask>
          </defs>
          <path
            d="M32 57C32 57 51 38 51 25A19 19 0 1 0 13 25C13 38 32 57 32 57Z"
            fill="currentColor"
            stroke="none"
            mask={`url(#${forkMaskId})`}
          />
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
