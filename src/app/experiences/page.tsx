'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, Sparkles, ChevronDown } from 'lucide-react';
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
  preview: {
    src: '/images/solly-assets/02-cake-bar/cake-preview.png',
    alt: 'Cake vanille avec crème fouettée, chocolat, Oreo et vermicelles',
  },
  packageSolly: {
    src: '/images/cake-bar/cake-bar-two-cakes.jpg',
    alt: 'Deux gâteaux individuels Solly garnis de fruits frais et chantilly avec drapeaux Solly',
  },
  packageCustom: {
    src: '/images/solly-assets/02-cake-bar/trois-panneaux.jpg',
    alt: 'Trois panneaux amovibles personnalisés Solly : anniversaire, logo et marque',
  },
  gallery: [
    {
      src: '/images/solly-assets/02-cake-bar/base-chocolat.png',
      title: 'Bases moelleuses',
      desc: 'Vanille parfumée ou chocolat fondant',
    },
    {
      src: '/images/solly-assets/02-cake-bar/sauce-chocolat.png',
      title: 'Sauces gourmandes',
      desc: 'Chocolat chaud, caramel beurre salé, fruits rouges',
    },
    {
      src: '/images/solly-assets/02-cake-bar/topping-oreo.png',
      title: 'Toppings croquants',
      desc: 'Oreo, spéculoos, vermicelles & guimauves',
    },
    {
      src: '/images/solly-assets/02-cake-bar/barquette-standard.png',
      title: 'Barquettes Solly',
      desc: 'Portions individuelles soignées & pratiques',
    },
  ],
};

const DRINK_OPTIONS = [
  {
    id: 'bissap',
    name: 'Bissap glacé',
    desc: 'Infusion d’hibiscus rouge, menthe fraîche et touche de vanille',
    src: '/images/solly-assets/03-boissons/bissap.png',
    alt: 'Bissap glacé traditionnel Solly',
  },
  {
    id: 'ananas',
    name: 'Jus d’ananas frais',
    desc: 'Pur jus d’ananas doux et parfumé au soleil',
    src: '/images/solly-assets/03-boissons/ananas.png',
    alt: 'Jus d’ananas frais pressé Solly',
  },
  {
    id: 'gingembre',
    name: 'Gingembre-agrumes',
    desc: 'Gingembre tonique, oranges douces et pointe de citron vert',
    src: '/images/solly-assets/03-boissons/gingembre.png',
    alt: 'Jus de gingembre pur glacé aux agrumes',
  },
  {
    id: 'passion',
    name: 'Jus orange-passion',
    desc: 'Nectar fruité acidulé aux fruits de la passion exotiques',
    src: '/images/solly-assets/03-boissons/passion.png',
    alt: 'Jus orange-passion glacé Solly',
  },
];

const CHARCUTERIE_ASSETS = {
  hero: {
    src: '/images/solly-assets/04-charcuterie/aperitif-gourmand.png',
    alt: 'Grand apéritif gourmand Solly avec cornets et pots salés',
  },
  gallery: [
    {
      src: '/images/solly-assets/04-charcuterie/cornet.png',
      title: 'Le Cornet chic',
      desc: 'Cône individuel rose élégant à picorer debout',
    },
    {
      src: '/images/solly-assets/04-charcuterie/pot.png',
      title: 'Le Pot gourmand',
      desc: 'Format généreux facile à poser pour trinquer',
    },
    {
      src: '/images/solly-assets/04-charcuterie/salami.png',
      title: 'Salaisons & Fromages',
      desc: 'Rosettes de salami, jambon fin et gouda doré',
    },
    {
      src: '/images/solly-assets/04-charcuterie/bacs-inox.png',
      title: 'Service au chariot',
      desc: 'Bacs inox intégrés et service traiteur soigné',
    },
  ],
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

      {/* Quick Anchor Navigation */}
      <div className="sticky top-16 sm:top-20 z-30 bg-solly-cream/95 backdrop-blur-md border-y border-solly-border/60 py-2.5 px-4 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
          <a
            href="#mini-pancakes"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:bg-white transition-all shrink-0 border border-solly-border/50 bg-white/70 inline-flex items-center gap-1.5"
          >
            <span>🥞 Mini Pancakes</span>
            <span className="bg-solly-yellow text-solly-charcoal text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">Nouveau</span>
          </a>
          <a
            href="#croffles"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:bg-white transition-all shrink-0 border border-solly-border/50 bg-white/70 inline-flex items-center gap-1.5"
          >
            <span>🥐 Croffles</span>
            <span className="bg-solly-yellow text-solly-charcoal text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">Nouveau</span>
          </a>
          <a
            href="#cake-bar"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:bg-white transition-all shrink-0 border border-solly-border/50 bg-white/70"
          >
            🍰 Cake Bar
          </a>
          <a
            href="#charcuterie"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:bg-white transition-all shrink-0 border border-solly-border/50 bg-white/70"
          >
            🧀 Bar salé / Charcuterie
          </a>
          <a
            href="#boissons"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-solly-charcoal hover:text-solly-pink hover:bg-white transition-all shrink-0 border border-solly-border/50 bg-white/70"
          >
            🍹 Boissons Solly
          </a>
        </div>
      </div>

      {/* 3. PACKAGES SECTION: Choisissez votre bar principal */}
      <section id="formules" className="relative w-full py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-solly-pink/10 text-solly-pink text-xs font-bold uppercase tracking-wider mb-3">
              <span>Mini Pancakes · Croffles · Cake Bar · Charcuterie</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2">
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
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between relative">
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
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between relative">
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
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between">
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
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-solly-border shadow-solly-soft flex flex-col justify-between">
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

      {/* 4. MINI PANCAKES SECTION */}
      <section id="mini-pancakes" className="py-16 sm:py-24 bg-solly-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading with Nouveau badge & Burst */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="bg-solly-yellow text-solly-charcoal text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Nouveau
              </span>
              <span className="text-xs font-bold text-solly-pink uppercase tracking-wider">
                Bar gourmand minute
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Les Mini Pancakes Solly
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-sm sm:text-base text-solly-charcoal/80 font-medium mt-2 max-w-2xl mx-auto">
              Des mini pancakes préparés minute, moelleux et généreusement nappés, cuits directement sur la plaque officielle Solly.
            </p>
          </div>

          {/* Real Solly Visuals Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/mini-pancakes/pancakes-service.webp"
                  alt="Préparation et service minute des mini pancakes Solly"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Cuisson minute</p>
                <p className="text-[11px] text-solly-charcoal/70">Dorés sous les yeux des invités</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/mini-pancakes/pancakes-preview.webp"
                  alt="Nappage généreux au chocolat chaud Solly"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Nappages fondants</p>
                <p className="text-[11px] text-solly-charcoal/70">Chocolat, caramel, coulis</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/mini-pancakes/pancakes-toppings.webp"
                  alt="Ajout de toppings frais et croquants"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Toppings au choix</p>
                <p className="text-[11px] text-solly-charcoal/70">Fruits frais & croquants</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/mini-pancakes/pancakes-box.webp"
                  alt="Barquette de mini pancakes prête à déguster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Portions individuelles</p>
                <p className="text-[11px] text-solly-charcoal/70">Boîtes Solly signature</p>
              </div>
            </div>
          </div>

          {/* Presentation Card */}
          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-solly-border shadow-solly-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-solly-charcoal mb-3">
                  Une animation chaude & parfumée
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mb-6 leading-relaxed">
                  Sur le chariot Solly, chaque invité reçoit une barquette de mini pancakes tout chauds et choisit ses nappages et toppings préférés pour une dégustation 100% personnalisée.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍫 Les sauces gourmandes
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Chocolat fondant</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Caramel onctueux</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Coulis fruits rouges</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Lait concentré sucré</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍓 Les toppings croquants & fruités
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Fraises fraîches</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Bananes en rondelles</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Brisures d’Oreo</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Spéculoos</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Mini guimauves</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Vermicelles festifs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solly Cart Image Highlight & CTA */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-solly-soft border border-solly-border mb-4">
                  <img
                    src="/images/mini-pancakes/pancakes-cart.webp"
                    alt="Le chariot Solly avec le bar à mini pancakes"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={() => handleAddToBooking('Mini Pancakes')}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Choisir les Mini Pancakes pour mon événement →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CROFFLES SECTION */}
      <section id="croffles" className="py-16 sm:py-24 bg-[#FFFBF2] border-t border-solly-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading with Nouveau badge & Burst */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="bg-solly-yellow text-solly-charcoal text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Nouveau
              </span>
              <span className="text-xs font-bold text-solly-pink uppercase tracking-wider">
                Croustillant & Doré
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Les Croffles Solly
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-sm sm:text-base text-solly-charcoal/80 font-medium mt-2 max-w-2xl mx-auto">
              Le croissant rencontre la gaufre : croustillant, caramélisé et servi chaud à vos invités.
            </p>
          </div>

          {/* Real Solly Visuals Gallery for Croffles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/croffles/croffle-preview.webp"
                  alt="Croffle croustillant nappé au chocolat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Croffles dorés</p>
                <p className="text-[11px] text-solly-charcoal/70">Caramélisés & croustillants</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/croffles/croffle-texture.webp"
                  alt="Détail du croustillant alvéolé de la gaufre croissant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Pâte feuilletée</p>
                <p className="text-[11px] text-solly-charcoal/70">Beurre fin & alvéoles dorées</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/croffles/croffle-pluie.webp"
                  alt="Sauces et toppings d’accompagnement pour croffles"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Service minute</p>
                <p className="text-[11px] text-solly-charcoal/70">Préparés & garnis en direct</p>
              </div>
            </div>

            <div className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                <img
                  src="/images/croffles/croffle-hero.webp"
                  alt="Planche de croffles généreuse servie au chariot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">Portions généreuses</p>
                <p className="text-[11px] text-solly-charcoal/70">Présentation soignée Solly</p>
              </div>
            </div>
          </div>

          {/* Presentation Card */}
          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-solly-border shadow-solly-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-solly-charcoal mb-3">
                  La tendance gourmande incontournable
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mb-6 leading-relaxed">
                  Pressés au gaufrier en direct sur le chariot, nos croffles offrent le feuilletage croustillant du croissant pur beurre et la texture caramélisée de la gaufre liégeoise.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍫 Coulis fondants
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Chocolat noir fondant</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Caramel beurre salé</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Coulis de framboise</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Miel doux & cannelle</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍓 Toppings croustillants
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Fraises fraîches</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Noisettes torréfiées</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Éclats de spéculoos</span>
                      <span className="px-3 py-1 bg-[#FFFBF2] rounded-full border border-solly-border">Pépites de chocolat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image & CTA */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-solly-soft border border-solly-border mb-4">
                  <img
                    src="/images/croffles/croffle-preview.webp"
                    alt="Bar à croffles au chariot Solly"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={() => handleAddToBooking('Croffles')}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Choisir les Croffles pour mon événement →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CAKE BAR SECTION (Mouth-watering presentation) */}
      <section id="cake-bar" className="py-16 sm:py-24 bg-solly-cream border-t border-solly-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-solly-pink uppercase tracking-wider">
                Bar gourmand signature
              </span>
            </div>
            <div className="inline-flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Le Cake Bar Solly
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1">
              Des gâteaux individuels généreux découpés et nappés à la minute devant vos invités.
            </p>
          </div>

          {/* 4 Visuals Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {CAKE_ASSETS.gallery.map((item) => (
              <div
                key={item.title}
                className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">{item.title}</p>
                  <p className="text-[11px] text-solly-charcoal/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Informative Presentation Card */}
          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-solly-border shadow-solly-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-solly-charcoal mb-3">
                  Une animation pâtissière en direct
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mb-6 leading-relaxed">
                  Sur le chariot Solly, nos pâtissiers découpent chaque portion à la commande. Chaque invité choisit sa base (moelleux vanille ou chocolat noir), son nappage chaud et ses garnitures pour une dégustation gourmande et festive.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍫 Nappages & sauces au choix
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Chocolat fondant</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Caramel beurre salé</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Coulis fruits rouges</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Lait concentré sucré</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍓 Toppings croquants & fruités
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Fraises fraîches</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Mangue dorée</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Brisures d’Oreo</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Spéculoos</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Guimauves</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Vermicelles festifs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Photo & CTA */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-solly-soft border border-solly-border mb-4">
                  <Image
                    src={CAKE_ASSETS.packageSolly.src}
                    alt="Cake Bar Solly prêt pour le service"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-[center_60%]"
                  />
                </div>
                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={() => handleAddToBooking('Cake Bar')}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Choisir le Cake Bar pour mon événement →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CHARCUTERIE SECTION (Mouth-watering presentation) */}
      <section id="charcuterie" className="py-16 sm:py-24 bg-[#FFFBF2] border-t border-solly-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-solly-pink uppercase tracking-wider">
                L’accord salé chic
              </span>
            </div>
            <div className="inline-flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Le Bar à Charcuterie Solly
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1">
              Des cornets apéritifs et pots gourmands raffinés pour trinquer avec élégance.
            </p>
          </div>

          {/* 4 Visuals Gallery for Charcuterie */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {CHARCUTERIE_ASSETS.gallery.map((item) => (
              <div
                key={item.title}
                className="group rounded-[20px] overflow-hidden bg-white border border-solly-border shadow-solly-soft hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-solly-cream">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">{item.title}</p>
                  <p className="text-[11px] text-solly-charcoal/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Presentation Card */}
          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-solly-border shadow-solly-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-solly-charcoal mb-3">
                  Une pause salée chic & conviviale
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mb-6 leading-relaxed">
                  Idéal pour vos cocktails, apéritifs dînatoires ou mariages à Dakar : une sélection généreuse de salaisons de qualité, fromages dorés, olives marinées, fruits frais et crackers croustillants servis dans des contenants élégants.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🧀 Les fromages & salaisons
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Rosettes de salami</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Jambon cuit fin</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Cubes de gouda doré</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Fromage doux</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-solly-pink mb-2">
                      🍇 Les accompagnements croquants & frais
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-solly-charcoal">
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Raisins frais</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Olives marinées</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Mini bretzels dorés</span>
                      <span className="px-3 py-1 bg-solly-cream rounded-full border border-solly-border">Crackers aux graines</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo & CTA */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-solly-soft border border-solly-border mb-4">
                  <Image
                    src={CHARCUTERIE_ASSETS.hero.src}
                    alt="Bar à charcuterie servi au chariot Solly"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={() => handleAddToBooking('Charcuterie')}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Choisir le Bar Salé pour mon événement →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOISSONS SECTION */}
      <section id="boissons" className="py-16 sm:py-24 bg-solly-cream border-t border-solly-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Le Bar à boissons fraîches
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1">
              Option à <span className="text-solly-pink font-bold">+1 000 FCFA / invité</span> à ajouter à votre bar principal : infusions glacées et purs jus servis minute à la fontaine.
            </p>
          </div>

          {/* Grid of 4 Drinks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {DRINK_OPTIONS.map((drink) => (
              <div
                key={drink.id}
                className="group rounded-[22px] p-3 text-left bg-white border border-solly-border shadow-solly-soft hover:border-solly-pink/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-solly-cream/40 mb-3 relative">
                    <SollyImage
                      src={drink.src}
                      alt={drink.alt}
                      category="drinks"
                      aspectRatioClass="aspect-[4/3]"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-display font-black text-sm text-solly-charcoal mb-1">
                    {drink.name}
                  </h4>
                  <p className="text-[11px] text-solly-charcoal/70 leading-snug">
                    {drink.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar for Drinks */}
          <div className="bg-[#FEEED8] rounded-[22px] p-4 sm:p-5 border border-solly-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-solly-charcoal block">
                Fontaines de jus frais au chariot
              </span>
              <p className="text-xs text-solly-charcoal/80 mt-0.5">
                Bissap, ananas, gingembre et fruits de la passion servis frais tout au long de la réception.
              </p>
            </div>
            <Button
              variant="pink"
              size="md"
              onClick={() => handleAddToBooking('Boissons')}
              className="!py-3 !px-6 text-xs sm:text-sm font-bold whitespace-nowrap shadow-solly-pink"
            >
              Ajouter l’option boissons (+1 000 FCFA / invité) →
            </Button>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-white border-t border-solly-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-solly-pink bg-solly-pink-soft px-3 py-1 rounded-full">
              Questions fréquentes
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal mt-2">
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
