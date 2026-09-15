'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, CheckCircle2, ShieldCheck, ArrowLeft, HeartHandshake } from 'lucide-react';
import { GamifiedBookingFlow } from '@/components/booking/GamifiedBookingFlow';

export default function ReservationPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-solly-yellow/30 text-solly-charcoal border border-solly-yellow/40 shadow-2xs mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-solly-charcoal" />
            Réservation en ligne
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-solly-charcoal tracking-tight">
            Composez & Réservez votre bar
          </h1>

          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-solly-muted max-w-lg mx-auto">
            Renseignez votre projet en quelques clics ludiques. Formules clés en main à partir de 80 000 FCFA avec réponse sous 24h.
          </p>
        </div>

        {/* Gamified Flow Component */}
        <div className="w-full">
          <GamifiedBookingFlow isInline={true} />
        </div>

        {/* Guarantees & Reassurance */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-solly-border/70 flex items-center justify-center gap-2 text-xs font-bold text-solly-charcoal shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Devis gratuit sous 24h</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-solly-border/70 flex items-center justify-center gap-2 text-xs font-bold text-solly-charcoal shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-solly-pink shrink-0" />
            <span>Sans engagement direct</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-solly-border/70 flex items-center justify-center gap-2 text-xs font-bold text-solly-charcoal shadow-2xs">
            <HeartHandshake className="w-4 h-4 text-solly-yellow shrink-0" />
            <span>Accompagnement dédié</span>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-solly-muted hover:text-solly-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
