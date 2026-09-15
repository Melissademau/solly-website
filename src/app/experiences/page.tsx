'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, Sparkles, RotateCcw } from 'lucide-react';
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
    src: '/images/solly-assets/02-cake-bar/package-solly.png',
    alt: 'L’expérience Solly avec ses petits gâteaux décorés et cadre de présentation',
  },
  packageCustom: {
    src: '/images/solly-assets/02-cake-bar/trois-panneaux.jpg',
    alt: 'Trois panneaux amovibles personnalisés Solly : anniversaire, logo et marque',
  },
  barquettes: [
    {
      id: 'Barquette standard Solly',
      name: 'Barquette standard Solly',
      desc: 'Barquette blanche signature aux motifs et logo Solly',
      badge: 'Incontournable',
      src: '/images/solly-assets/02-cake-bar/barquette-standard.png',
      alt: 'Barquette standard Solly blanche et rose',
    },
    {
      id: 'Barquette à thème',
      name: 'Barquette à thème',
      desc: 'Personnalisée aux couleurs, prénom et univers de votre fête',
      badge: 'Personnalisée',
      src: '/images/solly-assets/02-cake-bar/barquette-theme.png',
      alt: 'Barquette personnalisée à thème Solly (ex: Noah)',
    },
    {
      id: 'Barquette premium',
      name: 'Barquette premium',
      desc: 'Barquette dorée raffinée pour une dégustation chic et festive',
      badge: 'Élégance',
      src: '/images/solly-assets/02-cake-bar/barquette-premium.png',
      alt: 'Barquette premium dorée Solly',
    },
  ],
  bases: [
    {
      id: 'Vanille',
      name: 'Vanille',
      src: '/images/solly-assets/02-cake-bar/base-vanille.png',
      alt: 'Génoise vanille dorée',
    },
    {
      id: 'Chocolat',
      name: 'Chocolat',
      src: '/images/solly-assets/02-cake-bar/base-chocolat.png',
      alt: 'Gâteau éponge au chocolat noir',
    },
  ],
  sauces: [
    {
      id: 'Chocolat',
      name: 'Chocolat',
      src: '/images/solly-assets/02-cake-bar/sauce-chocolat.png',
      alt: 'Sauce chocolat brillante',
    },
    {
      id: 'Caramel',
      name: 'Caramel',
      src: '/images/solly-assets/02-cake-bar/sauce-caramel.png',
      alt: 'Sauce caramel dorée',
    },
    {
      id: 'Fruits rouges',
      name: 'Fruits rouges',
      src: '/images/solly-assets/02-cake-bar/sauce-fruits-rouges.png',
      alt: 'Coulis de fruits rouges',
    },
    {
      id: 'Lait concentré sucré',
      name: 'Lait concentré sucré',
      src: '/images/solly-assets/02-cake-bar/lait-concentre.jpg',
      alt: 'Bol de lait concentré sucré onctueux',
    },
  ],
  toppings: [
    {
      id: 'Oreo',
      name: 'Oreo',
      src: '/images/solly-assets/02-cake-bar/topping-oreo.png',
      alt: 'Brisures de biscuits Oreo',
    },
    {
      id: 'Spéculoos',
      name: 'Spéculoos',
      src: '/images/solly-assets/02-cake-bar/topping-speculoos.png',
      alt: 'Miettes de spéculoos dorées',
    },
    {
      id: 'Vermicelles',
      name: 'Vermicelles',
      src: '/images/solly-assets/02-cake-bar/topping-vermicelles.png',
      alt: 'Vermicelles festifs colorés',
    },
    {
      id: 'Mangue',
      name: 'Mangue',
      src: '/images/solly-assets/02-cake-bar/topping-mangue.png',
      alt: 'Cubes de mangue fraîche',
    },
    {
      id: 'Marshmallow',
      name: 'Marshmallow',
      src: '/images/solly-assets/02-cake-bar/marshmallow.png',
      alt: 'Mini guimauves roses et blanches',
    },
    {
      id: 'Fraises',
      name: 'Fraises',
      src: '/images/solly-assets/02-cake-bar/fraises.jpg',
      alt: 'Fraises fraîches coupées en morceaux',
    },
    {
      id: 'Banane',
      name: 'Banane',
      src: '/images/solly-assets/02-cake-bar/banane.png',
      alt: 'Rondelles de banane fraîches',
    },
    {
      id: 'Autres (à préciser)',
      name: 'Autres',
      isCustom: true,
      customNote: 'À préciser avec l’équipe',
      alt: 'Garniture sur mesure à convenir avec Solly',
    },
  ],
};

const DRINK_OPTIONS = [
  {
    id: 'Bissap glacé',
    name: 'Bissap glacé',
    desc: 'Infusion fraîche d’hibiscus, menthe douce et vanille',
    src: '/images/solly-assets/03-boissons/bissap.png',
    alt: 'Bissap glacé à l’hibiscus rouge Solly',
  },
  {
    id: 'Jus d’ananas',
    name: 'Jus d’ananas',
    desc: 'Pur jus d’ananas doux et frais pressé',
    src: '/images/solly-assets/03-boissons/ananas.png',
    alt: 'Jus d’ananas doux et frais pressé Solly',
  },
  {
    id: 'Gingembre-agrumes',
    name: 'Gingembre-agrumes',
    desc: 'Gingembre tonique, jus d’oranges et citron vert',
    src: '/images/solly-assets/03-boissons/gingembre.png',
    alt: 'Boisson glacée au gingembre et agrumes Solly',
  },
  {
    id: 'Jus orange-passion',
    name: 'Jus orange-passion',
    desc: 'Nectar acidulé et doux aux fruits de la passion',
    src: '/images/solly-assets/03-boissons/passion.png',
    alt: 'Jus orange-passion glacé Solly',
  },
];

const CHARCUTERIE_ASSETS = {
  formats: [
    {
      id: 'Le Cornet',
      name: 'Le Cornet',
      desc: 'Cône rose individuel, idéal pour picorer debout',
      src: '/images/solly-assets/04-charcuterie/cornet.png',
      alt: 'Cornet rose gourmand de charcuterie Solly',
    },
    {
      id: 'Le Pot',
      name: 'Le Pot',
      desc: 'Pot rose généreux, facile à déguster et poser',
      src: '/images/solly-assets/04-charcuterie/pot.png',
      alt: 'Pot rose garni de bouchées apéritives Solly',
    },
  ],
  composants: [
    {
      id: 'Rosettes de salami',
      name: 'Rosettes de salami',
      src: '/images/solly-assets/04-charcuterie/salami.png',
      alt: 'Rosettes de salami délicatement pliées',
    },
    {
      id: 'Jambon cuit',
      name: 'Jambon cuit',
      src: '/images/solly-assets/04-charcuterie/jambon.png',
      alt: 'Fines tranches de jambon cuit',
    },
    {
      id: 'Gouda doré',
      name: 'Gouda doré',
      src: '/images/solly-assets/04-charcuterie/gouda.png',
      alt: 'Cubes de gouda doré',
    },
    {
      id: 'Fromage doux',
      name: 'Fromage doux',
      src: '/images/solly-assets/04-charcuterie/fromage.png',
      alt: 'Cubes de fromage doux',
    },
    {
      id: 'Olives marinées',
      name: 'Olives marinées',
      src: '/images/solly-assets/04-charcuterie/olives.png',
      alt: 'Coupelle d’olives vertes et noires',
    },
    {
      id: 'Raisins frais',
      name: 'Raisins frais',
      src: '/images/solly-assets/04-charcuterie/raisins.png',
      alt: 'Grappe de raisins rouges frais',
    },
    {
      id: 'Mini bretzels',
      name: 'Mini bretzels',
      src: '/images/solly-assets/04-charcuterie/bretzels.png',
      alt: 'Mini bretzels dorés au sel',
    },
    {
      id: 'Crackers dorés',
      name: 'Crackers dorés',
      src: '/images/solly-assets/04-charcuterie/crackers.png',
      alt: 'Crackers dorés aux graines',
    },
    {
      id: 'Autres (à préciser)',
      name: 'Autres',
      isCustom: true,
      customNote: 'À préciser avec l’équipe',
      alt: 'Composant salé sur mesure à convenir avec Solly',
    },
  ],
  previews: {
    cornet: {
      src: '/images/solly-assets/04-charcuterie/preview-cornet.png',
      alt: 'Trois cônes roses gourmands de charcuterie à picorer',
    },
    pot: {
      src: '/images/solly-assets/04-charcuterie/preview-pot.png',
      alt: 'Trois pots gourmands roses au salami Solly',
    },
  },
};

const FAQ_ITEMS = [
  {
    question: 'Comment choisit-on les garnitures ?',
    answer:
      'Vous composez à l’avance votre assortiment de bases (vanille, chocolat), vos sauces gourmandes (jusqu’à 2 sauces) et vos composants selon vos préférences. Le jour J, vos invités choisissent minute leurs associations directement au comptoir du chariot !',
  },
  {
    question: 'Peut-on personnaliser le chariot ?',
    answer:
      'Absolument ! Avec notre formule Expérience personnalisée, la façade avant du chariot est amovible. Nous pouvons y inscrire un prénom, un âge, le thème de la fête ou le logo de votre entreprise, avec des contenants coordonnés.',
  },
  {
    question: 'Peut-on ajouter des boissons ?',
    answer:
      'Oui, nos formules sont 100% modulables. Vous pouvez combiner le Cake Bar avec notre Bar à boissons fraîches (bissap glacé infusé aux fleurs d’hibiscus, jus d’ananas, gingembre-agrumes) pour une expérience complète.',
  },
];

export default function CakeBarPage() {
  const { openBooking } = useBooking();

  // Configurator interactive selections for Cake Bar
  const [selectedBarquette, setSelectedBarquette] = useState('Barquette standard Solly');
  const [selectedBase, setSelectedBase] = useState('Vanille');
  // Maximum 2 sauces
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['Chocolat']);
  // Composants selection (max 6)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([
    'Oreo',
    'Vermicelles',
  ]);

  // Drinks selections (max 3)
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([
    'Bissap glacé',
    'Jus d’ananas',
  ]);

  // Charcuterie interactive selections: format & bacs (max 6)
  const [selectedCharcuterieFormat, setSelectedCharcuterieFormat] = useState('Le Cornet');
  const [selectedCharcuterieComponents, setSelectedCharcuterieComponents] = useState<string[]>([
    'Rosettes de salami',
    'Gouda doré',
    'Olives marinées',
    'Raisins frais',
  ]);

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleSauce = (sauceId: string) => {
    setSelectedSauces((prev) => {
      if (prev.includes(sauceId)) {
        if (prev.length > 1) return prev.filter((s) => s !== sauceId);
        return prev;
      }
      if (prev.length >= 2) {
        return [prev[1], sauceId]; // keep max 2 by replacing the oldest
      }
      return [...prev, sauceId];
    });
  };

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) => {
      if (prev.includes(toppingId)) {
        return prev.filter((t) => t !== toppingId);
      }
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, toppingId];
    });
  };

  const toggleDrink = (drinkId: string) => {
    setSelectedDrinks((prev) => {
      if (prev.includes(drinkId)) {
        return prev.filter((d) => d !== drinkId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, drinkId];
    });
  };

  const toggleCharcuterieComponent = (itemId: string) => {
    setSelectedCharcuterieComponents((prev) => {
      if (prev.includes(itemId)) {
        if (prev.length > 1) return prev.filter((i) => i !== itemId);
        return prev;
      }
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const handleAddToBooking = (customPackage?: string) => {
    openBooking({
      experience: 'Cake Bar',
      packageType: customPackage || 'Cake Bar à composer',
      cakeBar: {
        barquette: selectedBarquette,
        base: selectedBase,
        sauces: selectedSauces,
        composants: selectedToppings,
      },
      drinks: selectedDrinks,
      charcuterie: {
        format: selectedCharcuterieFormat,
        composants: selectedCharcuterieComponents,
      },
    });
  };

  const handleAddDrinksToBooking = () => {
    openBooking({
      experience: 'Boissons',
      packageType: 'Bar à boissons fraîches',
      drinks: selectedDrinks,
      cakeBar: {
        barquette: selectedBarquette,
        base: selectedBase,
        sauces: selectedSauces,
        composants: selectedToppings,
      },
      charcuterie: {
        format: selectedCharcuterieFormat,
        composants: selectedCharcuterieComponents,
      },
    });
  };

  const handleAddCharcuterieToBooking = () => {
    openBooking({
      experience: 'Charcuterie',
      packageType: `Bar à charcuterie (${selectedCharcuterieFormat})`,
      charcuterie: {
        format: selectedCharcuterieFormat,
        composants: selectedCharcuterieComponents,
      },
      cakeBar: {
        barquette: selectedBarquette,
        base: selectedBase,
        sauces: selectedSauces,
        composants: selectedToppings,
      },
      drinks: selectedDrinks,
    });
  };

  // Dynamic summary string for Cake Bar
  const saucesSummary = selectedSauces.join(' & ');
  const creationSummary = [
    selectedBarquette,
    selectedBase,
    saucesSummary,
    ...selectedToppings,
  ]
    .filter(Boolean)
    .join(' • ');

  // Dynamic summary string for Charcuterie
  const charcuterieSummary = [
    selectedCharcuterieFormat,
    ...selectedCharcuterieComponents,
  ]
    .filter(Boolean)
    .join(' • ');

  // Clear selection functions for each section
  const clearCakeBarSelection = () => {
    setSelectedBarquette('');
    setSelectedBase('');
    setSelectedSauces([]);
    setSelectedToppings([]);
  };

  const clearDrinksSelection = () => {
    setSelectedDrinks([]);
  };

  const clearCharcuterieSelection = () => {
    setSelectedCharcuterieFormat('');
    setSelectedCharcuterieComponents([]);
  };

  const hasCakeBarSelection = Boolean(
    selectedBarquette || selectedBase || selectedSauces.length > 0 || selectedToppings.length > 0
  );

  // Dynamic preview image according to selected barquette
  const currentBarquetteAsset = CAKE_ASSETS.barquettes.find((b) => b.id === selectedBarquette);
  const previewImageSrc = currentBarquetteAsset?.src || CAKE_ASSETS.preview.src;
  const previewImageAlt = currentBarquetteAsset?.alt || CAKE_ASSETS.preview.alt;
  const hasDrinksSelection = selectedDrinks.length > 0;
  const hasCharcuterieSelection = Boolean(selectedCharcuterieFormat || selectedCharcuterieComponents.length > 0);

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
                Le Cake Bar Solly
              </p>

              {/* Main Headline with Pink Sparkle ✦ */}
              <div className="relative mb-5">
                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[68px] xl:text-[74px] text-solly-pink leading-[1.02] tracking-tight">
                  Un petit gâteau. <br />
                  Mille envies.
                </h1>
                <div className="absolute top-1 sm:top-2 -right-8 sm:-right-9 text-solly-pink select-none pointer-events-none">
                  <Sparkle size={32} color="#DE1B52" />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg font-semibold text-solly-charcoal max-w-md mb-8 leading-snug">
                Des cakes moelleux, une crème généreuse et vos composants préférés, assemblés devant vos invités.
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
                  Composer mon Cake Bar →
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
                {/* Floating Handwritten Price Badge at top right */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-center select-none pointer-events-none">
                  <div className="font-handwriting text-lg sm:text-xl font-bold text-solly-charcoal leading-none rotate-[6deg] text-center drop-shadow-sm">
                    À partir de <br />
                    80 000 FCFA
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

      {/* 3. PACKAGES SECTION: Le Cake Bar pour votre fête (Formules & Tarifs) */}
      <section id="formules" className="relative w-full">
        <ScallopEdge color="#FCECEF" height={14} />
        <div className="bg-[#FCECEF] py-16 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-12 flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Le Cake Bar pour votre fête.
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>

            {/* 2 Packages Cards Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
              {/* Package 1: L'expérience Solly */}
              <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-solly-border shadow-solly-soft flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[16/10] rounded-[18px] overflow-hidden shrink-0 bg-solly-cream/50 mb-5">
                    <SollyImage
                      src={CAKE_ASSETS.packageSolly.src}
                      alt={CAKE_ASSETS.packageSolly.alt}
                      category="cake-bar"
                      aspectRatioClass="aspect-[16/10]"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="text-left mb-6">
                    <h3 className="font-display font-black text-xl sm:text-2xl text-solly-pink">
                      L’expérience Solly
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-solly-charcoal mt-1 mb-4">
                      À partir de <span className="text-solly-pink">80 000 FCFA</span>
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm font-semibold text-solly-charcoal/90">
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>Cakes décorés</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>Chariot aux couleurs Solly</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>Installation et service</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  variant="pink"
                  size="md"
                  fullWidth
                  onClick={() => handleAddToBooking("L’expérience Solly (80 000 FCFA)")}
                  className="!py-3 text-sm font-bold"
                >
                  Choisir cette formule →
                </Button>
              </div>

              {/* Package 2: L'expérience personnalisée */}
              <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-solly-border shadow-solly-soft flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[16/10] rounded-[18px] overflow-hidden shrink-0 bg-solly-cream/50 mb-5">
                    <SollyImage
                      src={CAKE_ASSETS.packageCustom.src}
                      alt={CAKE_ASSETS.packageCustom.alt}
                      category="cake-bar"
                      aspectRatioClass="aspect-[16/10]"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="text-left mb-6">
                    <h3 className="font-display font-black text-xl sm:text-2xl text-solly-pink">
                      L’expérience personnalisée
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-solly-charcoal mt-1 mb-4">
                      À partir de <span className="text-solly-pink">100 000 FCFA</span>
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm font-semibold text-solly-charcoal/90">
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>L’expérience Solly incluse</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>Façade au thème de votre fête</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-solly-pink font-bold">✓</span>
                        <span>Contenants personnalisés</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  variant="pink"
                  size="md"
                  fullWidth
                  onClick={() => handleAddToBooking("L’expérience personnalisée (100 000 FCFA)")}
                  className="!py-3 text-sm font-bold"
                >
                  Personnaliser ma fête →
                </Button>
              </div>
            </div>

            {/* Footnote */}
            <p className="text-center text-[11px] sm:text-xs text-solly-charcoal/70 font-medium">
              Quantités, durée et déplacement précisés dans votre devis.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CONFIGURATOR: Composez votre cake bar */}
      <section id="cake-bar" className="py-16 sm:py-24 bg-solly-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Composez votre cake bar
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1">
              C’est vous qui choisissez ! Préparez vos envies pour votre demande de devis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Side: 3 Steps Selectors */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clear All bar for Cake Bar */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-solly-charcoal/60">
                  Votre composition étape par étape
                </span>
                {hasCakeBarSelection && (
                  <button
                    type="button"
                    onClick={clearCakeBarSelection}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-solly-pink hover:text-white bg-solly-pink-soft hover:bg-solly-pink px-3 py-1.5 rounded-full border border-solly-pink/20 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Effacer toute la sélection</span>
                  </button>
                )}
              </div>

              {/* Row 01: Votre barquette */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      01
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Votre barquette
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Choisissez le format de présentation de vos gâteaux.
                      </p>
                    </div>
                  </div>
                  {selectedBarquette && (
                    <button
                      type="button"
                      onClick={() => setSelectedBarquette('')}
                      className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {CAKE_ASSETS.barquettes.map((barquette) => {
                    const isSelected = selectedBarquette === barquette.id;
                    return (
                      <button
                        key={barquette.id}
                        type="button"
                        onClick={() => setSelectedBarquette(barquette.id)}
                        className={`relative group rounded-[20px] p-3 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm ring-1 ring-solly-pink/20'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-[3/2] rounded-[14px] overflow-hidden bg-solly-cream/40 mb-2.5 relative">
                          <SollyImage
                            src={barquette.src}
                            alt={barquette.alt}
                            category="cake-bar"
                            aspectRatioClass="aspect-[3/2]"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-xs text-solly-charcoal border border-solly-border/40 shadow-2xs">
                            {barquette.badge}
                          </span>
                        </div>
                        <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal leading-snug">
                          {barquette.name}
                        </span>
                        <p className="text-[11px] text-solly-charcoal/70 leading-tight mt-1">
                          {barquette.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 02: Votre base */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      02
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Votre base
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Choisissez le cake de votre choix.
                      </p>
                    </div>
                  </div>
                  {selectedBase && (
                    <button
                      type="button"
                      onClick={() => setSelectedBase('')}
                      className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CAKE_ASSETS.bases.map((base) => {
                    const isSelected = selectedBase === base.id;
                    return (
                      <button
                        key={base.id}
                        type="button"
                        onClick={() => setSelectedBase(base.id)}
                        className={`relative group rounded-[18px] p-2 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-solly-cream/40 mb-2">
                          <SollyImage
                            src={base.src}
                            alt={base.alt}
                            category="cake-bar"
                            aspectRatioClass="aspect-[4/3]"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-solly-charcoal">
                          {base.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 03: Votre sauce (Multiple choice up to max 2 sauces) */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      03
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Votre sauce
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Choisissez jusqu’à 2 sauces gourmandes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-solly-pink bg-solly-pink-soft px-2.5 py-1 rounded-full border border-solly-pink/20">
                      Max 2 sauces ({selectedSauces.length}/2)
                    </span>
                    {selectedSauces.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSauces([])}
                        className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAKE_ASSETS.sauces.map((sauce) => {
                    const isSelected = selectedSauces.includes(sauce.id);
                    return (
                      <button
                        key={sauce.id}
                        type="button"
                        onClick={() => toggleSauce(sauce.id)}
                        className={`relative group rounded-[18px] p-2 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-solly-cream/40 mb-2">
                          <SollyImage
                            src={sauce.src}
                            alt={sauce.alt}
                            category="cake-bar"
                            aspectRatioClass="aspect-[4/3]"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-solly-charcoal leading-tight">
                          {sauce.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 04: Vos composants (Maximum 6 composants) */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      04
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Vos composants
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Finalisez avec vos composants préférés.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        selectedToppings.length >= 6
                          ? 'bg-solly-pink text-white border-solly-pink'
                          : 'text-solly-pink bg-solly-pink-soft border-solly-pink/20'
                      }`}
                    >
                      Max 6 composants ({selectedToppings.length}/6)
                    </span>
                    {selectedToppings.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedToppings([])}
                        className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAKE_ASSETS.toppings.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    const isMaxReached = selectedToppings.length >= 6 && !isSelected;
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        onClick={() => toggleTopping(topping.id)}
                        disabled={isMaxReached}
                        className={`relative group rounded-[18px] p-2 flex flex-col items-center text-center transition-all duration-200 ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm cursor-pointer'
                            : isMaxReached
                            ? 'border border-solly-border/40 bg-white/60 opacity-50 cursor-not-allowed'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white cursor-pointer'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-solly-cream/40 mb-2 relative">
                          {topping.src ? (
                            <SollyImage
                              src={topping.src}
                              alt={topping.alt}
                              category="cake-bar"
                              aspectRatioClass="aspect-[4/3]"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-solly-yellow/10">
                              <Sparkles className="w-8 h-8 text-solly-yellow" />
                            </div>
                          )}
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-solly-charcoal leading-tight">
                          {topping.name}
                        </span>
                        {topping.customNote && (
                          <span className="text-[10px] text-solly-charcoal/60 mt-0.5">
                            {topping.customNote}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Dynamic Creation Preview Card - "C'est vous qui choisissez !" */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-[#FCECEF] rounded-[28px] p-6 sm:p-7 border border-solly-pink/15 shadow-solly-soft flex flex-col items-center text-center">
                {/* Title: C'est vous qui choisissez ! */}
                <div className="inline-flex items-center gap-1.5 mb-1.5">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal">
                    C’est vous qui choisissez !
                  </h3>
                  <div className="-mt-2 select-none pointer-events-none">
                    <BurstDoodle direction="top-right" color="#DE1B52" size={24} />
                  </div>
                </div>

                {/* Dynamic Summary Tagline */}
                <p className="text-xs sm:text-sm font-semibold text-solly-charcoal/80 mb-5">
                  {creationSummary || 'Choisissez vos ingrédients'}
                </p>

                {/* Real Preview Photo of Assembled Cake */}
                <div className="w-full rounded-[22px] overflow-hidden bg-white shadow-2xs mb-6 relative">
                  <SollyImage
                    src={previewImageSrc}
                    alt={previewImageAlt}
                    category="cake-bar"
                    aspectRatioClass="aspect-[3/2]"
                    className="w-full h-auto object-cover transition-all duration-300"
                  />
                  {selectedBarquette && (
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 text-solly-pink border border-solly-pink/20 shadow-xs">
                      ✨ {selectedBarquette}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={() => handleAddToBooking()}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Ajouter à ma demande →
                </Button>

                {hasCakeBarSelection && (
                  <button
                    type="button"
                    onClick={clearCakeBarSelection}
                    className="mt-3 text-xs font-bold text-solly-charcoal/60 hover:text-solly-pink transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Effacer toute la sélection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BAR À BOISSONS SECTION */}
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
              Des infusions glacées et purs jus de fruits locaux servis minute à la fontaine.
            </p>
            <div className="mt-3 inline-flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors ${
                  selectedDrinks.length >= 3
                    ? 'bg-solly-pink text-white border-solly-pink'
                    : 'text-solly-pink bg-solly-pink-soft border-solly-pink/20'
                }`}
              >
                3 jus maximum ({selectedDrinks.length}/3)
              </span>
              {hasDrinksSelection && (
                <button
                  type="button"
                  onClick={clearDrinksSelection}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-solly-pink hover:text-white bg-solly-pink-soft hover:bg-solly-pink px-3 py-1 rounded-full border border-solly-pink/20 transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Effacer toute la sélection</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of 4 Drinks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {DRINK_OPTIONS.map((drink) => {
              const isSelected = selectedDrinks.includes(drink.id);
              const isMaxReached = selectedDrinks.length >= 3 && !isSelected;
              return (
                <button
                  key={drink.id}
                  type="button"
                  onClick={() => toggleDrink(drink.id)}
                  disabled={isMaxReached}
                  className={`group rounded-[22px] p-3 text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm cursor-pointer'
                      : isMaxReached
                      ? 'border border-solly-border/40 bg-white/60 opacity-50 cursor-not-allowed'
                      : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-solly-cream/40 mb-3 relative">
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
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
                  <div className="mt-3 pt-2 border-t border-solly-border/40 flex items-center justify-between text-[11px] font-bold">
                    <span
                      className={
                        isSelected
                          ? 'text-solly-pink'
                          : isMaxReached
                          ? 'text-solly-charcoal/40'
                          : 'text-solly-charcoal/60'
                      }
                    >
                      {isSelected ? '✓ Sélectionné' : isMaxReached ? 'Limite atteinte' : '+ Sélectionner'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar for Drinks */}
          <div className="bg-[#FEEED8] rounded-[22px] p-4 sm:p-5 border border-solly-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-solly-charcoal block">
                  Vos boissons choisies ({selectedDrinks.length}/3 max)
                </span>
                {hasDrinksSelection && (
                  <button
                    type="button"
                    onClick={clearDrinksSelection}
                    className="text-[11px] font-bold text-solly-pink hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Effacer
                  </button>
                )}
              </div>
              <p className="text-xs text-solly-charcoal/80 mt-0.5">
                {selectedDrinks.length > 0 ? selectedDrinks.join(' • ') : 'Aucune boisson sélectionnée'}
              </p>
            </div>
            <Button
              variant="pink"
              size="md"
              onClick={handleAddDrinksToBooking}
              className="!py-3 !px-6 text-xs sm:text-sm font-bold whitespace-nowrap shadow-solly-pink"
            >
              Ajouter mes boissons au devis →
            </Button>
          </div>
        </div>
      </section>

      {/* 6. BAR À CHARCUTERIE SECTION: Composez votre bar à charcuterie */}
      <section id="charcuterie" className="py-16 sm:py-24 bg-[#FFFBF2] border-t border-solly-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center justify-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-solly-charcoal tracking-tight">
                Composez votre bar à charcuterie
              </h2>
              <div className="-mt-3 select-none pointer-events-none">
                <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1">
              C’est vous qui choisissez ! Préparez vos envies salées pour votre demande de devis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Side: 2 Steps Selectors */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clear All bar for Charcuterie */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-solly-charcoal/60">
                  Votre composition salée
                </span>
                {hasCharcuterieSelection && (
                  <button
                    type="button"
                    onClick={clearCharcuterieSelection}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-solly-pink hover:text-white bg-solly-pink-soft hover:bg-solly-pink px-3 py-1.5 rounded-full border border-solly-pink/20 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Effacer toute la sélection</span>
                  </button>
                )}
              </div>

              {/* Row 01: Votre contenant / format */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      01
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Votre format
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Choisissez entre le cornet à picorer ou le pot gourmand.
                      </p>
                    </div>
                  </div>
                  {selectedCharcuterieFormat && (
                    <button
                      type="button"
                      onClick={() => setSelectedCharcuterieFormat('')}
                      className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CHARCUTERIE_ASSETS.formats.map((format) => {
                    const isSelected = selectedCharcuterieFormat === format.id;
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => setSelectedCharcuterieFormat(format.id)}
                        className={`relative group rounded-[18px] p-3 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-solly-cream/40 mb-2.5">
                          <SollyImage
                            src={format.src}
                            alt={format.alt}
                            category="charcuterie"
                            aspectRatioClass="aspect-[4/3]"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="font-display font-bold text-sm sm:text-base text-solly-charcoal">
                          {format.name}
                        </span>
                        <span className="text-[11px] text-solly-charcoal/70 mt-0.5">
                          {format.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 02: Composition des bacs (Max 6 composants) */}
              <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-solly-border shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-solly-pink text-white font-display font-bold flex items-center justify-center shrink-0 text-xs">
                      02
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-solly-charcoal leading-none">
                        Composition des bacs
                      </h3>
                      <p className="text-[11px] sm:text-xs text-solly-charcoal/70 font-medium mt-0.5">
                        Sélectionnez jusqu’à 6 composants pour garnir les bacs inox.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        selectedCharcuterieComponents.length >= 6
                          ? 'bg-solly-pink text-white border-solly-pink'
                          : 'text-solly-pink bg-solly-pink-soft border-solly-pink/20'
                      }`}
                    >
                      Max 6 composants ({selectedCharcuterieComponents.length}/6)
                    </span>
                    {selectedCharcuterieComponents.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCharcuterieComponents([])}
                        className="text-[11px] font-bold text-solly-charcoal/50 hover:text-solly-pink transition-colors cursor-pointer underline"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CHARCUTERIE_ASSETS.composants.map((item) => {
                    const isSelected = selectedCharcuterieComponents.includes(item.id);
                    const isMaxReached = selectedCharcuterieComponents.length >= 6 && !isSelected;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleCharcuterieComponent(item.id)}
                        disabled={isMaxReached}
                        className={`relative group rounded-[18px] p-2 flex flex-col items-center text-center transition-all duration-200 ${
                          isSelected
                            ? 'border-2 border-solly-pink bg-solly-pink/5 shadow-sm cursor-pointer'
                            : isMaxReached
                            ? 'border border-solly-border/40 bg-white/60 opacity-50 cursor-not-allowed'
                            : 'border border-solly-border/70 hover:border-solly-pink/40 bg-white cursor-pointer'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shadow-xs z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-solly-cream/40 mb-2 relative flex items-center justify-center">
                          {item.isCustom ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-solly-pink-soft text-solly-pink p-2">
                              <Sparkles className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-bold text-center leading-tight">
                                Sur-mesure
                              </span>
                            </div>
                          ) : (
                            <SollyImage
                              src={item.src!}
                              alt={item.alt}
                              category="charcuterie"
                              aspectRatioClass="aspect-square"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <span className="font-display font-bold text-xs text-solly-charcoal leading-tight">
                          {item.name}
                        </span>
                        {item.customNote && (
                          <span className="text-[10px] font-medium text-solly-muted mt-0.5 leading-none">
                            {item.customNote}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Sticky Preview Card - "C'est vous qui choisissez !" */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-[#FFF2CE] rounded-[28px] p-6 sm:p-7 border border-[#FAD02C]/40 shadow-solly-soft flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-1.5 mb-1.5">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal">
                    C’est vous qui choisissez !
                  </h3>
                  <div className="-mt-2 select-none pointer-events-none">
                    <BurstDoodle direction="top-right" color="#DE1B52" size={24} />
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-solly-charcoal/80 mb-5">
                  {charcuterieSummary || 'Choisissez votre contenant et vos composants'}
                </p>

                <div className="w-full rounded-[22px] overflow-hidden bg-white shadow-2xs mb-6">
                  <SollyImage
                    src={
                      selectedCharcuterieFormat === 'Le Cornet'
                        ? CHARCUTERIE_ASSETS.previews.cornet.src
                        : selectedCharcuterieFormat === 'Le Pot'
                        ? CHARCUTERIE_ASSETS.previews.pot.src
                        : '/images/solly-assets/04-charcuterie/chariot-charcuterie.png'
                    }
                    alt={
                      selectedCharcuterieFormat === 'Le Cornet'
                        ? CHARCUTERIE_ASSETS.previews.cornet.alt
                        : selectedCharcuterieFormat === 'Le Pot'
                        ? CHARCUTERIE_ASSETS.previews.pot.alt
                        : 'Bar à charcuterie Solly avec bacs inox'
                    }
                    category="charcuterie"
                    aspectRatioClass="aspect-[4/3]"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <Button
                  variant="pink"
                  size="lg"
                  fullWidth
                  onClick={handleAddCharcuterieToBooking}
                  className="!py-3.5 text-sm sm:text-base font-bold shadow-solly-pink"
                >
                  Ajouter à ma demande →
                </Button>

                {hasCharcuterieSelection && (
                  <button
                    type="button"
                    onClick={clearCharcuterieSelection}
                    className="mt-3 text-xs font-bold text-solly-charcoal/60 hover:text-solly-pink transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Effacer toute la sélection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION: Les petites questions gourmandes */}
      <section className="py-16 sm:py-20 bg-solly-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-10 flex items-center justify-center gap-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-solly-charcoal tracking-tight">
              Les petites questions gourmandes
            </h2>
            <div className="-mt-3 select-none pointer-events-none">
              <BurstDoodle direction="top-right" color="#DE1B52" size={26} />
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-[20px] border border-solly-border overflow-hidden transition-shadow duration-200 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-solly-cream/30 transition-colors"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-solly-charcoal">
                      {item.question}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-solly-pink/10 text-solly-pink flex items-center justify-center shrink-0 ml-3">
                      {isOpen ? (
                        <Minus className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-solly-charcoal/80 font-medium leading-relaxed border-t border-solly-border/40">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CONVERSION BANNER */}
      <SollyCtaBanner onButtonClick={handleAddToBooking} />
    </div>
  );
}
