'use client';

import React from 'react';
import { Sparkle, BurstDoodle, ScallopEdge } from '@/components/ui/Doodles';
import { useBooking } from '@/context/BookingContext';

interface SollyCtaBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  bookingPackage?: string;
  className?: string;
}

export function SollyCtaBanner({
  title = 'Et si la prochaine histoire était la vôtre ?',
  subtitle,
  buttonText = 'Parlons de votre événement',
  onButtonClick,
  bookingPackage,
  className = '',
}: SollyCtaBannerProps) {
  const { openBooking } = useBooking();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (bookingPackage) {
      openBooking({ packageType: bookingPackage });
    } else {
      openBooking();
    }
  };

  return (
    <section className={`relative w-full ${className}`}>
      {/* Top Scalloped Edge seamlessly connected to the pink banner */}
      <div className="-mb-[1px] relative z-10 leading-none">
        <ScallopEdge color="#DE1B52" height={16} />
      </div>

      {/* Pink Container */}
      <div className="bg-[#DE1B52] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle soft backdrop highlights */}
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Sparkle */}
          <div className="hidden lg:flex items-center justify-start flex-1">
            <Sparkle size={46} color="white" className="opacity-95 animate-pulse" />
          </div>

          {/* Center: Headline & Yellow Pill CTA Button */}
          <div className="text-center flex-1 max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2.5 text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-md mx-auto">
                {subtitle}
              </p>
            )}
            <button
              type="button"
              onClick={handleClick}
              className="mt-6 px-8 py-3.5 rounded-full bg-[#FFD233] text-solly-charcoal font-display font-bold text-sm sm:text-base hover:bg-yellow-300 hover:scale-105 shadow-solly-yellow transition-all duration-200 inline-flex items-center gap-2.5 group cursor-pointer"
            >
              <span>{buttonText}</span>
              <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
            </button>
          </div>

          {/* Right: Handwritten Script with burst doodles */}
          <div className="flex-1 flex justify-center lg:justify-end items-center gap-2 font-handwriting text-white text-xl sm:text-2xl leading-tight select-none">
            <BurstDoodle direction="bottom-left" size={24} color="white" />
            <div className="text-center sm:text-right">
              Des événements<br />
              plus gourmands,<br />
              toujours. ♡
            </div>
            <BurstDoodle direction="top-right" size={24} color="white" />
          </div>
        </div>
      </div>
    </section>
  );
}
