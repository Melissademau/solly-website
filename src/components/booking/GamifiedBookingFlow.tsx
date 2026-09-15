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
  Phone,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';
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

const TIME_SLOTS = [
  { label: 'Après-midi (14h - 18h)', value: 'Après-midi (14h - 18h)' },
  { label: 'Matinée (10h - 13h)', value: 'Matinée (10h - 13h)' },
  { label: 'Soirée (19h - 23h)', value: 'Soirée (19h - 23h)' },
];

const GUEST_PRESETS = [15, 30, 50, 75, 100];
const DAKAR_QUICK_AREAS = ['Almadies', 'Plateau', 'Ngor', 'Point E', 'Mamelles'];

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
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Counter logic for guest count
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
    if (!formData.address.trim()) errs.address = 'Indiquez l’adresse de l’événement à Dakar';
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

  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'À définir';

  const selectedBarsSummary = () => {
    const labels: string[] = [];
    if (formData.selectedBars.includes('cake-bar')) labels.push('Cake Bar');
    if (formData.selectedBars.includes('drinks')) labels.push('Boissons');
    if (formData.selectedBars.includes('charcuterie')) labels.push('Charcuterie');
    return labels.length > 0 ? labels.join(' + ') : 'Bars à composer';
  };

  return (
    <div
      className={`w-full bg-white ${
        isInline ? 'rounded-[28px] sm:rounded-[32px] border border-solly-border shadow-solly-card' : 'rounded-t-[32px] sm:rounded-[30px]'
      } overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]`}
    >
      {/* 0. MOBILE BOTTOM SHEET DRAG HANDLE (Visible only in modal on small screens) */}
      {!isInline && (
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center bg-white shrink-0">
          <div className="w-12 h-1.5 bg-solly-charcoal/20 rounded-full" />
        </div>
      )}

      {/* 1. TOP HEADER & CLOSE BUTTON */}
      <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-solly-border/70 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <SollyLogo height={26} />
        </div>

        {/* Step Indicator Badge on Mobile */}
        {currentStep < 4 && (
          <div className="flex sm:hidden items-center gap-1.5 bg-solly-pink-soft px-3 py-1 rounded-full border border-solly-pink/20">
            <span className="text-[11px] font-extrabold text-solly-pink">
              Étape {currentStep}/3
            </span>
          </div>
        )}

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
        <div className="pt-3.5 pb-2.5 px-4 sm:px-6 bg-white border-b border-solly-border/40 shrink-0">
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
              className="flex flex-col items-center relative z-10 cursor-pointer group focus:outline-none min-w-[64px]"
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
                className={`text-[11px] font-bold mt-1 transition-colors ${
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
              className={`flex flex-col items-center relative z-10 focus:outline-none min-w-[64px] ${
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
                className={`text-[11px] font-bold mt-1 transition-colors ${
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
              className={`flex flex-col items-center relative z-10 focus:outline-none min-w-[64px] ${
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
                className={`text-[11px] font-bold mt-1 transition-colors ${
                  currentStep === 3 ? 'text-solly-pink' : 'text-solly-charcoal/70'
                }`}
              >
                Coordonnées
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. STEP CONTENT WITH SMOOTH MOBILE SCROLL */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:p-8 overscroll-contain">
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
              transition={{ duration: 0.22 }}
              onSubmit={handleNextFromStep1}
              className="max-w-xl mx-auto space-y-5 sm:space-y-6 pb-2"
            >
              {/* Heading */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Parlons de votre fête.
                </h2>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                  Quelques détails pour imaginer votre prestation à Dakar.
                </p>
              </div>

              {/* Type d'événement & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type d'événement */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Type d’événement <span className="text-solly-pink">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.eventType}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, eventType: e.target.value as EventType }));
                        setErrors((prev) => ({ ...prev, eventType: '' }));
                      }}
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold appearance-none focus:outline-none focus:border-solly-pink/60 transition-colors"
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
                    Date de l’événement <span className="text-solly-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.eventDate}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, eventDate: e.target.value }));
                        setErrors((prev) => ({ ...prev, eventDate: '' }));
                      }}
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-solly-charcoal/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.eventDate && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.eventDate}</p>
                  )}
                </div>
              </div>

              {/* Heure souhaitée : Quick Touch Chips + Custom Time */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Créneau ou heure souhaitée
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = formData.eventTime === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, eventTime: slot.value }));
                          setShowCustomTime(false);
                        }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-solly-pink-soft text-solly-pink border-solly-pink shadow-2xs'
                            : 'bg-[#FAF7F2] text-solly-charcoal/80 border-solly-border hover:border-solly-pink/40'
                        }`}
                      >
                        <span>{slot.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-solly-pink shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Option for custom specific time */}
                <div className="mt-2 flex items-center justify-between">
                  {!showCustomTime ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomTime(true)}
                      className="text-[11px] font-bold text-solly-pink hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Indiquer une heure précise (ex: 16h30)</span>
                    </button>
                  ) : (
                    <div className="w-full pt-1 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="time"
                          value={formData.eventTime.includes(':') ? formData.eventTime : '16:00'}
                          onChange={(e) => setFormData((prev) => ({ ...prev, eventTime: e.target.value }))}
                          className="w-full bg-[#FAF7F2] border border-solly-border rounded-xl px-3 py-2 text-base sm:text-xs text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCustomTime(false)}
                        className="text-xs text-solly-muted hover:text-solly-charcoal px-2 py-1"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse de l'événement & Dakar Quick Chips */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Lieu / Adresse à Dakar <span className="text-solly-pink">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address}
                    autoComplete="street-address"
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, address: e.target.value }));
                      setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="Ex: Villa aux Almadies, Salle Ngor, Domicile..."
                    className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-solly-charcoal font-semibold placeholder:text-solly-charcoal/40 focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{errors.address}</p>
                )}

                {/* Quick Area Chips for Dakar */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-bold text-solly-muted mr-1">Suggestions :</span>
                  {DAKAR_QUICK_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          address: prev.address ? `${prev.address}, ${area}` : area,
                        }));
                        setErrors((prev) => ({ ...prev, address: '' }));
                      }}
                      className="text-[11px] font-semibold bg-solly-cream border border-solly-border hover:border-solly-pink/50 hover:bg-solly-pink-soft hover:text-solly-pink px-2.5 py-1 rounded-lg text-solly-charcoal/80 transition-colors cursor-pointer"
                    >
                      + {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre d'invités (Mobile tactile counter + Presets) */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Nombre d’invités estimé
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-[#FAF7F2] border border-solly-border rounded-2xl p-1.5">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleGuestChange(-5)}
                      className="w-11 h-11 rounded-xl bg-white border border-solly-border flex items-center justify-center text-solly-charcoal hover:bg-solly-pink-soft hover:text-solly-pink transition-colors cursor-pointer shadow-2xs"
                      aria-label="Diminuer le nombre d'invités"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>

                    <motion.div
                      key={guestCount}
                      initial={{ scale: 1.2, color: '#DE1B52' }}
                      animate={{ scale: 1, color: '#2E1C14' }}
                      transition={{ duration: 0.15 }}
                      className="min-w-[54px] text-center font-display font-black text-xl text-solly-charcoal select-none"
                    >
                      {guestCount}
                    </motion.div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleGuestChange(5)}
                      className="w-11 h-11 rounded-xl bg-white border border-solly-border flex items-center justify-center text-solly-charcoal hover:bg-solly-pink-soft hover:text-solly-pink transition-colors cursor-pointer shadow-2xs"
                      aria-label="Augmenter le nombre d'invités"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <span className="text-xs text-solly-muted font-medium">personnes</span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-bold text-solly-muted mr-1">Raccourcis :</span>
                  {GUEST_PRESETS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, guestCount: count }))}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        guestCount === count
                          ? 'bg-solly-pink text-white border-solly-pink shadow-2xs'
                          : 'bg-white text-solly-charcoal/70 border-solly-border hover:bg-solly-cream'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yellow Note Banner */}
              <div className="bg-[#FFF9E6] border border-[#FDE68A] text-solly-charcoal/90 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-medium">
                <Sparkle size={16} color="#DE1B52" className="shrink-0" />
                <span>Formules clés en main à partir de 80 000 FCFA. Devis personnalisé sous 24h.</span>
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
              transition={{ duration: 0.22 }}
              onSubmit={handleNextFromStep2}
              className="max-w-xl mx-auto space-y-5 sm:space-y-6 pb-2"
            >
              {/* Heading */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Qu’est-ce qui vous ferait plaisir ?
                </h2>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                  Sélectionnez un ou plusieurs bars gourmands pour votre événement.
                </p>
              </div>

              {/* 3 Visual Interactive Bar Cards - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {/* 1. Cake Bar */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBarToggle('cake-bar')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('cake-bar')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/gateau-marshmallow.png"
                      alt="Cake Bar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('cake-bar')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/85 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <div className="py-2 sm:py-2.5 px-1.5 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block truncate">
                      Cake Bar
                    </span>
                    <span className="hidden sm:block text-[10px] text-solly-muted mt-0.5">
                      Gâteaux minute
                    </span>
                  </div>
                </motion.div>

                {/* 2. Boissons */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBarToggle('drinks')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('drinks')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/jus-glaces-ananas-bissap.png"
                      alt="Bar à boissons"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('drinks')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/85 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <div className="py-2 sm:py-2.5 px-1.5 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block truncate">
                      Boissons
                    </span>
                    <span className="hidden sm:block text-[10px] text-solly-muted mt-0.5">
                      Jus frais locaux
                    </span>
                  </div>
                </motion.div>

                {/* 3. Charcuterie */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBarToggle('charcuterie')}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                    formData.selectedBars.includes('charcuterie')
                      ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                      : 'border-solly-border hover:border-solly-pink/40'
                  }`}
                >
                  <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                    <img
                      src="/images/solly-assets/05-experience/pot-charcuterie-partage.png"
                      alt="Bar à charcuterie"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        formData.selectedBars.includes('charcuterie')
                          ? 'bg-solly-pink text-white shadow-sm scale-110'
                          : 'bg-white/85 border border-solly-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <div className="py-2 sm:py-2.5 px-1.5 text-center">
                    <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block truncate">
                      Charcuterie
                    </span>
                    <span className="hidden sm:block text-[10px] text-solly-muted mt-0.5">
                      Cornets salés
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Large touch card: Je souhaite être conseillé(e) */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, isAdvised: !prev.isAdvised }))}
                className="p-3 rounded-2xl border border-solly-border hover:border-solly-pink/40 bg-white flex items-center gap-3 cursor-pointer transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    formData.isAdvised
                      ? 'bg-solly-pink text-white'
                      : 'border border-solly-border text-transparent bg-[#FAF7F2]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-solly-charcoal">
                  Je souhaite être conseillé(e) sur le choix et les quantités
                </span>
              </div>

              {/* Dynamic Encart: Vos choix enregistrés */}
              {(orderChoices.cakeBar || (orderChoices.drinks && orderChoices.drinks.length > 0)) && (
                <div className="bg-[#FAF7F2] border border-solly-border/80 rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-solly-charcoal uppercase tracking-wider">
                      Vos choix enregistrés :
                    </span>
                    {orderChoices.cakeBar && (
                      <span className="text-[11px] font-semibold bg-white border border-solly-border px-2.5 py-1 rounded-full text-solly-charcoal">
                        {orderChoices.cakeBar.barquette ? `${orderChoices.cakeBar.barquette} • ` : ''}
                        {orderChoices.cakeBar.base} • {orderChoices.cakeBar.sauces[0] || 'Chocolat'}
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
              )}

              {/* Section Personnalisation : Segmented Pills (Mobile Friendly) */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-2">
                  Personnalisation au nom de l’enfant ou de l’événement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'oui', label: '✨ Oui' },
                    { id: 'non', label: 'Non' },
                    { id: 'a-definir', label: '💬 À définir' },
                  ].map((opt) => {
                    const isSelected = formData.personalization === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            personalization: opt.id as 'oui' | 'non' | 'a-definir',
                          }))
                        }
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center cursor-pointer ${
                          isSelected
                            ? 'bg-solly-pink text-white border-solly-pink shadow-solly-pink'
                            : 'bg-[#FAF7F2] text-solly-charcoal border-solly-border hover:bg-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section Thème ou couleurs */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Thème ou couleurs souhaitées
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, themeColor: e.target.value }))}
                    placeholder="Ex: Pastel rose & or, Safari dinosaure, Bleu ciel..."
                    className="flex-1 bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setInspirationAdded(!inspirationAdded)}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                      inspirationAdded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'border-solly-pink text-solly-pink hover:bg-solly-pink-soft'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{inspirationAdded ? 'Inspiration notée ✓' : 'Ajouter une inspiration'}</span>
                  </button>
                </div>
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
              transition={{ duration: 0.22 }}
              onSubmit={handleSubmitStep3}
              className="max-w-xl mx-auto space-y-4 sm:space-y-5 pb-2"
            >
              {/* Heading */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                  Comment vous contacter ?
                </h2>
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                  Pour vous transmettre votre devis et échanger sur vos envies.
                </p>
              </div>

              {/* Nom & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Nom et prénom <span className="text-solly-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="name"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, firstName: e.target.value }));
                        setErrors((prev) => ({ ...prev, firstName: '' }));
                      }}
                      placeholder="Votre nom"
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                    />
                    <User className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.firstName && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Téléphone (WhatsApp) <span className="text-solly-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, phone: e.target.value }));
                        setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="+221 77 000 00 00"
                      className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                    />
                    <Phone className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 font-bold mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                  Adresse email <span className="text-solly-pink">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }));
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="exemple@email.com"
                    className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
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
                  placeholder="Allergies, accès spécifique, créneau d'installation..."
                  className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl p-3.5 text-base sm:text-sm text-solly-charcoal font-medium focus:outline-none focus:border-solly-pink/60 transition-colors resize-none"
                />
              </div>

              {/* Summary Card: Votre demande en un coup d'œil */}
              <div className="bg-[#FCECEF] border border-solly-pink/20 rounded-2xl p-3.5 sm:p-4 text-solly-charcoal">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-solly-pink/30 flex items-center justify-center text-solly-pink shrink-0 mt-0.5 shadow-2xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-xs sm:text-sm text-solly-charcoal">
                        Votre demande en un coup d’œil
                      </h4>
                      <div className="mt-1 space-y-0.5 text-[11px] sm:text-xs text-solly-charcoal/80 font-medium">
                        <p>
                          {formData.eventType || 'Événement'} • {formattedDate} • {formData.eventTime || 'Après-midi'}
                        </p>
                        <p>
                          {guestCount} invités • {formData.address || 'Dakar'}
                        </p>
                        <p>
                          {selectedBarsSummary()} •{' '}
                          {formData.personalization === 'oui' ? 'Personnalisé' : 'Standard'}
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
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-solly-muted font-medium">
                <Info className="w-4 h-4 text-solly-charcoal/60 shrink-0" />
                <span>Réponse et devis gratuit sous 24h ouvrées. Sans engagement.</span>
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
              transition={{ duration: 0.28 }}
              className="max-w-md mx-auto text-center py-2 sm:py-4 space-y-4 sm:space-y-5"
            >
              {/* Graphic Illustration */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                <Sparkle size={18} color="#DE1B52" className="absolute -top-1 -right-1 animate-bounce" />
                <Sparkle size={14} color="#DE1B52" className="absolute -bottom-1 -left-2 animate-pulse" />
                <Sparkle size={12} color="#DE1B52" className="absolute top-1/2 -left-3" />
                <Sparkle size={16} color="#DE1B52" className="absolute top-2 -left-2" />

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFF8E3] border-2 border-[#FDE68A] flex items-center justify-center shadow-solly-soft">
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 46 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="7" y="12" width="32" height="24" rx="4" fill="white" stroke="#DE1B52" strokeWidth="2.5" />
                    <path d="M7 15L23 27L39 15" stroke="#DE1B52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1.5 leading-relaxed px-2">
                  Notre équipe étudie votre demande et revient vers vous sous 24h ouvrées avec votre devis détaillé.
                </p>
              </div>

              {/* Alert Pink Banner */}
              <div className="bg-[#FCECEF] border border-solly-pink/20 text-solly-pink rounded-2xl p-2.5 sm:p-3 text-xs font-bold inline-flex items-center gap-1.5 mx-auto">
                <Sparkle size={14} color="#DE1B52" />
                <span>Votre réservation n’est pas encore confirmée.</span>
              </div>

              {/* Primary Action: WhatsApp Direct Link */}
              <div className="space-y-1.5 pt-1">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#25D366] text-white font-display font-bold text-sm sm:text-base hover:bg-[#1EBE5D] shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Poursuivre sur WhatsApp (recommandé)</span>
                </a>
                <p className="text-[11px] text-solly-muted font-medium">
                  Votre récapitulatif complet sera déjà pré-rempli.
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
                  className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-white border border-solly-pink text-solly-pink font-display font-bold text-xs sm:text-sm hover:bg-solly-pink-soft transition-colors cursor-pointer"
                >
                  Retour au site
                </button>
              </div>

              {/* Bottom Signature */}
              <div className="pt-3 border-t border-solly-border/60 flex flex-col items-center">
                <SollyLogo height={22} />
                <p className="text-[10px] text-solly-charcoal/70 font-medium mt-0.5">
                  La beauté en bouchées.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. STICKY THUMB-ZONE ACTION FOOTER (Always within easy reach on mobile) */}
      {currentStep < 4 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3.5 sm:px-8 sm:py-4 border-t border-solly-border/70 flex items-center justify-between z-20 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep === 3 ? 2 : 1)}
              className="text-xs sm:text-sm font-bold text-solly-muted hover:text-solly-charcoal transition-colors cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl hover:bg-solly-cream"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          ) : (
            <div className="text-[11px] text-solly-muted font-semibold hidden sm:block">
              ✦ Réservation rapide en 3 étapes
            </div>
          )}

          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="w-full sm:w-auto ml-auto px-8 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continuer vers les bars</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNextFromStep2}
              className="w-auto ml-auto px-8 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleSubmitStep3}
              className="w-auto ml-auto px-7 sm:px-9 py-3.5 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Envoyer ma demande</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
