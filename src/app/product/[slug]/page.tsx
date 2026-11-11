import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { getProduct, products } from '@/data/products';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Ruta' };

  return {
    title: product.title.es,
    description: product.short.es,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.title.es} · ExploraRuta`,
      description: product.short.es,
      images: [{ url: product.image, width: 1200, height: 900, alt: product.title.es }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title.es} · ExploraRuta`,
      description: product.short.es,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
