'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Sparkles, Layers, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/context/BookingContext';

export function CartAssembly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Stage 1: Empty stage / Ground shadow
  const stageOpacity = useTransform(scrollYProgress, [0, 0.1], [0.3, 1]);

  // Stage 2: Cart base / chassis (slides up from below)
  const chassisY = useTransform(scrollYProgress, [0.08, 0.22], [80, 0]);
  const chassisOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);

  // Stage 3: Rectangular yellow front panel (slides into place)
  const frontPanelX = useTransform(scrollYProgress, [0.22, 0.36], [-80, 0]);
  const frontPanelOpacity = useTransform(scrollYProgress, [0.22, 0.34], [0, 1]);

  // Stage 4: Countertop (lowers from above)
  const counterY = useTransform(scrollYProgress, [0.36, 0.50], [-50, 0]);
  const counterOpacity = useTransform(scrollYProgress, [0.36, 0.48], [0, 1]);

  // Stage 5: Service elements & food containers (pop onto counter)
  const serviceScale = useTransform(scrollYProgress, [0.50, 0.64], [0.6, 1]);
  const serviceOpacity = useTransform(scrollYProgress, [0.50, 0.62], [0, 1]);

  // Stage 6: Beige parasol with fringe (unfolds & expands above)
  const parasolY = useTransform(scrollYProgress, [0.64, 0.78], [-90, 0]);
  const parasolScale = useTransform(scrollYProgress, [0.64, 0.78], [0.85, 1]);
  const parasolOpacity = useTransform(scrollYProgress, [0.64, 0.76], [0, 1]);

  // Stage 7: Branding Solly logo badge
  const brandingScale = useTransform(scrollYProgress, [0.78, 0.88], [1.8, 1]);
  const brandingOpacity = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);

  // Stage 8: Celebration glow & CTA reveal
  const celebrationOpacity = useTransform(scrollYProgress, [0.88, 0.98], [0, 1]);
  const celebrationScale = useTransform(scrollYProgress, [0.88, 0.98], [0.95, 1]);

  // Current active step indicator text
  const [currentStepText, setCurrentStepText] = React.useState(
    '1. Espace événementiel prêt à accueillir Solly'
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.12) setCurrentStepText('1. Espace événementiel prêt à accueillir Solly');
    else if (latest < 0.25) setCurrentStepText('2. Châssis modulaire rectangulaire compact');
    else if (latest < 0.40) setCurrentStepText('3. Panneau frontal jaune amovible & personnalisable');
    else if (latest < 0.53) setCurrentStepText('4. Plan de travail et zone de dressage');
    else if (latest < 0.67) setCurrentStepText('5. Bacs de présentation et verrines gourmandes');
    else if (latest < 0.82) setCurrentStepText('6. Parasol crème signature avec franges');
    else if (latest < 0.92) setCurrentStepText('7. Marquage officiel Solly');
    else setCurrentStepText('8. Chariot entièrement assemblé & prêt à servir !');
  });

  return (
    <section ref={containerRef} className="relative h-[340vh] bg-solly-cream">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-solly-yellow/15 blur-[120px]" />
          <div className="w-[450px] h-[450px] rounded-full bg-solly-pink/10 blur-[100px] translate-x-40 -translate-y-20" />
        </div>

        {/* Section Title & Story Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-4 sm:mb-8 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-solly-border text-solly-charcoal text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-solly-pink" />
            L'Ingénierie Solly
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-solly-charcoal">
            Le chariot modulaire se dévoile
          </h2>
          <p className="text-xs sm:text-sm text-solly-muted mt-1 max-w-lg mx-auto">
            Faites défiler pour voir l'assemblage pas-à-pas de notre chariot rectangulaire nomade.
          </p>
        </div>

        {/* Main Interactive Stage for Cart Animation */}
        <div className="relative z-20 w-full max-w-2xl h-[420px] sm:h-[480px] flex items-center justify-center">
          {/* Layer 1: Ground shadow & stage */}
          <motion.div
            style={{ opacity: stageOpacity }}
            className="absolute bottom-6 w-72 sm:w-96 h-10 bg-solly-charcoal/10 rounded-[100%] blur-md"
          />

          {/* LAYER 6: Beige Parasol with Fringe (Behind/Above Cart) */}
          <motion.div
            style={{
              y: parasolY,
              scale: parasolScale,
              opacity: parasolOpacity,
            }}
            className="absolute top-2 sm:top-4 z-10 flex flex-col items-center pointer-events-none"
          >
            {/* Parasol Canopy */}
            <div className="relative w-64 sm:w-80 h-28 sm:h-32">
              {/* Parasol Dome */}
              <div className="w-full h-full bg-[#EFE7D8] rounded-t-full border-t-2 border-l-2 border-r-2 border-[#D8CEBE] shadow-md flex items-end justify-center overflow-hidden">
                <div className="w-full h-full flex">
                  <div className="flex-1 bg-[#EBE2D2] border-r border-[#E2D8C6]" />
                  <div className="flex-1 bg-[#F5EEE0] border-r border-[#E2D8C6]" />
                  <div className="flex-1 bg-[#ECE3D3] border-r border-[#E2D8C6]" />
                  <div className="flex-1 bg-[#F5EEE0]" />
                </div>
              </div>
              {/* Parasol Fringe Border (signature fringe scallops) */}
              <div className="absolute -bottom-2.5 left-0 right-0 h-4 flex justify-between px-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-3.5 bg-[#EFE7D8] rounded-b-full border-b border-l border-r border-[#D8CEBE] shadow-2xs"
                  />
                ))}
              </div>
            </div>
            {/* Parasol Central Pole */}
            <div className="w-2.5 h-36 bg-[#D8CEBE] border-x border-[#C2B7A5]" />
          </motion.div>

          {/* LAYER 2: Rectangular Chassis & discreet transport base (NO large decorative wheels) */}
          <motion.div
            style={{
              y: chassisY,
              opacity: chassisOpacity,
            }}
            className="absolute bottom-10 z-20 flex flex-col items-center pointer-events-none"
          >
            {/* Chassis box */}
            <div className="w-64 sm:w-80 h-44 sm:h-52 bg-stone-200 rounded-2xl border-2 border-stone-300 shadow-xl relative overflow-hidden flex items-center justify-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Châssis modulaire Solly
              </span>
            </div>
            {/* Discreet transport wheels (realistic, flush underneath) */}
            <div className="w-60 sm:w-76 flex justify-between px-4 -mt-2">
              <div className="w-6 h-6 rounded-full bg-stone-700 border-2 border-stone-400 shadow-sm" />
              <div className="w-6 h-6 rounded-full bg-stone-700 border-2 border-stone-400 shadow-sm" />
            </div>
          </motion.div>

          {/* LAYER 3: Rectangular Yellow Front Panel (Removable / Customizable) */}
          <motion.div
            style={{
              x: frontPanelX,
              opacity: frontPanelOpacity,
            }}
            className="absolute bottom-12 z-30 pointer-events-none"
          >
            <div className="w-60 sm:w-76 h-40 sm:h-48 bg-solly-yellow rounded-xl border-2 border-solly-yellow-hover shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
              {/* Subtle panel framing showing modularity */}
              <div className="absolute inset-2 border border-solly-yellow-hover/40 rounded-lg pointer-events-none" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-solly-charcoal/40 mb-1">
                Panneau frontal amovible
              </span>
            </div>
          </motion.div>

          {/* LAYER 7: SOLLY Branding & Logo Badge */}
          <motion.div
            style={{
              scale: brandingScale,
              opacity: brandingOpacity,
            }}
            className="absolute bottom-24 sm:bottom-28 z-40 flex flex-col items-center pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-solly-border shadow-md flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-solly-yellow flex items-center justify-center font-black text-xs text-solly-charcoal">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wider text-solly-charcoal leading-none">
                  SOLLY
                </span>
                <span className="text-[8px] font-semibold text-solly-muted uppercase tracking-tight">
                  La beauté en bouchées
                </span>
              </div>
            </div>
          </motion.div>

          {/* LAYER 4: Food Preparation Countertop */}
          <motion.div
            style={{
              y: counterY,
              opacity: counterOpacity,
            }}
            className="absolute bottom-52 sm:bottom-60 z-35 pointer-events-none"
          >
            <div className="w-72 sm:w-88 h-4 bg-[#EDE8E1] border border-[#D5CDC2] rounded-md shadow-md flex items-center justify-between px-3">
              <div className="w-3 h-1 bg-stone-400 rounded-full" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500">
                Plan de travail alimentaire
              </span>
              <div className="w-3 h-1 bg-stone-400 rounded-full" />
            </div>
          </motion.div>

          {/* LAYER 5: Food Containers & Service Elements */}
          <motion.div
            style={{
              scale: serviceScale,
              opacity: serviceOpacity,
            }}
            className="absolute bottom-56 sm:bottom-64 z-40 flex items-center gap-2 pointer-events-none"
          >
            {/* Tray 1: Cake Bar dishes */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/95 border border-solly-pink/30 shadow-xs flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-solly-pink/80" />
              <span className="text-[9px] font-bold text-solly-charcoal">Gâteaux</span>
            </div>

            {/* Tray 2: Toppings & Marshmallows */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/95 border border-solly-yellow/60 shadow-xs flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-solly-yellow" />
              <span className="text-[9px] font-bold text-solly-charcoal">Garnitures</span>
            </div>

            {/* Tray 3: Fresh Drinks / Cups */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/95 border border-solly-border shadow-xs flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-[9px] font-bold text-solly-charcoal">Boissons</span>
            </div>
          </motion.div>

          {/* LAYER 8: Celebration Details & Final Assembled State */}
          <motion.div
            style={{
              opacity: celebrationOpacity,
              scale: celebrationScale,
            }}
            className="absolute -bottom-4 z-50 flex flex-col items-center gap-2"
          >
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-solly-yellow shadow-solly-card flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-solly-charcoal">
                Chariot complet et prêt pour vos invités
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openBooking()}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Réserver ce chariot
            </Button>
          </motion.div>
        </div>

        {/* Dynamic Step Text Indicator at Bottom */}
        <div className="relative z-30 mt-2 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm font-semibold text-solly-charcoal bg-white/80 px-4 py-1.5 rounded-full border border-solly-border/80 shadow-2xs inline-block">
            {currentStepText}
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-solly-muted mt-2">
            <span>Défilez pour voir l'assemblage</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-solly-pink" />
          </div>
        </div>
      </div>
    </section>
  );
}
