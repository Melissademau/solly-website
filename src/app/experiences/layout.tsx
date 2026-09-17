import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cake Bar & Expérience Gourmande Chariot à Dakar | Solly',
  description:
    'Découvrez le Cake Bar pour anniversaire à Dakar : gâteaux minute, sauces fondantes et 6 toppings au choix. Bar à boissons fraîches et bar à charcuterie.',
  keywords: [
    'cake bar anniversaire Dakar',
    'expérience gourmande chariot Dakar',
    'chariot gourmand anniversaire Dakar',
    'animation originale anniversaire enfant Dakar',
    'bar à boissons Dakar',
    'bar à charcuterie Dakar',
    'bissap glacé Dakar',
    'buffet anniversaire enfant Dakar',
  ],
  openGraph: {
    title: 'Cake Bar & Expérience Gourmande Chariot à Dakar | Solly',
    description:
      'Une expérience gourmande unique à Dakar : composez votre Cake Bar avec barquettes personnalisées, bases moelleuses, sauces et toppings servis au chariot.',
    url: 'https://www.monsolly.com/experiences',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.monsolly.com/experiences',
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
