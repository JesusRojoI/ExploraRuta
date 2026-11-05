import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  alternates: { canonical: '/politica-privacidad' },
};

export default function PrivacyPage() {
  return <LegalPage titleKey="legal.privacyTitle" />;
}
