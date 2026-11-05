import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import type { Locale } from '@/types';

const displayFont = localFont({
  src: [
    {
      path: './fonts/dm-serif-display-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/dm-serif-display-latin-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-sora',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

const bodyFont = localFont({
  src: './fonts/dm-sans-latin.woff2',
  weight: '100 1000',
  style: 'normal',
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://exploraruta.com.mx';

export function generateMetadata(): Metadata {
  const isEnglish = cookies().get('NEXT_LOCALE')?.value === 'en';
  const title = isEnglish
    ? 'ExploraRuta · Taste Mexico through its regional cuisine'
    : 'ExploraRuta · México se descubre en la mesa';
  const description = isEnglish
    ? 'Culinary routes with traditional cooks, producers and markets across Mexico.'
    : 'Rutas gastronómicas con cocineras tradicionales, productores y mercados de México.';
  const shortDescription = isEnglish
    ? 'Discover Mexico through its regional flavours and traditions.'
    : 'Descubre México a través de sus sabores y tradiciones regionales.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s · ExploraRuta',
    },
    description,
    keywords: [
      'rutas culturales',
      'México',
      'gastronomía mexicana',
      'turismo gastronómico',
      'Oaxaca',
      'Puebla',
      'Yucatán',
      'ExploraRuta',
    ],
    authors: [{ name: 'ExploraRuta' }],
    creator: 'ExploraRuta',
    openGraph: {
      type: 'website',
      locale: isEnglish ? 'en_US' : 'es_MX',
      url: siteUrl,
      siteName: 'ExploraRuta',
      title,
      description: isEnglish
        ? 'Culinary routes with traditional cooks, producers and markets across Mexico.'
        : 'Rutas gastronómicas con cocineras tradicionales, productores y mercados de México.',
      images: [
        {
          url: '/images/catalog-hero-cocina.jpg',
          width: 1600,
          height: 1067,
          alt: 'ExploraRuta',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shortDescription,
      images: ['/images/catalog-hero-cocina.jpg'],
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#1E3A32',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  const locale: Locale = cookieLocale === 'en' ? 'en' : 'es';

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers initialLocale={locale}>
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
