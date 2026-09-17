import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chariot Événementiel & Animation Anniversaire Enfant à Dakar | Solly',
  description:
    'Animation originale pour anniversaire d’enfant, baby shower et fête de famille à Dakar. Chariot gourmand personnalisable aux couleurs de votre événement.',
  keywords: [
    'chariot événement Dakar',
    'animation originale anniversaire enfant Dakar',
    'chariot gourmand anniversaire Dakar',
    'chariot anniversaire Dakar',
    'animation anniversaire enfant Dakar',
    'food cart événement Dakar',
    'anniversaire enfant Dakar',
    'fête enfant Dakar',
    'chariot mariage Dakar',
  ],
  openGraph: {
    title: 'Chariot Événementiel & Animation Anniversaire Enfant à Dakar | Solly',
    description:
      'Animation originale pour anniversaire d’enfant et célébrations à Dakar. Chariot gourmand jaune avec façade, contenants et menu personnalisés.',
    url: 'https://www.monsolly.com/evenements',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.monsolly.com/evenements',
  },
};

export default function EvenementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
