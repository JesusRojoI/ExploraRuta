import type { MetadataRoute } from 'next';
import { products } from '@/data/products';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://exploraruta.com.mx').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ['', '/rutas', '/contacto', '/politica-privacidad', '/terminos-y-condiciones', '/politicas-reembolso'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: (route === '' || route === '/rutas' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : route === '/rutas' ? 0.9 : 0.5,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
