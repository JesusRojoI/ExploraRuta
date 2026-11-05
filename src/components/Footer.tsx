'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useI18n } from '@/lib/i18n';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/lib/site';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label={t('common.brand')}>
            <BrandLogo variant="light" />
          </Link>
          <p className="footer-tagline">{t('footer.description')}</p>
          <p className="footer-small">{t('footer.small')}</p>
        </div>

        <div className="footer-col">
          <h3>{t('footer.explore')}</h3>
          <Link href="/rutas">{t('footer.allRoutes')}</Link>
          <Link href="/#como">{t('footer.how')}</Link>
          <Link href="/#historia">{t('footer.story')}</Link>
          <Link href="/#faq">{t('footer.faq')}</Link>
        </div>

        <div className="footer-col">
          <h3>{t('footer.help')}</h3>
          <Link href="/#faq">{t('footer.faq')}</Link>
          <Link href="/contacto">{t('footer.contact')}</Link>
          <Link href="/carrito">{t('footer.cart')}</Link>
        </div>

        <div className="footer-col footer-contact">
          <h3>{t('footer.contactTitle')}</h3>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <span className="footer-contact-icon">
              <Mail size={15} />
            </span>
            <span>
              <strong>{CONTACT_EMAIL}</strong>
              <small>{t('footer.emailNote')}</small>
            </span>
          </a>
          {CONTACT_PHONE_HREF && (
            <a href={CONTACT_PHONE_HREF}>
              <span className="footer-contact-icon">
                <Phone size={15} />
              </span>
              <span>
                <strong>{CONTACT_PHONE_DISPLAY}</strong>
                <small>{t('footer.phoneNote')}</small>
              </span>
            </a>
          )}
          <div className="footer-contact-static">
            <span className="footer-contact-icon">
              <MapPin size={15} />
            </span>
            <span>
              <strong>{t('footer.country')}</strong>
              <small>{t('footer.countryNote')}</small>
            </span>
          </div>
        </div>
      </div>

      <div className="footer-trust">
        <div className="footer-trust-item">
          <span className="trust-lock">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <span>
            <strong>{t('common.trust.secure')}</strong>
            <small>{t('common.trust.secureSub')}</small>
          </span>
        </div>

        <div className="footer-payments" aria-label={t('footer.paymentNote')}>
          <Image src="/visa.svg" alt="Visa" width={38} height={14} />
          <Image src="/mastercard.svg" alt="Mastercard" width={38} height={14} />
          <span className="payment-divider" aria-hidden="true" />
          <Image
            src="/octano.png"
            alt="Octano"
            width={70}
            height={20}
            className="payment-octano"
          />
        </div>

        <div className="footer-trust-item footer-trust-item--right">
          <span className="trust-doc">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
          </span>
          <span>
            <strong>{t('common.trust.taxes')}</strong>
            <small>{t('common.trust.taxesSub')}</small>
          </span>
        </div>
      </div>

      <div className="footer-legal">
        <Link href="/politica-privacidad">{t('footer.legal.privacy')}</Link>
        <Link href="/terminos-y-condiciones">{t('footer.legal.terms')}</Link>
        <Link href="/politicas-reembolso">{t('footer.legal.refunds')}</Link>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {t('common.brand')} · {t('footer.rights')}
        </span>
        <div className="footer-socials">
          {CONTACT_PHONE_HREF && (
            <a href={CONTACT_PHONE_HREF} aria-label={t('footer.phoneNote')}>
              <Phone size={15} />
            </a>
          )}
          <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email">
            <Mail size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
