import type { Metadata } from 'next';
import { CatalogClient } from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'Sabores para descubrir México',
  description:
    'Catálogo de rutas gastronómicas por México: cocinas tradicionales, mercados, café, vino y productores locales.',
  alternates: { canonical: '/rutas' },
};

export default function RoutesPage() {
  return <CatalogClient />;
}
