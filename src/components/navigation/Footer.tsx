'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';
import { useBooking } from '@/context/BookingContext';

export function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="bg-solly-cream border-t border-solly-border/60 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Tagline / Vision */}
          <div className="text-center md:text-left text-xs sm:text-sm text-solly-charcoal/70 leading-snug">
            <p className="font-semibold text-solly-charcoal">Des événements</p>
            <p>plus gourmands, toujours.</p>
            <p className="text-xs text-solly-muted mt-1">Dakar, Sénégal</p>
          </div>

          {/* Center: Official Logo & Contact Actions */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Link href="/" className="transition-transform hover:scale-105">
              <SollyLogo height={34} />
            </Link>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium">
              La beauté en bouchées.
            </p>

            {/* Email & Contacter par WhatsApp button */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <a
                href="mailto:hello@monsolly.com"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-solly-border text-xs font-bold text-solly-charcoal hover:border-solly-pink/40 hover:text-solly-pink transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-solly-pink" />
                <span>hello@monsolly.com</span>
              </a>

              <button
                type="button"
                onClick={() => openBooking()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                <span>Contacter par WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right: Sparkle + Dakar plus sucré */}
          <div className="flex items-center gap-2 text-center md:text-right">
            <Sparkle size={14} color="#DE1B52" />
            <div className="font-handwriting text-lg sm:text-xl text-solly-charcoal leading-none">
              Dakar<br />plus sucré ♡
            </div>
          </div>
        </div>

        {/* Bottom copyright & phone */}
        <div className="mt-8 pt-6 border-t border-solly-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-solly-muted gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SOLLY. Tous droits réservés.</p>
          <p>Service client & réservations : +221 77 690 04 58</p>
        </div>
      </div>
    </footer>
  );
}
