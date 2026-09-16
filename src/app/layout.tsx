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
  title: 'SOLLY — La beauté en bouchées | Bars gourmands à Dakar',
  description:
    'Expérience chariot gourmand haut de gamme pour anniversaires d’enfants, baby showers, fêtes de famille et événements d’entreprise. Cake Bar, Bar à boissons fraîches et Bar salé.',
  keywords: [
    'Solly',
    'chariot gourmand',
    'food cart',
    'anniversaire enfant',
    'Cake Bar',
    'bar à boissons',
    'charcuterie',
    'Dakar',
    'La beauté en bouchées',
  ],
  openGraph: {
    title: 'SOLLY — La beauté en bouchées',
    description: 'Chariot gourmand modulaire et raffiné pour célébrations d’exception à Dakar.',
    url: 'https://www.monsolly.com',
    siteName: 'SOLLY',
    locale: 'fr_FR',
    type: 'website',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${quicksand.variable} ${fredoka.variable} ${caveat.variable}`}>
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
