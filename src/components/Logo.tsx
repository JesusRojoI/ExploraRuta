import Link from 'next/link';
import { cn } from '@/lib/utils';

export function LogoMark({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const color = light ? '#FBF7EF' : '#1E3A32';

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      role="img"
      fill="none"
    >
      {/* Map pin with a fork cut out (destination + gastronomy). */}
      <defs>
        <mask id="exploraruta-mark-fork" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
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
        fill={color}
        stroke="none"
        mask="url(#exploraruta-mark-fork)"
      />
    </svg>
  );
}

export function Logo({
  light = false,
  compact = false,
  href = '/',
  className,
}: {
  light?: boolean;
  compact?: boolean;
  href?: string | null;
  className?: string;
}) {
  const content = (
    <span className={cn('flex items-center gap-2.5 md:gap-3', className)}>
      <LogoMark light={light} className="h-11 w-11 shrink-0 md:h-12 md:w-12" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-sans text-[1.04rem] font-bold tracking-[-0.045em] md:text-[1.12rem]',
            light ? 'text-cream-200' : 'text-jade-900'
          )}
        >
          ExploraRuta
        </span>
        {!compact && (
          <span
            className={cn(
              'mt-1 text-[0.42rem] font-bold uppercase tracking-[0.3em]',
              light ? 'text-maize-300' : 'text-clay-600'
            )}
          >
            Rutas gastronómicas
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="ExploraRuta · Inicio" className="inline-flex">
      {content}
    </Link>
  );
}
