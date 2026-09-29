'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SollyImage } from '@/components/ui/SollyImage';
import { Sparkle, BurstDoodle, ScallopEdge } from '@/components/ui/Doodles';
import { SollyCtaBanner } from '@/components/ui/SollyCtaBanner';
import { useBooking } from '@/context/BookingContext';

const CAKE_ASSETS = {
  hero: {
    src: '/images/solly-assets/02-cake-bar/gateau-noah.jpg',
    alt: 'Gâteau personnalisé Noah avec guimauves, dinosaures et gobelet Solly',
  },
  packageSolly: {
    src: '/images/cake-bar/cake-bar-two-cakes.jpg',
    alt: 'Deux gâteaux individuels Solly garnis de fruits frais et chantilly avec drapeaux Solly',
  },
};

const CHARCUTERIE_ASSETS = {
  hero: {
    src: '/images/solly-assets/04-charcuterie/aperitif-gourmand.png',
    alt: 'Grand apéritif gourmand Solly avec cornets et pots salés',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Combien d’invités minimum pour une prestation Solly ?',
    answer:
      'Notre formule de base commence à partir de 20 invités (80 000 FCFA). Nous nous déplaçons pour des événements privés et d’entreprise de 20 à plusieurs centaines de personnes.',
  },
  {
    question: 'Comment mes invités sont-ils servis le jour de l’événement ?',
    answer:
      'Notre équipe arrive avec le chariot Solly équipé, installe le stand et assure le service en direct. Chaque invité choisit ses garnitures préférées pour une dégustation minute personnalisée.',
  },
  {
    question: 'Peut-on combiner plusieurs bars lors d’un même événement ?',
    answer:
      'Oui ! Vous pouvez choisir un bar principal inclus dans votre forfait (Mini Pancakes, Croffles, Cake Bar ou Charcuterie) et ajouter un ou plusieurs bars complémentaires pour varier les plaisirs salés et sucrés.',
  },
  {
    question: 'Le chariot peut-il être personnalisé à notre thème ou marque ?',
    answer:
      'Absolument. Nous proposons des façades interchangeables imprimées au prénom de l’enfant, au thème de la fête ou au logo de votre entreprise, ainsi que des supports et emballages assortis.',
  },
  {
    question: 'Comment se passe la réservation et le paiement ?',
    answer:
      'Vous envoyez votre demande sur le site en indiquant vos envies et votre budget. Notre équipe vous contacte sur WhatsApp pour confirmer les disponibilités. Un acompte de 70% bloque définitivement votre date, et le solde de 30% est réglé à J-2 de la prestation.',
  },
];

export default function ExperiencesPage() {
  const { openBooking } = useBooking();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleAddToBooking = (experienceName?: string) => {
    openBooking(experienceName || 'Cake Bar');
  };

  return (
    <div className="flex flex-col min-h-screen bg-solly-cream">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-6 sm:pt-32 sm:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Column: Copy & Action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left z-10"
            >
              {/* Category Eyebrow */}
              <p className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-solly-charcoal/90 mb-4">
                Expériences gourmandes & bars à thème à Dakar
              </p>

              {/* Main Headline with Pink Sparkle ✦ */}
              <div className="relative mb-5">
                <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[64px] xl:text-[70px] text-solly-pink leading-[1.04] tracking-tight">
                  Choisissez votre <br />
                  expérience Solly.
                </h1>
                <div className="absolute top-1 sm:top-2 -right-8 sm:-right-9 text-solly-pink select-none pointer-events-none">
                  <Sparkle size={32} color="#DE1B52" />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg font-semibold text-solly-charcoal max-w-md mb-2 leading-snug">
                Un bar gourmand à partir de 4 000 FCFA / invité. À vous de choisir celui qui accompagnera votre événement à Dakar.
              </p>
              <p className="text-xs sm:text-sm font-bold text-solly-charcoal/70 mb-8 uppercase tracking-wider">
                ✦ Minimum 20 invités
              </p>

              {/* CTA with 3 pink action dashes to the left */}
              <div className="relative flex items-center">
                <div className="absolute -left-8 -top-0.5 pointer-events-none select-none">
                  <BurstDoodle direction="left" color="#DE1B52" size={26} />
                </div>
                <Button
                  variant="pink"
                  size="lg"
                  onClick={() => handleAddToBooking()}
                  className="!px-7 !py-3.5 text-sm sm:text-base font-bold shadow-solly-pink whitespace-nowrap"
                >
                  Réserver mon événement →
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Hero Real Cakes Image + Floating Price Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 xl:col-span-7 relative"
            >
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden">
                {/* Floating Handwritten Price Badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-center select-none pointer-events-none">
                  <div className="font-handwriting text-base sm:text-lg font-bold text-solly-charcoal leading-tight rotate-[6deg] text-center drop-shadow-sm bg-solly-cream/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-solly-charcoal/10 shadow-xs">
                    À partir de <br />
                    <span className="text-solly-pink font-black text-lg sm:text-xl">4 000 FCFA</span> <br />
                    <span className="text-[11px] sm:text-xs text-solly-charcoal/70">/ invité</span>
                  </div>
                  <div className="-mt-1">
                    <BurstDoodle direction="top-right" color="#2E1C14" size={18} />
                  </div>
                </div>

                {/* Soft gradient fade on left edge */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-solly-cream via-solly-cream/30 to-transparent z-10 pointer-events-none hidden lg:block" />

                <SollyImage
                  src={CAKE_ASSETS.hero.src}
                  alt={CAKE_ASSETS.hero.alt}
                  category="cake-bar"
                  aspectRatioClass="aspect-[4/3]"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SCALLOPED YELLOW RIBBON */}
      <section className="relative w-full">
        <ScallopEdge color="#FFD233" height={12} />
        <div className="bg-solly-yellow py-3 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm md:text-base font-bold text-solly-charcoal tracking-wide text-center">
            <Sparkle size={14} color="#2E1C14" />
            <span>Moelleux</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Crémeux</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>Croquant</span>
            <span className="text-solly-charcoal/40 hidden sm:inline">•</span>
            <span>À votre goût</span>
            <Sparkle size={14} color="#2E1C14" />
          </div>
        </div>
      </section>

      {/* 3. PACKAGES SECTION: Choisissez votre bar principal */}
      <section id="formules" className="relative w-full py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-solly-pink/10 text-solly-pink text-xs font-bold uppercase tracking-wider mb-3">
              <span>Mini Pancakes · Croffles · Cake Bar · Charcuterie</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Choisissez votre bar principal
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-solly-charcoal/80 mt-2 max-w-xl mx-auto">
              Votre bar gourmand, préparé minute. Le bar principal est compris dans notre tarif de base à 4 000 FCFA / invité (minimum 20 invités), chariot et service inclus.
            </p>
          </div>

          {/* 4 Packages Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {/* Card 1: Mini Pancakes */}
            <div id="mini-pancakes" className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between relative scroll-mt-24">
              <div>
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-[#FFF3D6] mb-4 relative">
                  <span className="absolute top-2.5 left-2.5 z-10 bg-solly-yellow text-solly-charcoal text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Nouveau
                  </span>
                  <SollyImage
                    src="/images/mini-pancakes/pancakes-preview.webp"
                    alt="Mini pancakes préparés minute Solly"
                    category="cake-bar"
                    aspectRatioClass="aspect-[4/3]"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="text-left mb-5">
                  <h3 className="font-display font-black text-xl text-solly-pink">
                    Mini Pancakes
                  </h3>
                  <div className="mt-1 mb-3">
                    <p className="text-xs font-bold text-solly-charcoal">
                      Compris : <span className="text-solly-pink font-black">4 000 FCFA</span> / invité
                    </p>
                    <span className="inline-block text-[10px] font-bold text-solly-charcoal/60 uppercase tracking-wide">
                      Minimum 20 invités
                    </span>
                  </div>
                  <p className="text-xs text-solly-charcoal/85 mb-3 leading-relaxed font-medium">
                    Des mini pancakes préparés minute, moelleux et généreusement nappés.
                  </p>
                  <ul className="space-y-1.5 text-xs font-semibold text-solly-charcoal/90">
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Cuisson & service minute au chariot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Sauces chaudes & toppings au choix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Chariot & service inclus</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                variant="pink"
                size="md"
                fullWidth
                onClick={() => handleAddToBooking('Mini Pancakes')}
                className="!py-2.5 text-xs sm:text-sm font-bold"
              >
                Choisir Mini Pancakes →
              </Button>
            </div>

            {/* Card 2: Croffles */}
            <div id="croffles" className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between relative scroll-mt-24">
              <div>
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-[#FEEED8] mb-4 relative">
                  <span className="absolute top-2.5 left-2.5 z-10 bg-solly-yellow text-solly-charcoal text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Nouveau
                  </span>
                  <SollyImage
                    src="/images/croffles/croffle-preview.webp"
                    alt="Croffles dorés croustillants Solly"
                    category="cake-bar"
                    aspectRatioClass="aspect-[4/3]"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="text-left mb-5">
                  <h3 className="font-display font-black text-xl text-solly-pink">
                    Croffles
                  </h3>
                  <div className="mt-1 mb-3">
                    <p className="text-xs font-bold text-solly-charcoal">
                      Compris : <span className="text-solly-pink font-black">4 000 FCFA</span> / invité
                    </p>
                    <span className="inline-block text-[10px] font-bold text-solly-charcoal/60 uppercase tracking-wide">
                      Minimum 20 invités
                    </span>
                  </div>
                  <p className="text-xs text-solly-charcoal/85 mb-3 leading-relaxed font-medium">
                    Le croissant rencontre la gaufre : croustillant, caramélisé et servi chaud.
                  </p>
                  <ul className="space-y-1.5 text-xs font-semibold text-solly-charcoal/90">
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Croffles dorés et croustillants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Sauces fondantes & toppings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Chariot & service inclus</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                variant="pink"
                size="md"
                fullWidth
                onClick={() => handleAddToBooking('Croffles')}
                className="!py-2.5 text-xs sm:text-sm font-bold"
              >
                Choisir les Croffles →
              </Button>
            </div>

            {/* Card 3: Cake Bar */}
            <div id="cake-bar" className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between scroll-mt-24">
              <div>
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-solly-cream/50 mb-4">
                  <SollyImage
                    src={CAKE_ASSETS.packageSolly.src}
                    alt={CAKE_ASSETS.packageSolly.alt}
                    category="cake-bar"
                    aspectRatioClass="aspect-[4/3]"
                    className="w-full h-full object-cover object-[center_60%]"
                  />
                </div>
                <div className="text-left mb-5">
                  <h3 className="font-display font-black text-xl text-solly-pink">
                    Cake Bar
                  </h3>
                  <div className="mt-1 mb-3">
                    <p className="text-xs font-bold text-solly-charcoal">
                      Compris : <span className="text-solly-pink font-black">4 000 FCFA</span> / invité
                    </p>
                    <span className="inline-block text-[10px] font-bold text-solly-charcoal/60 uppercase tracking-wide">
                      Minimum 20 invités
                    </span>
                  </div>
                  <p className="text-xs text-solly-charcoal/85 mb-3 leading-relaxed font-medium">
                    Des cakes moelleux vanille & chocolat découpés et nappés minute au chariot.
                  </p>
                  <ul className="space-y-1.5 text-xs font-semibold text-solly-charcoal/90">
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Bases moelleuses vanille & chocolat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Sauces fondantes & toppings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Chariot & service inclus</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                variant="pink"
                size="md"
                fullWidth
                onClick={() => handleAddToBooking('Cake Bar')}
                className="!py-2.5 text-xs sm:text-sm font-bold"
              >
                Choisir le Cake Bar →
              </Button>
            </div>

            {/* Card 4: Bar à Charcuterie */}
            <div id="charcuterie" className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between scroll-mt-24">
              <div>
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-[#F5EFE6] mb-4">
                  <SollyImage
                    src={CHARCUTERIE_ASSETS.hero.src}
                    alt={CHARCUTERIE_ASSETS.hero.alt}
                    category="charcuterie"
                    aspectRatioClass="aspect-[4/3]"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="text-left mb-5">
                  <h3 className="font-display font-black text-xl text-solly-pink">
                    Charcuterie
                  </h3>
                  <div className="mt-1 mb-3">
                    <p className="text-xs font-bold text-solly-charcoal">
                      Compris : <span className="text-solly-pink font-black">4 000 FCFA</span> / invité
                    </p>
                    <span className="inline-block text-[10px] font-bold text-solly-charcoal/60 uppercase tracking-wide">
                      Minimum 20 invités
                    </span>
                  </div>
                  <p className="text-xs text-solly-charcoal/85 mb-3 leading-relaxed font-medium">
                    Une formule salée chic avec charcuteries fines, fromages et crackers.
                  </p>
                  <ul className="space-y-1.5 text-xs font-semibold text-solly-charcoal/90">
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Cornets & pots élégants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Charcuteries, gouda & raisins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-solly-pink font-bold">✓</span>
                      <span>Chariot & service inclus</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                variant="pink"
                size="md"
                fullWidth
                onClick={() => handleAddToBooking('Charcuterie')}
                className="!py-2.5 text-xs sm:text-sm font-bold"
              >
                Choisir le Bar Salé →
              </Button>
            </div>
          </div>

          {/* Formule 2 Bars Banner */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#FFF4F7] rounded-[24px] p-6 sm:p-7 border border-solly-pink/20 shadow-solly-soft flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solly-pink text-white text-xs font-black uppercase tracking-wider mb-2">
                  <span>✦ Formule 2 Bars</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-solly-charcoal">
                  Envie de combiner 2 expériences ?
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/85 font-medium mt-1 max-w-xl">
                  Associez un bar sucré et un bar salé, ou deux douceurs (ex. Mini Pancakes + Cake Bar). Vous pouvez sélectionner plusieurs bars lors de votre demande de devis.
                </p>
              </div>
              <Button
                variant="pink"
                size="md"
                onClick={() => handleAddToBooking('Formule 2 Bars')}
                className="!py-3.5 !px-6 text-sm font-bold whitespace-nowrap shadow-solly-pink shrink-0"
              >
                Réserver une formule 2 bars →
              </Button>
            </div>

            <p className="text-center text-[11px] sm:text-xs text-solly-charcoal/70 font-medium">
              Base minimum 20 invités. Transport calculé selon le lieu. Acompte de 70% à la réservation, solde à J-2.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-white border-t border-solly-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-solly-pink bg-solly-pink-soft px-3.5 py-1 rounded-full mb-3">
              Questions fréquentes
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal">
              Tout ce que vous devez savoir
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-solly-border bg-solly-cream/40 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/80 transition-colors"
                  >
                    <span className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-solly-pink shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CONVERSION BANNER */}
      <SollyCtaBanner
        title="Prêt à imaginer votre fête ?"
        subtitle="Renseignez votre événement, choisissez vos expériences et votre budget en quelques clics."
        buttonText="Réserver mon événement"
      />
    </div>
  );
}
