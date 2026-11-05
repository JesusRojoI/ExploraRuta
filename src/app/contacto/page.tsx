import type { Metadata } from 'next';
import { ContactClient } from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos para conocer próximas salidas, accesibilidad o detalles de las rutas de muestra.',
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  return <ContactClient />;
}
