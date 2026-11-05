import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SuccessClient } from '@/components/checkout/SuccessClient';

export const metadata: Metadata = {
  title: 'Reserva confirmada',
  description: 'Tu reserva en ExploraRuta quedó confirmada. Recibirás el itinerario por correo.',
  alternates: { canonical: '/compra-exitosa' },
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center pt-32 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted">
          …
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
