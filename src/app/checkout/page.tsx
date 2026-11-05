import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Finaliza tu reserva',
  description: 'Completa tus datos y paga de forma segura con Octano. Aceptamos Visa y Mastercard.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
