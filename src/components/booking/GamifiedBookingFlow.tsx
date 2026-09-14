'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  FileText,
  MessageCircle,
  Pencil,
  Info,
  ChevronDown,
  Plus,
  Minus,
} from 'lucide-react';
import { SollyLogo, Sparkle, BurstDoodle } from '@/components/ui/Doodles';
import { useBooking, EventType, SelectedBarType } from '@/context/BookingContext';

interface GamifiedBookingFlowProps {
  onClose?: () => void;
  isInline?: boolean;
}

const EVENT_TYPE_OPTIONS: EventType[] = [
  "Anniversaire d'enfant",
  "Célébration familiale",
  "Événement scolaire / parents",
  "Événement d'entreprise",
  "Autre événement",
];

export function GamifiedBookingFlow({ onClose, isInline = false }: GamifiedBookingFlowProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    orderChoices,
    submitBooking,
    resetBooking,
    getWhatsAppUrl,
  } = useBooking();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inspirationAdded, setInspirationAdded] = useState(false);

  // Counter animation key for guest count
  const guestCount = typeof formData.guestCount === 'number' ? formData.guestCount : 30;

  const handleGuestChange = (delta: number) => {
    const nextVal = Math.max(5, Math.min(500, guestCount + delta));
    setFormData((prev) => ({ ...prev, guestCount: nextVal }));
  };

  const handleBarToggle = (bar: SelectedBarType) => {
    setFormData((prev) => {
      const exists = prev.selectedBars.includes(bar);
      const nextBars = exists
        ? prev.selectedBars.filter((b) => b !== bar)
        : [...prev.selectedBars, bar];
      return { ...prev, selectedBars: nextBars };
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.eventType) errs.eventType = 'Choisissez un type d’événement';
    if (!formData.eventDate) errs.eventDate = 'Indiquez une date';
    if (!formData.address.trim()) errs.address = 'Indiquez l’adresse de l’événement';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'Prénom et nom requis';
    if (!formData.phone.trim()) errs.phone = 'Numéro de téléphone requis';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Email valide requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleSubmitStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      submitBooking(formData);
    }
  };

  // Helper formatting for step 3 summary
  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '24 octobre 2026';

  const selectedBarsSummary = () => {
    const labels: string[] = [];
    if (formData.selectedBars.includes('cake-bar')) labels.push('Cake Bar');
    if (formData.selectedBars.includes('drinks')) labels.push('Boissons');
    if (formData.selectedBars.includes('charcuterie')) labels.push('Charcuterie');
    return labels.length > 0 ? labels.join(' + ') : 'Bars à composer';
  };

  return (
    <div className={`w-full bg-white ${isInline ? 'rounded-[32px] border border-solly-border shadow-solly-card' : 'rounded-[30px]'} overflow-hidden flex flex-col`}>
      {/* 1. TOP HEADER & CLOSE BUTTON */}
      <div className="px-6 py-5 border-b border-solly-border/70 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <SollyLogo height={28} />
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-solly-cream hover:bg-solly-cream-dark/60 border border-solly-border flex items-center justify-center text-solly-charcoal transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. PROGRESS STEPPER (Steps 1, 2, 3) */}
      {currentStep < 4 && (
        <div className="pt-6 pb-2 px-6 bg-white border-b border-solly-border/40 shrink-0">
          <div className="max-w-md mx-auto flex items-center justify-between relative">
            {/* Connecting Line 1-2 */}
            <div
              className={`absolute top-4 left-1/6 right-1/2 h-0.5 transition-colors duration-300 ${
                currentStep >= 2 ? 'bg-solly-pink' : 'bg-solly-border'
              }`}
            />
            {/* Connecting Line 2-3 */}
            <div
              className={`absolute top-4 left-1/2 right-1/6 h-0.5 transition-colors duration-300 ${
                currentStep >= 3 ? 'bg-solly-pink' : 'bg-solly-border'
              }`}
            />

            {/* Step 1: Événement */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex flex-col items-center relative z-10 cursor-pointer group focus:outline-none"
            >
              <div
                className={`w-8 h-8 rounded-full font-display font-bold text-xs flex items-center justify-center transition-all duration-200 shadow-2xs ${
                  currentStep === 1
                    ? 'bg-solly-pink text-white scale-110 shadow-solly-pink'
                    : 'bg-[#FCECEF] text-solly-pink border border-solly-pink/30'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 transition-colors ${
                  currentStep === 1 ? 'text-solly-pink' : 'text-solly-charcoal/70'
                }`}
              >
                Événement
              </span>
            </button>

            {/* Step 2: Envies */}
            <button
              type="button"
              onClick={() => currentStep > 1 && setCurrentStep(2)}
              className={`flex flex-col items-center relative z-10 focus:outline-none ${
                currentStep >= 2 ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full font-display font-bold text-xs flex items-center justify-center transition-all duration-200 shadow-2xs ${
                  currentStep === 2
                    ? 'bg-solly-pink text-white scale-110 shadow-solly-pink'
                    : currentStep > 2
                    ? 'bg-[#FCECEF] text-solly-pink border border-solly-pink/30'
                    : 'bg-white border border-solly-border text-solly-muted'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 transition-colors ${
                  currentStep === 2 ? 'text-solly-pink' : 'text-solly-charcoal/70'
                }`}
              >
                Envies
              </span>
            </button>

            {/* Step 3: Coordonnées */}
            <button
              type="button"
              onClick={() => currentStep > 2 && setCurrentStep(3)}
              className={`flex flex-col items-center relative z-10 focus:outline-none ${
                currentStep >= 3 ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full font-display font-bold text-xs flex items-center justify-center transition-all duration-200 shadow-2xs ${
                  currentStep === 3
                    ? 'bg-solly-pink text-white scale-110 shadow-solly-pink'
                    : 'bg-white border border-solly-border text-solly-muted'
                }`}
              >
                3
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 transition-colors ${
                  currentStep === 3 ? 'text-solly-pink' : 'text-solly-charcoal/70'
                }`}
              >
                Coordonnées
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. STEP CONTENT WITH FRAMER MOTION TRANSITIONS */}
      <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* STEP 01: VOTRE ÉVÉNEMENT */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <motion.form
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleNextFromStep1}
              className="max-w-xl mx-auto space-y-6"
            >
              {/* Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Parlons de votre fête.
                </h2>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                  Quelques détails pour imaginer votre prestation.
                </p>
              </div>

              {/* Row 1: Type d'événement & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type d'événement */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Type d’événement
                  </label>
                  <div className="relative">
                    <select
                      value={formData.eventType}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, eventType: e.target.value as EventType }));
                        setErrors((prev) => ({ ...prev, eventType: '' }));
                      }}
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold appearance-none focus:outline-none focus:border-solly-pink/60 transition-colors"
                    >
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.eventType && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.eventType}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, eventDate: e.target.value }));
                        setErrors((prev) => ({ ...prev, eventDate: '' }));
                      }}
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.eventDate && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.eventDate}</p>
                  )}
                </div>
              </div>

              {/* Heure souhaitée */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Heure souhaitée
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, eventTime: e.target.value }))}
                    className="w-full sm:w-1/2 bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <Clock className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 sm:right-auto sm:left-[45%] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Adresse de l'événement */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Adresse de l’événement
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, address: e.target.value }));
                      setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="Salle de réception, Dakar"
                    className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-4 py-3 text-sm text-solly-charcoal font-semibold placeholder:text-solly-charcoal/40 focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{errors.address}</p>
                )}
              </div>

              {/* Nombre d'invités (Interactive Counter) */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Nombre d’invités
                </label>
                <div className="flex items-center gap-4 bg-[#FAF7F2] border border-solly-border rounded-2xl p-2 max-w-[220px]">
                  <button
                    type="button"
                    onClick={() => handleGuestChange(-5)}
                    className="w-9 h-9 rounded-xl bg-white border border-solly-border flex items-center justify-center text-solly-charcoal hover:bg-solly-pink-soft hover:text-solly-pink transition-colors cursor-pointer shadow-2xs"
                    aria-label="Diminuer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <motion.div
                    key={guestCount}
                    initial={{ scale: 1.25, color: '#DE1B52' }}
                    animate={{ scale: 1, color: '#2E1C14' }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 text-center font-display font-black text-lg text-solly-charcoal select-none"
                  >
                    {guestCount}
                  </motion.div>

                  <button
                    type="button"
                    onClick={() => handleGuestChange(5)}
                    className="w-9 h-9 rounded-xl bg-white border border-solly-border flex items-center justify-center text-solly-charcoal hover:bg-solly-pink-soft hover:text-solly-pink transition-colors cursor-pointer shadow-2xs"
                    aria-label="Augmenter"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Yellow Note Banner */}
              <div className="bg-[#FFF9E6] border border-[#FDE68A] text-solly-charcoal/90 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-medium">
                <Sparkle size={16} color="#DE1B52" />
                <span>Vous pourrez préciser les détails avec notre équipe.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Continuer</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* ========================================================= */}
          {/* STEP 02: VOS ENVIES (GAMIFIED BARS) */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <motion.form
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleNextFromStep2}
              className="max-w-xl mx-auto space-y-6"
            >
              {/* Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Qu’est-ce qui vous ferait plaisir ?
                </h2>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                  Vous pouvez choisir plusieurs bars.
                </p>
              </div>

              {/* 3 Visual Interactive Bar Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* 1. Cake Bar */}
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBarToggle('cake-bar')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('cake-bar')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  {/* Photo */}
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/gateau-marshmallow.png"
                      alt="Cake Bar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Check Badge in Top Right */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('cake-bar')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/80 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  {/* Label */}
                  <div className="py-2.5 px-2 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal">
                      Cake Bar
                    </span>
                  </div>
                </motion.div>

                {/* 2. Boissons */}
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBarToggle('drinks')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('drinks')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  {/* Photo */}
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/jus-glaces-ananas-bissap.png"
                      alt="Bar à boissons"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Check Badge in Top Right */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('drinks')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/80 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  {/* Label */}
                  <div className="py-2.5 px-2 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal">
                      Boissons
                    </span>
                  </div>
                </motion.div>

                {/* 3. Charcuterie */}
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBarToggle('charcuterie')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('charcuterie')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  {/* Photo */}
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/pot-charcuterie-partage.png"
                      alt="Bar à charcuterie"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Check Badge in Top Right */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('charcuterie')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/80 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  {/* Label */}
                  <div className="py-2.5 px-2 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal">
                      Charcuterie
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Checkbox: Je souhaite être conseillé(e) */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-solly-charcoal/90 select-none">
                <input
                  type="checkbox"
                  checked={formData.isAdvised}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isAdvised: e.target.checked }))}
                  className="w-4 h-4 rounded text-solly-pink accent-solly-pink cursor-pointer"
                />
                <span>Je souhaite être conseillé(e)</span>
              </label>

              {/* Dynamic Encart: Vos choix enregistrés */}
              <div className="bg-[#FAF7F2] border border-solly-border/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-solly-charcoal uppercase tracking-wider">
                    Vos choix enregistrés :
                  </span>
                  {orderChoices.cakeBar && (
                    <span className="text-[11px] font-semibold bg-white border border-solly-border px-2.5 py-1 rounded-full text-solly-charcoal">
                      {orderChoices.cakeBar.barquette ? `${orderChoices.cakeBar.barquette} • ` : ''}{orderChoices.cakeBar.base} • {orderChoices.cakeBar.sauces[0] || 'Chocolat'} • {orderChoices.cakeBar.composants[0] || 'Oreo'}
                    </span>
                  )}
                  {orderChoices.drinks && orderChoices.drinks.length > 0 && (
                    <span className="text-[11px] font-semibold bg-white border border-solly-border px-2.5 py-1 rounded-full text-solly-charcoal">
                      {orderChoices.drinks.join(' • ')}
                    </span>
                  )}
                </div>
                <Link
                  href="/experiences"
                  onClick={() => onClose && onClose()}
                  className="text-xs font-bold text-solly-pink hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Modifier</span>
                </Link>
              </div>

              {/* Section Personnalisation */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-2">
                  Personnalisation
                </label>
                <div className="flex items-center gap-6">
                  {(['oui', 'non', 'a-definir'] as const).map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-solly-charcoal select-none"
                    >
                      <input
                        type="radio"
                        name="personalization"
                        value={opt}
                        checked={formData.personalization === opt}
                        onChange={() => setFormData((prev) => ({ ...prev, personalization: opt }))}
                        className="accent-solly-pink w-4 h-4 cursor-pointer"
                      />
                      <span>{opt === 'oui' ? 'Oui' : opt === 'non' ? 'Non' : 'À définir'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section Thème ou couleurs */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Thème ou couleurs
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, themeColor: e.target.value }))}
                    placeholder="Dinosaures, vert et beige"
                    className="flex-1 bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setInspirationAdded(!inspirationAdded)}
                    className="px-4 py-3 rounded-2xl border border-solly-pink text-solly-pink text-xs font-bold hover:bg-solly-pink-soft transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{inspirationAdded ? 'Inspiration liée ✓' : 'Ajouter une inspiration'}</span>
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs sm:text-sm font-bold text-solly-muted hover:text-solly-charcoal transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="px-9 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Continuer</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* ========================================================= */}
          {/* STEP 03: VOS COORDONNÉES */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <motion.form
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmitStep3}
              className="max-w-xl mx-auto space-y-6"
            >
              {/* Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Comment vous contacter ?
                </h2>
              </div>

              {/* Nom & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Nom et prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }));
                      setErrors((prev) => ({ ...prev, firstName: '' }));
                    }}
                    placeholder="Votre nom"
                    className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  {errors.firstName && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, phone: e.target.value }));
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="+221 ..."
                    className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="votre@email.com"
                  className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{errors.email}</p>
                )}
              </div>

              {/* Un détail à nous préciser ? (optionnel) */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Un détail à nous préciser ? <span className="text-solly-muted font-normal">(optionnel)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Votre message..."
                  className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl p-3.5 text-sm text-solly-charcoal font-medium focus:outline-none focus:border-solly-pink/60 transition-colors resize-none"
                />
              </div>

              {/* Summary Card: Votre demande en un coup d'œil */}
              <div className="bg-[#FCECEF] border border-solly-pink/20 rounded-2xl p-4 sm:p-5 text-solly-charcoal">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-solly-pink/30 flex items-center justify-center text-solly-pink shrink-0 mt-0.5 shadow-2xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                        Votre demande en un coup d’œil
                      </h4>
                      <div className="mt-1 space-y-0.5 text-xs text-solly-charcoal/80 font-medium">
                        <p>
                          {formData.eventType || 'Anniversaire'} • {formattedDate} • {formData.eventTime || '16 h'}
                        </p>
                        <p>
                          {guestCount} invités • {formData.address || 'Dakar'}
                        </p>
                        <p>
                          {selectedBarsSummary()} • {formData.personalization === 'oui' ? 'Personnalisation' : 'Sans personnalisation'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-solly-pink hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 text-xs text-solly-muted font-medium">
                <Info className="w-4 h-4 text-solly-charcoal/60 shrink-0" />
                <span>La disponibilité et la réservation seront confirmées par notre équipe.</span>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs sm:text-sm font-bold text-solly-muted hover:text-solly-charcoal transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="px-9 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Envoyer ma demande</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* ========================================================= */}
          {/* STEP 04: DEMANDE REÇUE (CONFIRMATION) */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto text-center py-4 space-y-6"
            >
              {/* Graphic Illustration: Yellow circle + envelope heart + 4 sparkles */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                {/* 4 Sparkles around */}
                <Sparkle size={18} color="#DE1B52" className="absolute -top-1 -right-1 animate-bounce" />
                <Sparkle size={14} color="#DE1B52" className="absolute -bottom-1 -left-2 animate-pulse" />
                <Sparkle size={12} color="#DE1B52" className="absolute top-1/2 -left-4" />
                <Sparkle size={16} color="#DE1B52" className="absolute top-2 -left-2" />

                {/* Sun Circle */}
                <div className="w-24 h-24 rounded-full bg-[#FFF8E3] border-2 border-[#FDE68A] flex items-center justify-center shadow-solly-soft">
                  {/* Envelope Heart Vector */}
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 46 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Envelope Body */}
                    <rect x="7" y="12" width="32" height="24" rx="4" fill="white" stroke="#DE1B52" strokeWidth="2.5" />
                    {/* Flap lines */}
                    <path d="M7 15L23 27L39 15" stroke="#DE1B52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Heart badge in center */}
                    <path
                      d="M23 25C21.8 23.5 19.5 23.5 18.5 24.8C17.5 26.2 18 28.5 23 31.5C28 28.5 28.5 26.2 27.5 24.8C26.5 23.5 24.2 23.5 23 25Z"
                      fill="#DE1B52"
                    />
                  </svg>
                </div>
              </div>

              {/* Headline & Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-solly-pink tracking-tight">
                  Merci pour votre demande !
                </h2>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-solly-charcoal mt-1">
                  Votre message a bien été reçu.
                </h3>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-2 leading-relaxed">
                  Nous reviendrons vers vous pour préciser votre projet et vous proposer un devis.
                </p>
              </div>

              {/* Alert Pink Banner */}
              <div className="bg-[#FCECEF] border border-solly-pink/20 text-solly-pink rounded-2xl p-3 text-xs font-bold inline-flex items-center gap-1.5 mx-auto">
                <Sparkle size={14} color="#DE1B52" />
                <span>Votre réservation n’est pas encore confirmée.</span>
              </div>

              {/* Primary Action: WhatsApp Direct Link */}
              <div className="space-y-1.5 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Poursuivre sur WhatsApp</span>
                </a>
                <p className="text-[11px] text-solly-muted font-medium">
                  Votre récapitulatif sera prêt à envoyer.
                </p>
              </div>

              {/* Secondary Action: Retour au site */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    resetBooking();
                  }}
                  className="px-8 py-2.5 rounded-full bg-white border border-solly-pink text-solly-pink font-display font-bold text-xs sm:text-sm hover:bg-solly-pink-soft transition-colors cursor-pointer"
                >
                  Retour au site
                </button>
              </div>

              {/* Bottom Signature */}
              <div className="pt-4 border-t border-solly-border/60 flex flex-col items-center">
                <SollyLogo height={24} />
                <p className="text-[11px] text-solly-charcoal/70 font-medium mt-1">
                  La beauté en bouchées.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
