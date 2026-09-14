'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'pink' | 'yellow' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'pink',
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-solly-pink/60 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none tracking-tight';

  const sizeStyles = {
    sm: 'text-xs px-5 py-2.5 gap-2',
    md: 'text-sm sm:text-base px-7 py-3.5 gap-2.5',
    lg: 'text-base sm:text-lg px-8 py-4 gap-3',
  };

  const variantStyles = {
    pink:
      'bg-solly-pink text-white hover:bg-solly-pink-hover shadow-solly-pink hover:shadow-lg',
    primary:
      'bg-solly-pink text-white hover:bg-solly-pink-hover shadow-solly-pink hover:shadow-lg',
    yellow:
      'bg-solly-yellow text-solly-charcoal hover:bg-solly-yellow-hover shadow-solly-yellow hover:shadow-lg',
    outline:
      'bg-white/90 backdrop-blur-xs text-solly-charcoal border-2 border-solly-charcoal/80 hover:bg-solly-cream-soft shadow-xs',
    ghost:
      'bg-transparent text-solly-charcoal hover:bg-solly-pink-soft text-solly-pink',
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
    </motion.button>
  );
}
