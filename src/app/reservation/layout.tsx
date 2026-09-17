import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réserver votre Chariot Gourmand & Animation Anniversaire | Solly Dakar',
  description:
    'Configurez votre événement en ligne et recevez votre devis personnalisé. Réservation de chariot Cake Bar, boissons fraîches et charcuterie à Dakar.',
  keywords: [
    'réserver chariot gourmand Dakar',
    'devis animation anniversaire enfant Dakar',
    'chariot événement Dakar réservation',
    'cake bar anniversaire Dakar devis',
    'food cart Dakar réservation',
  ],
  openGraph: {
    title: 'Réserver votre Chariot Gourmand & Animation Anniversaire | Solly Dakar',
    description:
      'Demandez votre devis gratuit en 2 minutes pour votre chariot Solly à Dakar.',
    url: 'https://www.monsolly.com/reservation',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.monsolly.com/reservation',
  },
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
