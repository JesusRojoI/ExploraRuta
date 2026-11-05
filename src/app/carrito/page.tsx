import type { Metadata } from 'next';
import { CartClient } from '@/components/cart/CartClient';

export const metadata: Metadata = {
  title: 'Tu carrito',
  description: 'Revisa las experiencias que elegiste antes de completar tu reserva.',
  alternates: { canonical: '/carrito' },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
