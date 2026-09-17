import type { Metadata } from 'next';
import { Fredoka, Quicksand, Caveat } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { BookingModal } from '@/components/booking/BookingModal';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.monsolly.com'),
  title: {
    default: 'SOLLY | Chariot Gourmand & Animation Anniversaire Enfant à Dakar',
    template: '%s | SOLLY Dakar',
  },
  description:
    'L’animation originale pour vos événements à Dakar : chariot gourmand avec Cake Bar à composer, bar à boissons fraîches et chariot salé pour anniversaires d’enfants et fêtes.',
  keywords: [
    'chariot événement Dakar',
    'chariot anniversaire Dakar',
    'animation originale anniversaire enfant Dakar',
    'chariot gourmand anniversaire Dakar',
    'cake bar anniversaire Dakar',
    'expérience gourmande chariot Dakar',
    'food cart Dakar',
    'animation anniversaire enfant Dakar',
    'traiteur anniversaire enfant Dakar',
    'Solly Dakar',
    'La beauté en bouchées',
  ],
  authors: [{ name: 'SOLLY' }],
  creator: 'SOLLY',
  publisher: 'SOLLY',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'SOLLY | Chariot Gourmand & Animation Anniversaire Enfant à Dakar',
    description:
      'Chariot gourmand mobile, Cake Bar à composer minute et bar à boissons fraîches pour anniversaires et célébrations inoubliables à Dakar.',
    url: 'https://www.monsolly.com',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/solly-assets/01-accueil/hero-cart.png',
        width: 1280,
        height: 853,
        alt: 'Chariot gourmand jaune officiel Solly à Dakar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLLY | Chariot Gourmand & Animation Anniversaire Enfant à Dakar',
    description:
      'L’expérience gourmande mobile n°1 à Dakar pour anniversaires d’enfants, baby showers et événements.',
    images: ['/images/solly-assets/01-accueil/hero-cart.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon-32.png?v=2', type: 'image/png', sizes: '32x32' },
      { url: '/icon-16.png?v=2', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png?v=2', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico?v=2'],
  },
  manifest: '/site.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FoodEstablishment', 'EventVenue'],
  name: 'SOLLY — Chariot Gourmand & Animations Événementielles Dakar',
  alternateName: 'Solly Dakar',
  description:
    'Service de chariot gourmand et animation originale pour anniversaires d’enfants, baptêmes, baby showers et événements d’entreprise à Dakar. Cake Bar à composer minute, bar à boissons fraîches artisanales et bar à charcuterie.',
  url: 'https://www.monsolly.com',
  telephone: '+221776900458',
  email: 'hello@monsolly.com',
  priceRange: '80000 FCFA - 150000 FCFA',
  currenciesAccepted: 'XOF',
  paymentAccepted: 'Cash, Wave, Orange Money, Virement',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dakar',
    addressRegion: 'Dakar',
    addressCountry: 'SN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '14.7167',
    longitude: '-17.4677',
  },
  areaServed: [
    { '@type': 'City', name: 'Dakar' },
    { '@type': 'AdministrativeArea', name: 'Almadies' },
    { '@type': 'AdministrativeArea', name: 'Plateau' },
    { '@type': 'AdministrativeArea', name: 'Ngor' },
    { '@type': 'AdministrativeArea', name: 'Point E' },
    { '@type': 'AdministrativeArea', name: 'Mamelles' },
    { '@type': 'AdministrativeArea', name: 'Mermoz' },
    { '@type': 'AdministrativeArea', name: 'Ouakam' },
  ],
  servesCuisine: ['Cake Bar', 'Pâtisserie minute', 'Jus locaux frais', 'Charcuterie & Apéritif'],
  image: 'https://www.monsolly.com/images/solly-assets/01-accueil/hero-cart.png',
  logo: 'https://www.monsolly.com/images/solly-logo.png',
  sameAs: ['https://www.instagram.com/monsolly'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Formules & Prestations Solly Dakar',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Animation originale anniversaire enfant Dakar — Chariot Cake Bar',
          description:
            'Chariot événementiel avec barquettes de gâteaux, bases vanille et chocolat, sauces gourmandes et toppings au choix, servi et animé par l’équipe Solly.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Chariot événement & Chariot gourmand anniversaire Dakar',
          description:
            'Chariot festif jaune Solly décoré et personnalisable aux couleurs et thèmes de votre fête ou célébration.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Expérience gourmande chariot Dakar — Bar à boissons fraîches',
          description:
            'Bissap glacé infusé aux fleurs d’hibiscus, jus d’ananas pressé et cocktail rafraîchissant gingembre-agrumes servis au chariot.',
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${quicksand.variable} ${fredoka.variable} ${caveat.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-solly-cream text-solly-charcoal antialiased selection:bg-solly-pink/20 selection:text-solly-charcoal text-[15px] sm:text-[16px] leading-relaxed">
        <BookingProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
