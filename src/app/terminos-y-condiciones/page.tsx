import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  alternates: { canonical: '/terminos-y-condiciones' },
};

export default function TermsPage() {
  return <LegalPage titleKey="legal.termsTitle" />;
}
