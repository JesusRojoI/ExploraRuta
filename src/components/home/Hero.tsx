'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';

export function Hero() {
  const { t } = useLanguage();
  const stateCount = new Set(products.map((product) => product.state.es)).size;

  return (
    <section className="flat-hero">
      <div className="flat-hero-grid" aria-hidden="true" />
      <div className="container-tgv flat-hero-inner">
        <div className="flat-hero-copy">
          <p className="eyebrow">{t('home.hero.eyebrow')}</p>

          <h1 className="flat-hero-title">
            <span>{t('home.hero.title1')}</span>
            <span className="flat-hero-title-accent">{t('home.hero.title2')}</span>
          </h1>

          <p className="flat-hero-lead">{t('home.hero.description')}</p>

          <div className="flat-hero-ctas">
            <Link href="/rutas" className="btn btn-primary btn-lg">
              {t('home.hero.cta1')}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link href="/contacto" className="btn btn-outline btn-lg">
              {t('home.hero.cta2')}
            </Link>
          </div>

          <div className="flat-hero-badges">
            <span>
              <span className="flat-hero-dot" aria-hidden="true" />
              {t('home.hero.badge')}
            </span>
            <span>{t('home.hero.badgeCooks')}</span>
            <span>{t('home.hero.badgeGroups')}</span>
          </div>

          <div className="flat-hero-stats">
            {[
              { value: `${products.length}`, label: t('home.hero.statRoutes') },
              { value: String(stateCount), label: t('home.hero.statStates') },
              { value: '100%', label: t('home.hero.statLocal') },
            ].map((stat) => (
              <div key={stat.label}>
                <p>{stat.value}</p>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flat-hero-visual">
          <div className="flat-hero-photo">
            <Image
              src="/images/gallery/hero-cocina.jpg"
              alt={t('home.hero.noteTitle')}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover"
            />
            <span className="flat-hero-location">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              {t('home.hero.noteSign')}
            </span>
          </div>

          <div className="flat-hero-note">
            <span className="flat-hero-note-icon">
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="flat-hero-note-title">{t('home.hero.noteTitle')}</p>
              <p className="flat-hero-note-text">{t('home.hero.noteText')}</p>
            </div>
            <span className="flat-hero-note-count">
              {String(products.length).padStart(2, '0')} {t('home.hero.noteCount')}
            </span>
          </div>

          <div className="flat-hero-block" aria-hidden="true" />
        </div>
      </div>

      <div className="container-tgv flat-hero-foot">
        <p>{t('home.hero.scroll')}</p>
        <a href="#como" aria-label={t('home.hero.scroll')} className="flat-hero-scroll">
          <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
        </a>
      </div>
    </section>
  );
}
