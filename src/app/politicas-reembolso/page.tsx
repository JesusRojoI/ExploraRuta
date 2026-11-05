import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Políticas de Reembolso',
  alternates: { canonical: '/politicas-reembolso' },
};

export default function RefundPage() {
  return <LegalPage titleKey="legal.refundTitle" />;
}
