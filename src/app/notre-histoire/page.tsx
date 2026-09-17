'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkle, BurstDoodle, ScallopEdge } from '@/components/ui/Doodles';
import { SollyCtaBanner } from '@/components/ui/SollyCtaBanner';
import { useBooking } from '@/context/BookingContext';

export default function NotreHistoirePage() {
  const { openBooking } = useBooking();

  return (
    <div className="pt-28 sm:pt-36 pb-0 overflow-x-hidden">
      {/* SECTION 1: HEADER / DERRIÈRE SOLLY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: 2 Photos as requested by user */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              {/* Photo 1: Femmes au chariot Solly, sous le soleil (Visible everywhere) */}
              <div className="relative group overflow-hidden rounded-[26px] sm:rounded-[30px] border border-solly-border shadow-solly-card bg-white aspect-[16/11] sm:aspect-[3/4]">
                <Image
                  src="/images/solly-assets/05-experience/femmes-chariot.png"
                  alt="Femmes au chariot Solly, sous le soleil"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Photo 2: Gâteau aux guimauves décoré à quatre mains (Hidden on mobile to lighten the page) */}
              <div className="relative group overflow-hidden rounded-[26px] sm:rounded-[30px] border border-solly-border shadow-solly-card bg-white aspect-[4/5] sm:aspect-[3/4] hidden sm:block">
                <Image
                  src="/images/solly-assets/05-experience/gateau-quatre-mains.png"
                  alt="Gâteau aux guimauves décoré à quatre mains"
                  fill
                  sizes="50vw"
                  loading="lazy"
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Right Column: Derrière Solly text & signature */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <span className="text-xs sm:text-sm font-display font-black uppercase tracking-widest text-solly-pink mb-3 block">
              DERRIÈRE SOLLY
            </span>

            {/* Heading with 4-point Sparkle */}
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-display font-extrabold text-solly-pink leading-[1.1] tracking-tight">
                Deux sœurs.<br />
                Une idée gourmande.
              </h1>
              <Sparkle
                className="absolute -top-3 right-0 sm:-right-4 text-solly-pink animate-pulse"
                size={30}
              />
            </div>

            {/* Body Paragraph */}
            <p className="mt-6 text-base sm:text-lg text-solly-charcoal/85 leading-relaxed font-sans font-medium">
              Nous, c’est Mélissa et Isla. Pendant plus d’un an, nous avons imaginé Solly entre nos journées bien remplies, nos idées et nos essais. Nous voulions créer quelque chose de beau, de bon et de joyeux. Un petit moment qui rassemble et qui reste.
            </p>

            {/* Handwritten Signature */}
            <div className="mt-8 font-handwriting text-3xl sm:text-4xl text-solly-charcoal flex items-center gap-2 select-none">
              <span>Mélissa &amp; Isla</span>
              <span className="text-2xl text-solly-charcoal/80">♡</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CE QUI NOUS TIENT À CŒUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        {/* Title with Doodle */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal text-center tracking-tight">
            Ce qui nous tient à cœur.
          </h2>
          <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
        </div>

        {/* Soft Pink Container Card */}
        <div className="bg-[#FCECEF] rounded-[28px] p-6 sm:p-10 border border-solly-pink/10 shadow-solly-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-solly-pink/20 items-center">
            {/* Item 1: Le goût */}
            <div className="flex items-center gap-4 sm:gap-5 md:px-6 first:pl-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 shadow-2xs border border-white">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="#DE1B52"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 26C14 26 23 20 23 11C23 6 19 2 14 2C9 2 5 6 5 11C5 20 14 26 14 26Z" />
                  <path d="M14 2V18" />
                  <path d="M14 10L19 7" />
                  <path d="M14 14L9 11" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-solly-charcoal">
                  Le goût
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5 leading-snug">
                  Des associations gourmandes qui donnent envie de se resservir.
                </p>
              </div>
            </div>

            {/* Item 2: Les détails */}
            <div className="flex items-center gap-4 sm:gap-5 md:px-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 shadow-2xs border border-white">
                <Sparkle size={26} color="#DE1B52" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-solly-charcoal">
                  Les détails
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5 leading-snug">
                  Des couleurs aux contenants, chaque élément participe à la fête.
                </p>
              </div>
            </div>

            {/* Item 3: Le partage */}
            <div className="flex items-center gap-4 sm:gap-5 md:px-6 last:pr-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 shadow-2xs border border-white">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DE1B52"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-solly-charcoal">
                  Le partage
                </h3>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-0.5 leading-snug">
                  Un bar autour duquel on se retrouve et on se régale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VOTRE FÊTE, PAS À PAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        {/* Title with Doodle */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal text-center tracking-tight">
            Votre fête, pas à pas.
          </h2>
          <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
        </div>

        {/* 2x2 Grid of White Cards with Pink Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Step 01 */}
          <div className="bg-white rounded-[22px] border border-[#F2E8EB] p-5 sm:p-6 flex items-center justify-between shadow-2xs hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-solly-pink text-white font-display font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                01
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-solly-pink leading-snug">
                  On parle de votre événement
                </h3>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-0.5">
                  Date, lieu, invités et envies : racontez-nous votre projet.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 pl-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                stroke="#DE1B52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M28 16C28 22.075 22.85 27 16.5 27C14.26 27 12.16 26.42 10.35 25.43L4.5 27L6.27 22.08C5.16 20.37 4.5 18.4 4.5 16C4.5 9.925 9.65 5 16.5 5C22.85 5 28 9.925 28 16Z" />
                <circle cx="11.5" cy="16" r="1.2" fill="#DE1B52" />
                <circle cx="16.5" cy="16" r="1.2" fill="#DE1B52" />
                <circle cx="21.5" cy="16" r="1.2" fill="#DE1B52" />
              </svg>
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-[22px] border border-[#F2E8EB] p-5 sm:p-6 flex items-center justify-between shadow-2xs hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-solly-pink text-white font-display font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                02
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-solly-pink leading-snug">
                  On compose votre expérience
                </h3>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-0.5">
                  Bars, saveurs et personnalisation : nous préparons votre devis.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 pl-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                stroke="#DE1B52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 4H20L26 10V30H9V4Z" />
                <path d="M20 4V10H26" />
                <line x1="13" y1="15" x2="22" y2="15" />
                <line x1="13" y1="20" x2="22" y2="20" />
                <line x1="13" y1="25" x2="18" y2="25" />
              </svg>
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-[22px] border border-[#F2E8EB] p-5 sm:p-6 flex items-center justify-between shadow-2xs hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-solly-pink text-white font-display font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                03
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-solly-pink leading-snug">
                  On installe et on vous régale
                </h3>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-0.5">
                  Le jour J, notre équipe prépare le chariot et assure le service.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 pl-3">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                stroke="#DE1B52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Cart Awning */}
                <path d="M6 13L9 6H27L30 13H6Z" />
                <line x1="10" y1="6" x2="11" y2="13" />
                <line x1="18" y1="6" x2="18" y2="13" />
                <line x1="26" y1="6" x2="25" y2="13" />
                {/* Body */}
                <rect x="7" y="18" width="22" height="9" rx="2" />
                {/* Posts */}
                <line x1="9" y1="13" x2="9" y2="18" />
                <line x1="27" y1="13" x2="27" y2="18" />
                {/* Wheels */}
                <circle cx="13" cy="29" r="2.8" />
                <circle cx="23" cy="29" r="2.8" />
                {/* Handle */}
                <line x1="29" y1="20" x2="32" y2="22" />
              </svg>
            </div>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-[22px] border border-[#F2E8EB] p-5 sm:p-6 flex items-center justify-between shadow-2xs hover:shadow-solly-card hover:border-solly-pink/30 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-solly-pink text-white font-display font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                04
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-solly-pink leading-snug">
                  Vous profitez du moment
                </h3>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-0.5">
                  Place aux échanges, aux sourires et aux petites bouchées.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 pl-3">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                stroke="#DE1B52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Left flute */}
                <path d="M10 7H17L15 14C14.5 15.5 13 16.5 11.5 16.5H10.5C9.5 16.5 8.5 15.5 8.5 14L10 7Z" />
                <line x1="12" y1="16.5" x2="12" y2="25" />
                <line x1="9" y1="25" x2="15" y2="25" />
                {/* Right flute */}
                <path d="M26 7H19L21 14C21.5 15.5 23 16.5 24.5 16.5H25.5C26.5 16.5 27.5 15.5 27.5 14L26 7Z" />
                <line x1="24" y1="16.5" x2="24" y2="25" />
                <line x1="21" y1="25" x2="27" y2="25" />
                {/* Sparkle clink */}
                <path d="M18 4V8" />
                <path d="M16 6H20" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TRIO DE PHOTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Photo 1: Gâteau marshmallow Solly en moule doré */}
          <div className="relative group overflow-hidden rounded-[24px] sm:rounded-[28px] border border-solly-border shadow-solly-card bg-white aspect-[4/3]">
            <Image
              src="/images/solly-assets/05-experience/gateau-marshmallow.png"
              alt="Gâteau marshmallow Solly en moule doré"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              decoding="async"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Photo 2: Pot rose de charcuterie partagé */}
          <div className="relative group overflow-hidden rounded-[24px] sm:rounded-[28px] border border-solly-border shadow-solly-card bg-white aspect-[4/3]">
            <Image
              src="/images/solly-assets/05-experience/pot-charcuterie-partage.png"
              alt="Pot rose de charcuterie partagé"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              decoding="async"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Photo 3: Jus glacés ananas et bissap */}
          <div className="relative group overflow-hidden rounded-[24px] sm:rounded-[28px] border border-solly-border shadow-solly-card bg-white aspect-[4/3]">
            <Image
              src="/images/solly-assets/05-experience/jus-glaces-ananas-bissap.png"
              alt="Jus glacés ananas et bissap"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              decoding="async"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </section>

      {/* SECTION 5: DU SUCRÉ, DU SALÉ, ET BEAUCOUP DE BONNE HUMEUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 text-center">
        {/* Title with Doodle */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-solly-charcoal tracking-tight">
            Du sucré, du salé, et beaucoup de bonne humeur.
          </h2>
          <BurstDoodle direction="top-right" size={26} color="#DE1B52" />
        </div>

        {/* 3 Pill Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
          <Link
            href="/experiences#cake-bar"
            className="px-7 py-3 rounded-full border-2 border-solly-pink text-solly-pink bg-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink hover:text-white transition-all duration-200 shadow-2xs inline-flex items-center gap-2 group"
          >
            <span>Cake Bar</span>
            <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
          </Link>
          <Link
            href="/experiences#boissons"
            className="px-7 py-3 rounded-full border-2 border-solly-pink text-solly-pink bg-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink hover:text-white transition-all duration-200 shadow-2xs inline-flex items-center gap-2 group"
          >
            <span>Bar à boissons</span>
            <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
          </Link>
          <Link
            href="/experiences#charcuterie"
            className="px-7 py-3 rounded-full border-2 border-solly-pink text-solly-pink bg-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink hover:text-white transition-all duration-200 shadow-2xs inline-flex items-center gap-2 group"
          >
            <span>Bar à charcuterie</span>
            <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
          </Link>
        </div>
      </section>

      {/* SECTION 6: PINK SCALLOPED CTA BANNER */}
      <SollyCtaBanner />
    </div>
  );
}
