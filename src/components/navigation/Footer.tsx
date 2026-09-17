'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';
import { useBooking } from '@/context/BookingContext';

export function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="bg-solly-cream border-t border-solly-border/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Row 1: Brand & Tagline on Left | Dakar plus sucré on Right */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand & Vision */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="transition-transform hover:scale-105 inline-block mb-1">
              <SollyLogo height={30} />
            </Link>
            <p className="text-xs sm:text-sm font-bold text-solly-charcoal/90">
              La beauté en bouchées.
            </p>
            <p className="text-[11px] text-solly-muted">Des événements plus gourmands • Dakar</p>
          </div>

          {/* Right: Sparkle + Dakar plus sucré */}
          <div className="flex items-center gap-2 text-right shrink-0">
            <Sparkle size={14} color="#DE1B52" />
            <div className="font-handwriting text-base sm:text-xl text-solly-charcoal leading-tight">
              Dakar<br />plus sucré ♡
            </div>
          </div>
        </div>

        {/* Row 2: Action Buttons (Distributed de part et d'autre on mobile & desktop) */}
        <div className="pt-2 border-t border-solly-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left action: Email */}
          <div className="flex justify-start">
            <a
              href="mailto:hello@monsolly.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border border-solly-border text-xs font-bold text-solly-charcoal hover:border-solly-pink/40 hover:text-solly-pink transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-solly-pink" />
              <span>hello@monsolly.com</span>
            </a>
          </div>

          {/* Right action: Contacter par WhatsApp */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => openBooking()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
              <span>Contacter par WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Row 3: Bottom info (Copyright on Left | Phone on Right) */}
        <div className="pt-4 border-t border-solly-border/40 flex items-center justify-between text-[11px] text-solly-muted gap-2">
          <p className="text-left font-medium">© {new Date().getFullYear()} SOLLY</p>
          <p className="text-right font-semibold text-solly-charcoal/80">
            <span className="hidden sm:inline">Réservations : </span>+221 77 690 04 58
          </p>
        </div>

        {/* Row 4: Mentions Légales, CGV & Remboursement */}
        <div className="pt-3 border-t border-solly-border/30 flex flex-col sm:flex-row items-center sm:justify-between text-[11px] text-solly-muted gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <Link
              href="/cgv"
              className="hover:text-solly-pink transition-colors font-medium hover:underline"
            >
              CGV
            </Link>
            <span className="text-solly-border">•</span>
            <Link
              href="/mentions-legales"
              className="hover:text-solly-pink transition-colors font-medium hover:underline"
            >
              Mentions Légales
            </Link>
            <span className="text-solly-border">•</span>
            <Link
              href="/politique-de-remboursement"
              className="hover:text-solly-pink transition-colors font-medium hover:underline"
            >
              Politique de Remboursement
            </Link>
          </div>
          <p className="text-[10px] text-solly-muted/80">
            Dakar, Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}
