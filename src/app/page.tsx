'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SollyImage } from '@/components/ui/SollyImage';
import { Sparkle, BurstDoodle, ScallopEdge } from '@/components/ui/Doodles';
import { SollyCtaBanner } from '@/components/ui/SollyCtaBanner';
import { SOLLY_IMAGES } from '@/data/images';
import { useBooking } from '@/context/BookingContext';

export default function HomePage() {
  const { openBooking } = useBooking();

  return (
    <div className="flex flex-col min-h-screen bg-solly-cream">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-6 sm:pt-32 sm:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Column: Copy & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left z-10"
            >
              {/* Category Eyebrow */}
              <p className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-solly-charcoal/90 mb-4">
                Bars gourmands à Dakar
              </p>

              {/* Main Headline with Pink Sparkle ✦ */}
              <div className="relative mb-5">
                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[70px] xl:text-[76px] text-solly-pink leading-[1.02] tracking-tight">
                  La beauté <br />
                  en bouchées.
                </h1>
                <div className="absolute top-1 sm:top-2 -right-8 sm:-right-9 text-solly-pink select-none pointer-events-none">
                  <Sparkle size={32} color="#DE1B52" />
                </div>
              </div>

              {/* 3-line Subtitle */}
              <p className="text-base sm:text-lg font-semibold text-solly-charcoal max-w-sm mb-7 leading-snug">
                Un joli chariot, des gourmandises <br />
                à composer et des souvenirs <br />
                à partager.
              </p>

              {/* Stacked CTAs + Beside Handwritten Script Note */}
              <div className="flex items-center gap-5 sm:gap-7 w-full sm:w-auto">
                {/* Vertically Stacked Action Buttons */}
                <div className="flex flex-col items-start gap-3 w-full sm:w-auto shrink-0">
                  <Button
                    variant="pink"
                    size="lg"
                    onClick={() => openBooking()}
                    className="!px-7 !py-3.5 text-sm sm:text-base font-bold shadow-solly-pink whitespace-nowrap"
                  >
                    Composer mon événement →
                  </Button>

                  <div className="relative flex items-center">
                    {/* 3 Pink Action Dashes to the left */}
                    <div className="absolute -left-8 -top-0.5 pointer-events-none select-none">
                      <BurstDoodle direction="left" color="#DE1B52" size={26} />
                    </div>
                    <Link href="#bars">
                      <button className="px-7 py-3 text-sm sm:text-base font-bold text-solly-charcoal border border-solly-charcoal rounded-full hover:bg-solly-charcoal/5 transition-colors whitespace-nowrap">
                        Découvrir nos bars
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Casual Handwritten Note with Heart ♡ (Sitting beside stacked buttons) */}
                <div className="font-handwriting text-xl sm:text-2xl xl:text-[26px] text-solly-charcoal leading-tight select-none rotate-[-5deg]">
                  Plus <br />
                  de gourmandise <br />
                  dans vos beaux <br />
                  moments ! ♡
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Real Cart Image with seamless blend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 xl:col-span-7 relative"
            >
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden">
                {/* Soft gradient fade on the left edge into the cream background */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-solly-cream via-solly-cream/30 to-transparent z-10 pointer-events-none hidden lg:block" />
                <SollyImage
                  src={SOLLY_IMAGES.hero.mainCart.src}
                  alt={SOLLY_IMAGES.hero.mainCart.alt}
                  category="hero"
                  aspectRatioClass="aspect-[16/11]"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SCALLOPED YELLOW RIBBON / TICKER */}
      <section className="relative w-full">
        <ScallopEdge color="#FFD233" height={12} />
        <div className="bg-solly-yellow py-3 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm md:text-base font-bold text-solly-charcoal tracking-wide text-center">
            <Sparkle size={14} color="#2E1C14" />
            <span>Anniversaires</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Baby showers</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Mariages</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Événements d’entreprise</span>
            <Sparkle size={14} color="#2E1C14" />
          </div>
        </div>
      </section>

      {/* 3. SECTION: À chaque envie, son bar gourmand. */}
      <section id="bars" className="py-16 sm:py-24 bg-solly-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading with 3 pink action dashes */}
          <div className="text-center mb-12 sm:mb-14 flex items-center justify-center gap-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
              À chaque envie, son bar gourmand.
            </h2>
            <div className="-mt-3 sm:-mt-4 select-none pointer-events-none">
              <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
            </div>
          </div>

          {/* 3 Experience Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Card 1: Cake Bar */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-full rounded-[22px] overflow-hidden bg-[#FDE8EE] p-0 transition-transform duration-300 group-hover:scale-[1.02] shadow-solly-soft">
                <SollyImage
                  src={SOLLY_IMAGES.hero.cakeBarPreview.src}
                  alt={SOLLY_IMAGES.hero.cakeBarPreview.alt}
                  category="cake-bar"
                  aspectRatioClass="aspect-[16/11]"
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="font-display font-black text-xl text-solly-charcoal mt-4">
                Cake Bar
              </h3>
              <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5">
                Des douceurs à composer.
              </p>
              <Link
                href="/experiences#cake-bar"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-solly-pink hover:underline mt-2"
              >
                Découvrir →
              </Link>
            </div>

            {/* Card 2: Bar à boissons */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-full rounded-[22px] overflow-hidden bg-[#FEEED8] p-0 transition-transform duration-300 group-hover:scale-[1.02] shadow-solly-soft">
                <SollyImage
                  src={SOLLY_IMAGES.hero.drinksPreview.src}
                  alt={SOLLY_IMAGES.hero.drinksPreview.alt}
                  category="drinks"
                  aspectRatioClass="aspect-[16/11]"
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="font-display font-black text-xl text-solly-charcoal mt-4">
                Bar à boissons
              </h3>
              <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5">
                Des saveurs qui rassemblent.
              </p>
              <Link
                href="/experiences#boissons"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-solly-pink hover:underline mt-2"
              >
                Découvrir →
              </Link>
            </div>

            {/* Card 3: Bar à charcuterie */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-full rounded-[22px] overflow-hidden bg-[#FFF2CE] p-0 transition-transform duration-300 group-hover:scale-[1.02] shadow-solly-soft">
                <SollyImage
                  src={SOLLY_IMAGES.hero.charcuteriePreview.src}
                  alt={SOLLY_IMAGES.hero.charcuteriePreview.alt}
                  category="charcuterie"
                  aspectRatioClass="aspect-[16/11]"
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="font-display font-black text-xl text-solly-charcoal mt-4">
                Bar à charcuterie
              </h3>
              <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5">
                Des bouchées qui créent du lien.
              </p>
              <Link
                href="/experiences#charcuterie"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-solly-pink hover:underline mt-2"
              >
                Découvrir →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: Votre événement, simplement. (3 STEPS WITH SCALLOP TOP) */}
      <section className="relative w-full">
        <ScallopEdge color="#FCECEF" height={14} />
        <div className="bg-[#FCECEF] py-14 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Heading with 3 pink action dashes */}
            <div className="text-center mb-10 flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal tracking-tight">
                Votre événement, simplement.
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={24} />
              </div>
            </div>

            {/* 3 Steps Horizontal Alignment with vertical dividers */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-solly-pink/20 max-w-4xl mx-auto">
              {/* Step 01 */}
              <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-sm">
                  01
                </div>
                <div className="text-left">
                  <h4 className="font-display font-black text-sm text-solly-charcoal">
                    Choisissez votre bar
                  </h4>
                  <p className="text-xs text-solly-charcoal/80 font-medium mt-0.5">
                    Sélectionnez le ou les bars qui font plaisir.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-sm">
                  02
                </div>
                <div className="text-left">
                  <h4 className="font-display font-black text-sm text-solly-charcoal">
                    Composez vos envies
                  </h4>
                  <p className="text-xs text-solly-charcoal/80 font-medium mt-0.5">
                    Nous vous accompagnons dans les détails.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-sm">
                  03
                </div>
                <div className="text-left">
                  <h4 className="font-display font-black text-sm text-solly-charcoal">
                    On installe, on vous régale
                  </h4>
                  <p className="text-xs text-solly-charcoal/80 font-medium mt-0.5">
                    Le jour J, on s'occupe de tout pour un moment inoubliable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: Un chariot aux couleurs de votre fête. */}
      <section className="py-16 sm:py-24 bg-solly-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Custom Cart Photo with "Joyeux Anniversaire" panel */}
            <div className="lg:col-span-6">
              <div className="rounded-[26px] sm:rounded-[32px] overflow-hidden shadow-solly-soft border border-solly-border bg-white">
                <SollyImage
                  src={SOLLY_IMAGES.hero.customPanel.src}
                  alt={SOLLY_IMAGES.hero.customPanel.alt}
                  category="events"
                  aspectRatioClass="aspect-[16/10]"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Column: Title with Sparkle, subtitle and CTA */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="relative mb-3">
                <h2 className="font-display font-black text-3xl sm:text-4xl text-solly-charcoal tracking-tight leading-tight">
                  Un chariot aux couleurs <br />
                  de votre fête.
                </h2>
                <div className="absolute top-0 -right-8 text-solly-pink select-none pointer-events-none">
                  <Sparkle size={26} color="#DE1B52" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-solly-charcoal/90 font-medium mb-6">
                Prénom, thème ou logo : chaque détail compte.
              </p>

              <button
                onClick={() => openBooking('Souhaite être conseillé')}
                className="text-sm sm:text-base font-bold text-solly-pink hover:underline inline-flex items-center gap-1.5"
              >
                Personnaliser mon événement →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION BANNER */}
      <SollyCtaBanner />
    </div>
  );
}
