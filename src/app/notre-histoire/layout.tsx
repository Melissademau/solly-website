import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Histoire — Le Chariot Gourmand Solly Paris & Dakar',
  description:
    'Découvrez l’histoire de Solly : un concept raffiné et festif de chariot gourmand à Dakar pour sublimer les anniversaires, mariages et moments de partage.',
  keywords: [
    'chariot gourmand Dakar',
    'histoire Solly Dakar',
    'concept food cart Dakar',
    'traiteur événementiel original Dakar',
    'animation enfant Dakar',
  ],
  openGraph: {
    title: 'Notre Histoire — Le Chariot Gourmand Solly Paris & Dakar',
    description:
      'L’art de la gourmandise en fête. Découvrez l’univers de Solly et ses chariots ambulants pour célébrations à Dakar.',
    url: 'https://www.monsolly.com/notre-histoire',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.monsolly.com/notre-histoire',
  },
};

export default function NotreHistoireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
