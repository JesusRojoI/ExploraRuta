'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  Menu,
  Phone,
  ShoppingBag,
  X,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import LanguageSelector from './LanguageSelector';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/lib/i18n';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/lib/site';

export default function Header() {
  const { t } = useI18n();
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // The flat hero sits on a light beige canvas, so the header stays solid.
  const transparent = false;

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > lastY && y > 260 && !mobileOpen);
        lastY = y;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const navItems = [
    { href: '/#como', label: t('common.nav.how') },
    { href: '/rutas', label: t('common.nav.routes') },
    { href: '/#historia', label: t('common.nav.story') },
    { href: '/contacto', label: t('common.nav.contact') },
  ];

  const isActive = (href: string) =>
    href === '/rutas'
      ? pathname.startsWith('/rutas') || pathname.startsWith('/product')
      : href === '/contacto'
        ? pathname.startsWith('/contacto')
        : false;

  return (
    <>
      <header
        className={[
          'site-header',
          transparent ? 'is-transparent' : 'is-solid',
          hidden ? 'is-hidden' : '',
          mobileOpen ? 'is-menu-open' : '',
        ].join(' ')}
      >
        <div className="header-inner">
          <Link href="/" className="header-logo" aria-label={t('common.brand')}>
            <BrandLogo variant={transparent ? 'light' : 'dark'} />
          </Link>

          <nav className="desktop-nav" aria-label={t('header.menu')}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'is-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSelector />
            <button
              type="button"
              className="cart-trigger"
              onClick={openCart}
              aria-label={t('common.nav.cart')}
            >
              <ShoppingBag size={21} strokeWidth={1.6} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <Link href="/contacto" className="header-cta">
              {t('common.nav.reserve')}
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              className={`menu-trigger ${mobileOpen ? 'is-open' : ''}`}
              aria-label={
                mobileOpen ? t('header.closeMenu') : t('header.openMenu')
              }
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu-backdrop ${mobileOpen ? 'is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-head">
          <BrandLogo variant="dark" />
          <button
            type="button"
            className="mobile-menu-close"
            aria-label={t('header.closeMenu')}
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <nav className="mobile-menu-nav">
          {navItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <span className="mobile-menu-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
              <ArrowUpRight size={18} strokeWidth={1.4} />
            </Link>
          ))}
          <Link href="/contacto" className="mobile-menu-feature">
            {t('common.nav.reserve')}
            <ArrowUpRight size={20} />
          </Link>
        </nav>
        <div className="mobile-menu-foot">
          <LanguageSelector variant="mobile" />
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={16} /> {CONTACT_EMAIL}
          </a>
          {CONTACT_PHONE_HREF && (
            <a href={CONTACT_PHONE_HREF}>
              <Phone size={16} /> {CONTACT_PHONE_DISPLAY}
            </a>
          )}
        </div>
      </aside>

      <CartDrawer />
    </>
  );
}
