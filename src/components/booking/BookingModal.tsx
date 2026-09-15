'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { GamifiedBookingFlow } from './GamifiedBookingFlow';

export function BookingModal() {
  const { isOpen, closeBooking } = useBooking();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeBooking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeBooking]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop with soft blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="fixed inset-0 bg-solly-charcoal/60 backdrop-blur-xs"
          />

          {/* Modal Container: Bottom sheet on mobile, centered card on tablet/desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative w-full max-w-xl z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-[32px] sm:rounded-[32px] bg-white overflow-hidden"
          >
            <GamifiedBookingFlow onClose={closeBooking} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
