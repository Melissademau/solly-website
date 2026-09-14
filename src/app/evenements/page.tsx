'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sparkle, BurstDoodle, ScallopEdge } from '@/components/ui/Doodles';
import { SollyCtaBanner } from '@/components/ui/SollyCtaBanner';
import { useBooking, EventType } from '@/context/BookingContext';

export default function EvenementsPage() {
  const { openBooking } = useBooking();
  const [themeInput, setThemeInput] = useState('');
  const [hasAddedInspiration, setHasAddedInspiration] = useState(false);

  const handleBookEvent = (eventType: EventType, inspiration: string) => {
    openBooking({
      eventType,
      eventInspiration: inspiration,
      packageType: 'L’expérience personnalisée',
    });
  };

  const handlePrepareQuote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    openBooking({
      eventInspiration: themeInput.trim() || 'Thème sur-mesure',
      packageType: 'L’expérience personnalisée (façade & contenants sur-mesure)',
    });
  };

  return (
    <div className="pt-28 sm:pt-36 pb-0 flex flex-col overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Title & Text */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Eyebrow */}
            <span className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest text-solly-charcoal/80 mb-3 block">
              VOS ÉVÉNEMENTS, VOTRE UNIVERS
            </span>

            {/* Headline with 4-point Sparkle */}
            <div className="relative inline-block mb-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-display font-extrabold text-solly-pink leading-[1.08] tracking-tight">
                Votre fête.<br />
                Vos couleurs.<br />
                La touche Solly.
              </h1>
              <Sparkle
                className="absolute -top-2 right-0 sm:-right-4 text-solly-pink animate-pulse"
                size={32}
              />
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-solly-charcoal/85 leading-relaxed font-sans font-medium mb-8 max-w-lg">
              Anniversaire, mariage ou événement d’entreprise : imaginons un bar gourmand qui vous ressemble.
            </p>

            {/* CTA Button with radiating pink dashes on the left */}
            <div className="flex items-center gap-3">
              <BurstDoodle direction="left" size={24} color="#DE1B52" />
              <button
                type="button"
                onClick={() =>
                  openBooking({
                    eventInspiration: "Personnalisation d'événement",
                    packageType: 'L’expérience personnalisée',
                  })
                }
                className="px-8 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Personnaliser mon événement</span>
                <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Photo with "À votre image ♡" sticker badge */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-solly-card border border-solly-border bg-white group aspect-[16/11]">
              <img
                src="/images/solly-assets/06-evenements/chariot-anniversaire-jardin.png"
                alt="Chariot Solly décoré avec façade Joyeux Anniversaire au jardin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* "À votre image ♡" Badge */}
              <div className="absolute top-4 right-4 bg-[#FFF3C4] border border-[#F0DF9B] rounded-2xl px-4 py-2.5 shadow-md text-center font-handwriting text-lg sm:text-xl text-solly-charcoal leading-none select-none rotate-3 backdrop-blur-xs">
                À votre<br />
                image<br />
                <span className="text-base">♡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. YELLOW SCALLOPED TICKER RIBBON */}
      <section className="relative w-full mb-20 sm:mb-24 select-none">
        {/* Top Scallop */}
        <div className="-mb-[1px] relative z-10 leading-none">
          <ScallopEdge color="#FFD233" height={12} />
        </div>

        {/* Yellow Bar */}
        <div className="bg-[#FFD233] py-2.5 sm:py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 sm:gap-8 font-display font-black text-xs sm:text-sm text-solly-charcoal uppercase tracking-widest overflow-x-auto whitespace-nowrap">
            <Sparkle size={14} color="#2E1C14" />
            <span>Anniversaires</span>
            <span className="text-solly-charcoal/40">•</span>
            <span>Baby showers</span>
            <span className="text-solly-charcoal/40">•</span>
            <span>Mariages</span>
            <span className="text-solly-charcoal/40">•</span>
            <span>Entreprises</span>
            <Sparkle size={14} color="#2E1C14" />
          </div>
        </div>

        {/* Bottom Scallop inverted */}
        <div className="rotate-180 -mt-[1px] relative z-10 leading-none">
          <ScallopEdge color="#FFD233" height={12} />
        </div>
      </section>

      {/* 3. SECTION: QUELQUES INSPIRATIONS POUR VOTRE ÉVÉNEMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal tracking-tight">
              Quelques inspirations pour votre événement.
            </h2>
            <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
          </div>
          <p className="text-sm sm:text-base text-solly-muted font-medium">
            Toutes les occasions de se régaler.
          </p>
        </div>

        {/* 2x2 Grid of Cards (Image left, content right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Anniversaires (Noah) */}
          <div className="bg-white rounded-[26px] border border-solly-border shadow-solly-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300 group">
            <div className="sm:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square relative flex-shrink-0 bg-solly-cream">
              <img
                src="/images/solly-assets/06-evenements/chariot-noah.png"
                alt="Chariot anniversaire dinosaure de Noah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col justify-between p-2 sm:py-2 flex-1">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-solly-pink mb-2">
                  Anniversaires
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Des créations ludiques et colorées pour des souvenirs inoubliables.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleBookEvent("Anniversaire d'enfant", "Anniversaires (Enfants - Thème sur-mesure)")}
                className="w-11 h-11 rounded-full border border-solly-pink/30 text-solly-pink flex items-center justify-center hover:bg-solly-pink hover:text-white transition-all duration-200 mt-4 group/btn shadow-2xs self-start cursor-pointer"
                aria-label="Organiser un anniversaire"
              >
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Baby showers (Oh Baby) */}
          <div className="bg-white rounded-[26px] border border-solly-border shadow-solly-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300 group">
            <div className="sm:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square relative flex-shrink-0 bg-solly-cream">
              <img
                src="/images/solly-assets/06-evenements/chariot-oh-baby.png"
                alt="Chariot baby shower Oh Baby au jardin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col justify-between p-2 sm:py-2 flex-1">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-solly-pink mb-2">
                  Baby showers
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Des instants doux et gourmands pour célébrer les belles surprises de la vie.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleBookEvent("Célébration familiale", "Baby showers & Baptêmes")}
                className="w-11 h-11 rounded-full border border-solly-pink/30 text-solly-pink flex items-center justify-center hover:bg-solly-pink hover:text-white transition-all duration-200 mt-4 group/btn shadow-2xs self-start cursor-pointer"
                aria-label="Organiser une baby shower"
              >
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Mariages (A & M) */}
          <div className="bg-white rounded-[26px] border border-solly-border shadow-solly-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300 group">
            <div className="sm:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square relative flex-shrink-0 bg-solly-cream">
              <img
                src="/images/solly-assets/06-evenements/chariot-mariage-am.png"
                alt="Chariot mariage élégant A & M au jardin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col justify-between p-2 sm:py-2 flex-1">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-solly-pink mb-2">
                  Mariages
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Une touche gourmande pour un jour unique, à votre image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleBookEvent("Célébration familiale", "Mariages & Fiançailles")}
                className="w-11 h-11 rounded-full border border-solly-pink/30 text-solly-pink flex items-center justify-center hover:bg-solly-pink hover:text-white transition-all duration-200 mt-4 group/btn shadow-2xs self-start cursor-pointer"
                aria-label="Organiser un mariage"
              >
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Entreprises (Votre logo) */}
          <div className="bg-white rounded-[26px] border border-solly-border shadow-solly-soft p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300 group">
            <div className="sm:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square relative flex-shrink-0 bg-solly-cream">
              <img
                src="/images/solly-assets/06-evenements/chariot-votre-logo.png"
                alt="Chariot Solly personnalisable avec Votre logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col justify-between p-2 sm:py-2 flex-1">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-solly-pink mb-2">
                  Entreprises
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Des expériences gourmandes qui marquent les esprits et renforcent vos liens.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleBookEvent("Événement d'entreprise", "Événements d'entreprise & Corporate")}
                className="w-11 h-11 rounded-full border border-solly-pink/30 text-solly-pink flex items-center justify-center hover:bg-solly-pink hover:text-white transition-all duration-200 mt-4 group/btn shadow-2xs self-start cursor-pointer"
                aria-label="Organiser un événement d'entreprise"
              >
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: LES DÉTAILS QUI CHANGENT TOUT */}
      <section className="relative w-full mb-20 sm:mb-24">
        {/* Top Scalloped Edge */}
        <div className="-mb-[1px] relative z-10 leading-none">
          <ScallopEdge color="#FCECEF" height={16} />
        </div>

        <div className="bg-[#FCECEF] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="flex items-center justify-center gap-2 mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal tracking-tight">
                Les détails qui changent tout.
              </h2>
              <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
            </div>

            {/* 3 Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: La façade */}
              <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-solly-border shadow-solly-soft flex flex-col group">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-solly-cream mb-4">
                  <img
                    src="/images/solly-assets/06-evenements/panneau-joyeux-anniversaire.png"
                    alt="Panneau Solly rose Joyeux Anniversaire avec rubans"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-display font-extrabold text-solly-charcoal text-lg sm:text-xl mb-1.5">
                  La façade du chariot
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Un design à votre image : prénom, initiales, logo ou thème.
                </p>
              </div>

              {/* Card 2: Les contenants */}
              <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-solly-border shadow-solly-soft flex flex-col group">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-solly-cream mb-4">
                  <img
                    src="/images/solly-assets/06-evenements/contenants-noah.png"
                    alt="Contenants personnalisés Noah avec gâteau et gobelet Solly"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-display font-extrabold text-solly-charcoal text-lg sm:text-xl mb-1.5">
                  Les contenants
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Des contenants personnalisés pour une expérience encore plus unique.
                </p>
              </div>

              {/* Card 3: La carte gourmande */}
              <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-solly-border shadow-solly-soft flex flex-col group">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-solly-cream mb-4">
                  <img
                    src="/images/solly-assets/06-evenements/menu-fleuri.png"
                    alt="Menu fleuri chevalet et gâteau aux marshmallows"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-display font-extrabold text-solly-charcoal text-lg sm:text-xl mb-1.5">
                  La carte gourmande
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                  Une carte adaptée à votre événement, aux saveurs de votre choix.
                </p>
              </div>
            </div>

            {/* Note caption */}
            <p className="text-center text-xs sm:text-sm text-solly-muted font-medium mt-8">
              Personnalisation en option, selon votre projet.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION: UN MÊME CHARIOT. MILLE FAÇONS DE LE PERSONNALISER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Photo of Three Panels */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-solly-card border border-solly-border bg-white group aspect-[3/2]">
              <img
                src="/images/solly-assets/06-evenements/trois-panneaux.png"
                alt="Trois panneaux Solly pastel interchangeables (Anniversaire, Solly+, Votre logo)"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>

          {/* Right Column: Text & Action Button */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="relative inline-block mb-3">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold text-solly-pink leading-[1.12] tracking-tight">
                Un même chariot.<br />
                Mille façons de le personnaliser.
              </h2>
              <Sparkle
                className="absolute -top-2 right-0 sm:-right-4 text-solly-pink animate-pulse"
                size={28}
              />
            </div>

            <p className="text-base sm:text-lg text-solly-charcoal/85 leading-relaxed font-sans font-medium mb-8">
              Un prénom, des initiales, un logo ou un thème : nous adaptons la façade et les contenants à votre occasion.
            </p>

            <button
              type="button"
              onClick={() =>
                openBooking({
                  packageType: 'L’expérience personnalisée (façade sur-mesure)',
                  eventInspiration: 'Personnalisation façade & chariot',
                })
              }
              className="px-8 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Imaginer ma personnalisation</span>
              <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. SECTION INTERACTIVE: VOUS AVEZ DÉJÀ UNE IDÉE ? */}
      <section className="relative w-full mb-0">
        {/* Top Scalloped Edge */}
        <div className="-mb-[1px] relative z-10 leading-none">
          <ScallopEdge color="#FCECEF" height={16} />
        </div>

        <div className="bg-[#FCECEF] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title with Doodle */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal tracking-tight">
                Vous avez déjà une idée ?
              </h2>
              <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
            </div>

            <p className="text-sm sm:text-base text-solly-muted font-medium mb-8">
              Partagez votre thème, vos couleurs ou une image d’inspiration.
            </p>

            {/* Input card */}
            <form onSubmit={handlePrepareQuote} className="space-y-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-solly-border shadow-solly-soft p-3.5 sm:p-5 text-left transition-focus">
                <label
                  htmlFor="event-theme"
                  className="block text-xs font-bold uppercase tracking-wider text-solly-charcoal/70 mb-1"
                >
                  Votre thème ou vos envies
                </label>
                <input
                  id="event-theme"
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="Ex. : dinosaures, rose poudré, lancement de marque..."
                  className="w-full bg-transparent text-sm sm:text-base text-solly-charcoal font-medium placeholder:text-solly-charcoal/40 focus:outline-none py-1"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                {/* Upload / Inspiration button */}
                <button
                  type="button"
                  onClick={() => {
                    setHasAddedInspiration(true);
                    openBooking({
                      eventInspiration: themeInput.trim() || 'Inspiration visuelle partagée',
                      packageType: 'L’expérience personnalisée',
                    });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white border-2 border-solly-pink text-solly-pink font-display font-bold text-sm sm:text-base hover:bg-solly-pink hover:text-white transition-all duration-200 shadow-2xs inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-solly-pink group-hover:text-white transition-colors" />
                  <span>{hasAddedInspiration ? 'Inspiration ajoutée ✓' : 'Ajouter une inspiration'}</span>
                </button>

                {/* Prepare Quote button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Préparer mon devis</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 7. SIGNATURE PINK SCALLOPED CTA BANNER */}
      <SollyCtaBanner
        title="Et si on donnait vos couleurs à Solly ?"
        buttonText="Demander mon devis personnalisé"
      />
    </div>
  );
}
