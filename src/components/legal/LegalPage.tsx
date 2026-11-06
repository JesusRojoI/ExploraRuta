'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'list'; items: string[] };

type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
};

export type LegalDocumentKey = 'privacy' | 'terms' | 'refund';

export function LegalPage({ docKey }: { docKey: LegalDocumentKey }) {
  const { t, messages } = useLanguage();
  const content = messages.legal[docKey] as unknown as LegalDocument;

  return (
    <>
      <section className="relative overflow-hidden bg-jade-950 pb-14 pt-32 text-cream-100 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(234,182,76,0.14),transparent_38%),radial-gradient(circle_at_10%_85%,rgba(200,90,58,0.16),transparent_40%)]" />
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full border border-cream-100/10" />
        <div className="container-tgv relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-100/20 bg-cream-100/5 text-maize-300">
            <FileText className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,6.5vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-cream-50">
            {content.title}
          </h1>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tgv">
          <article className="mx-auto max-w-3xl rounded-[2rem] border border-jade-900/10 bg-cream-50 px-6 py-10 md:px-12 md:py-14">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-clay-600">
              {t('legal.updated')}: {content.lastUpdated}
            </p>

            <div className="mt-8 space-y-5">
              {content.intro.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[0.98rem] leading-relaxed text-jade-900/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 space-y-10">
              {content.sections.map((section, sectionIndex) => (
                <section
                  key={sectionIndex}
                  className="border-t border-jade-900/10 pt-8"
                >
                  <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-jade-950">
                    {section.heading}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.blocks.map((block, blockIndex) => {
                      if (block.type === 'subheading') {
                        return (
                          <h3
                            key={blockIndex}
                            className="pt-2 text-[1.05rem] font-semibold text-jade-950"
                          >
                            {block.text}
                          </h3>
                        );
                      }

                      if (block.type === 'list') {
                        return (
                          <ul
                            key={blockIndex}
                            className="list-disc space-y-2 pl-5 text-[0.98rem] leading-relaxed text-jade-900/80 marker:text-clay-500"
                          >
                            {block.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        );
                      }

                      return (
                        <p
                          key={blockIndex}
                          className="text-[0.98rem] leading-relaxed text-jade-900/80"
                        >
                          {block.text}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 border-t border-jade-900/10 pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-jade-900 transition-colors hover:text-clay-600"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
                {t('legal.back')}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
