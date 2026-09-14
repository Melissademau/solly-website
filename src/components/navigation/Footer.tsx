import React from 'react';
import Link from 'next/link';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';

export function Footer() {
  return (
    <footer className="bg-solly-cream border-t border-solly-border/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Tagline / Vision */}
        <div className="text-center sm:text-left text-xs sm:text-sm text-solly-charcoal/70 leading-snug">
          <p>Des événements</p>
          <p>plus gourmands, toujours.</p>
        </div>

        {/* Center: Official Logo & Tagline */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <SollyLogo height={32} />
          </Link>
          <p className="text-xs sm:text-sm text-solly-charcoal/80 mt-1 font-medium">
            La beauté en bouchées.
          </p>
        </div>

        {/* Right: Sparkle + Handwritten City Accent */}
        <div className="flex items-center gap-2 text-right">
          <Sparkle size={14} color="#DE1B52" />
          <div className="font-handwriting text-lg sm:text-xl text-solly-charcoal leading-none">
            Dakar<br />plus sucré ♡
          </div>
        </div>
      </div>
    </footer>
  );
}
