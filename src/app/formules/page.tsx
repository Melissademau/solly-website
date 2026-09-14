'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SollyCtaBanner } from '@/components/ui/SollyCtaBanner';
import { useBooking } from '@/context/BookingContext';

export default function FormulesPage() {
  const { openBooking } = useBooking();

  return (
    <div className="pt-32 pb-0 flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-solly-yellow/30 text-solly-charcoal border border-solly-yellow/40 shadow-2xs mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Tarification de Lancement
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-solly-charcoal tracking-tight max-w-3xl mx-auto">
          Nos Formules Événements
        </h1>
        <p className="mt-4 text-base sm:text-lg text-solly-muted max-w-2xl mx-auto leading-relaxed">
          Une tarification transparente et clé en main, conçue pour vous apporter sérénité et enchantement le jour J.
        </p>
      </div>

      {/* Main Pricing Presentation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solly-border shadow-solly-card relative overflow-hidden">
          {/* Subtle accent badge */}
          <div className="absolute top-6 right-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-solly-pink/15 text-solly-pink border border-solly-pink/30">
              Offre Officielle
            </span>
          </div>

          <div className="max-w-xl">
            <span className="text-xs uppercase font-bold tracking-widest text-solly-muted">
              Base de départ pour votre célébration
            </span>
            <div className="text-4xl sm:text-6xl font-black text-solly-charcoal mt-2 mb-4 tracking-tight">
              À partir de 80 000 FCFA
            </div>
            <p className="text-base text-solly-muted leading-relaxed mb-8">
              Chaque événement étant unique, notre devis final s'adapte fidèlement à votre sélection d'expériences (Cake Bar, Boissons, Charcuterie), au nombre précis d'invités et aux options de personnalisation.
            </p>
          </div>

          {/* Inclusions checklist */}
          <div className="border-t border-solly-border/70 pt-8 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-solly-charcoal mb-4">
              Ce que comprend chaque formule Solly :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-solly-charcoal">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mise à disposition du chariot modulaire avec son parasol à franges</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Service et animation soignée par notre équipe durant l'événement</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Présentation esthétique dans des barquettes et contenants individuels</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Installation, démontage et gestion de la propreté du stand</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Option de personnalisation du panneau frontal (thème ou logo)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ingrédients frais de première qualité rigoureusement sélectionnés</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                openBooking({
                  packageType: "Formule Événement clé en main (à partir de 80 000 FCFA)",
                })
              }
              icon={<Sparkles className="w-5 h-5" />}
            >
              Demander un devis personnalisé
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                openBooking({
                  experience: 'Souhaite être conseillé',
                  packageType: "Demande de conseil personnalisé",
                })
              }
            >
              Être conseillé
            </Button>
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center">
          <div className="p-5 rounded-2xl bg-solly-cream-card border border-solly-border">
            <ShieldCheck className="w-6 h-6 text-solly-pink mx-auto mb-2" />
            <h4 className="font-bold text-solly-charcoal text-sm">Hygiène & Rigueur</h4>
            <p className="text-xs text-solly-muted mt-1">Normes d'hygiène alimentaire et dressage impeccable.</p>
          </div>
          <div className="p-5 rounded-2xl bg-solly-cream-card border border-solly-border">
            <Sparkles className="w-6 h-6 text-solly-yellow mx-auto mb-2" />
            <h4 className="font-bold text-solly-charcoal text-sm">Esthétique Signature</h4>
            <p className="text-xs text-solly-muted mt-1">Un chariot photogénique qui sublime vos souvenirs.</p>
          </div>
          <div className="p-5 rounded-2xl bg-solly-cream-card border border-solly-border">
            <HeartHandshake className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-solly-charcoal text-sm">Accompagnement</h4>
            <p className="text-xs text-solly-muted mt-1">Conseils personnalisés pour adapter l'offre à vos invités.</p>
          </div>
        </div>
      </div>

      {/* Conversion Banner */}
      <SollyCtaBanner className="mt-20 sm:mt-24" />
    </div>
  );
}
