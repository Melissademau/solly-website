'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Sparkles, UtensilsCrossed, Wine, Cake, PartyPopper } from 'lucide-react';

interface SollyImageProps extends Omit<ImageProps, 'onError'> {
  category?: 'hero' | 'cart' | 'cake-bar' | 'drinks' | 'charcuterie' | 'events' | 'about';
  fallbackLabel?: string;
  aspectRatioClass?: string;
}

export function SollyImage({
  src,
  alt,
  category = 'hero',
  fallbackLabel,
  className = '',
  aspectRatioClass = 'aspect-[4/3]',
  sizes,
  priority = false,
  quality = 80,
  ...props
}: SollyImageProps) {
  const [error, setError] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case 'cake-bar':
        return <Cake className="w-8 h-8 text-solly-pink stroke-[1.5]" />;
      case 'drinks':
        return <Wine className="w-8 h-8 text-solly-pink stroke-[1.5]" />;
      case 'charcuterie':
        return <UtensilsCrossed className="w-8 h-8 text-solly-yellow stroke-[1.5]" />;
      case 'events':
        return <PartyPopper className="w-8 h-8 text-solly-pink stroke-[1.5]" />;
      default:
        return <Sparkles className="w-8 h-8 text-solly-yellow stroke-[1.5]" />;
    }
  };

  const getCategoryBadge = () => {
    switch (category) {
      case 'cake-bar':
        return 'Cake Bar';
      case 'drinks':
        return 'Bar à Boissons';
      case 'charcuterie':
        return 'Charcuterie & Salé';
      case 'cart':
        return 'Chariot Solly';
      case 'events':
        return 'Événement Solly';
      case 'about':
        return 'Maison Solly';
      default:
        return 'Solly Paris';
    }
  };

  if (error || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-solly-cream-card border border-solly-border rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-solly-soft ${aspectRatioClass} ${className}`}
      >
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-solly-yellow/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-solly-pink/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-[280px]">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 border border-solly-border/60">
            {getCategoryIcon()}
          </div>
          
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-solly-charcoal border border-solly-border mb-2 shadow-2xs">
            {getCategoryBadge()}
          </span>

          <p className="text-xs text-solly-muted font-medium line-clamp-2 mb-2 leading-relaxed">
            {fallbackLabel || alt}
          </p>

          <code className="text-[10px] text-solly-muted/70 bg-solly-cream-dark/60 px-2 py-0.5 rounded font-mono truncate max-w-full">
            {typeof src === 'string' ? src : 'asset'}
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        quality={quality}
        onError={() => setError(true)}
        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        {...props}
      />
    </div>
  );
}
