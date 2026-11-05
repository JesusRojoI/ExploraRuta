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
      stroke={color}
      strokeWidth="3.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 19 48 31 17" />
      <path d="M54 22c-3-3.7-7.3-5.5-12-4.8-8.5 1.2-13.2 9.8-11.2 18.3 2 8.4 10.1 13.7 18.1 10.6 2-.8 3.7-2 5.1-3.6" />
      <path d="M48 9.5c-3 0-5.4 2.4-5.4 5.4 0 3.8 5.4 9 5.4 9s5.4-5.2 5.4-9c0-3-2.4-5.4-5.4-5.4Z" />
      <circle cx="48" cy="14.8" r="1.3" fill={color} stroke="none" />
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
