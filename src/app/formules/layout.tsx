import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formules & Tarifs Chariot Gourmand Anniversaire à Dakar | Solly',
  description:
    'Découvrez nos formules tout inclus à partir de 80 000 FCFA : chariot jaune Solly, animateur maître de bar, Cake Bar et boissons fraîches à Dakar.',
  keywords: [
    'chariot gourmand anniversaire Dakar',
    'tarif chariot événement Dakar',
    'prix cake bar Dakar',
    'formule anniversaire enfant Dakar',
    'animation anniversaire Dakar prix',
    'traiteur chariot Dakar',
  ],
  openGraph: {
    title: 'Formules & Tarifs Chariot Gourmand Anniversaire à Dakar | Solly',
    description:
      'Formules claires et transparentes pour votre événement à Dakar. Chariot Solly, service inclus, installation et démontage.',
    url: 'https://www.monsolly.com/formules',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.monsolly.com/formules',
  },
};

export default function FormulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
