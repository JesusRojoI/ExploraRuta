'use client';

import { useLanguage } from '@/context/LanguageContext';

function Asterisk() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-maize-300/80" aria-hidden="true">
      <path
        d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IngredientMarquee() {
  const { messages } = useLanguage();
  const words = [...messages.home.marquee, ...messages.home.marquee];

  return (
    <section className="relative z-10 overflow-hidden border-y border-clay-700/30 bg-clay-500 py-3.5 text-cream-50">
      <div className="marquee">
        <div className="marquee-track gap-7">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center gap-7">
              <span className="whitespace-nowrap font-display text-[0.95rem] font-medium italic tracking-wide">
                {word}
              </span>
              <Asterisk />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
