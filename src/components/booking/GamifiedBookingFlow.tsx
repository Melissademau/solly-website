'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Plus,
  Minus,
  Phone,
  User,
  CheckCircle2,
  SlidersHorizontal,
  Loader2,
  Mail,
  HelpCircle,
  UtensilsCrossed,
  Palette,
} from 'lucide-react';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';
import {
  useBooking,
  EventType,
  ExperienceId,
  getExperienceLabel,
  calculateMinimumBudget,
} from '@/context/BookingContext';
import { formatPriceFCFA } from '@/lib/pricing';

interface GamifiedBookingFlowProps {
  onClose?: () => void;
  isInline?: boolean;
}

const EVENT_TYPE_OPTIONS: EventType[] = [
  'Anniversaire',
  'Baptême',
  'Mariage',
  'Baby shower',
  "Événement d’entreprise",
  'Activation de marque',
  'Autre',
];

const TIME_SLOTS = [
  { label: 'Après-midi (14h - 18h)', value: 'Après-midi (14h - 18h)' },
  { label: 'Matinée (10h - 13h)', value: 'Matinée (10h - 13h)' },
  { label: 'Soirée (19h - 23h)', value: 'Soirée (19h - 23h)' },
];

const GUEST_PRESETS = [20, 25, 30, 40, 50, 75, 100];
const DAKAR_QUICK_AREAS = ['Almadies', 'Plateau', 'Ngor', 'Point E', 'Mamelles', 'Fann Résidence'];

const COUNTRY_CODES = [
  { country: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { country: 'France', code: '+33', flag: '🇫🇷' },
  { country: "Côte d'Ivoire", code: '+225', flag: '🇨🇮' },
  { country: 'Mali', code: '+223', flag: '🇲🇱' },
  { country: 'Guinée', code: '+224', flag: '🇬🇳' },
  { country: 'Gabon', code: '+241', flag: '🇬🇦' },
  { country: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { country: 'Maroc', code: '+212', flag: '🇲🇦' },
  { country: 'États-Unis / Canada', code: '+1', flag: '🇺🇸' },
  { country: 'Belgique', code: '+32', flag: '🇧🇪' },
  { country: 'Suisse', code: '+41', flag: '🇨🇭' },
  { country: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
];

const EXPERIENCES_CATALOG = [
  {
    id: 'mini-pancakes' as ExperienceId,
    title: 'Mini Pancakes',
    subtitle: 'Moelleux, dorés à la machine officielle Solly et nappés minute',
    tag: 'Nouveau & Ludique',
    image: '/images/mini-pancakes/pancakes-preview.webp',
  },
  {
    id: 'croffles' as ExperienceId,
    title: 'Croffles',
    subtitle: 'Croustillants, dorés et caramélisés, servis chauds',
    tag: 'Tendance & Gourmand',
    image: '/images/croffles/croffle-preview.webp',
  },
  {
    id: 'cake-bar' as ExperienceId,
    title: 'Cake Bar',
    subtitle: 'Gâteaux individuels généreux découpés et nappés à la minute',
    tag: 'Signature Solly',
    image: '/images/cake-bar/cake-bar-two-cakes.jpg',
  },
  {
    id: 'charcuterie' as ExperienceId,
    title: 'Charcuterie',
    subtitle: 'Cornets et pots apéritifs chics avec fromages, salaisons et fruits',
    tag: 'L’accord salé chic',
    image: '/images/solly-assets/04-charcuterie/aperitif-gourmand.png',
  },
];

const BUDGET_PRESETS = [80000, 100000, 150000, 200000, 300000, 500000, 1000000];

export function GamifiedBookingFlow({ onClose, isInline = false }: GamifiedBookingFlowProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    submitBooking,
    resetBooking,
    getWhatsAppUrl,
    bookingRef,
    setBookingRef,
    isSubmitted,
  } = useBooking();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute dynamic minimum budget
  const effectiveGuests =
    typeof formData.guestCount === 'number' && !isNaN(formData.guestCount) && formData.guestCount >= 20
      ? formData.guestCount
      : 20;

  const dynamicMinBudget = calculateMinimumBudget(effectiveGuests);

  // Synchronize budgetDesired if it falls below the dynamic min budget
  useEffect(() => {
    if (!formData.budgetDesired || formData.budgetDesired < dynamicMinBudget) {
      setFormData((prev) => ({
        ...prev,
        budgetMinimum: dynamicMinBudget,
        budgetDesired: dynamicMinBudget,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        budgetMinimum: dynamicMinBudget,
      }));
    }
  }, [dynamicMinBudget, formData.budgetDesired, setFormData]);

  // Guest count adjuster
  const handleGuestChange = (delta: number) => {
    const current = typeof formData.guestCount === 'number' ? formData.guestCount : 20;
    const nextVal = Math.max(20, current + delta);
    const nextMin = calculateMinimumBudget(nextVal);
    setFormData((prev) => ({
      ...prev,
      guestCount: nextVal,
      budgetMinimum: nextMin,
      budgetDesired: Math.max(nextMin, prev.budgetDesired || nextMin),
    }));
    setErrors((prev) => ({ ...prev, guestCount: '' }));
  };

  // Toggle experience selection
  const toggleExperience = (id: ExperienceId) => {
    setFormData((prev) => {
      const exists = prev.selectedExperiences.includes(id);
      let updated: ExperienceId[];
      if (exists) {
        if (prev.selectedExperiences.length === 1) {
          // Keep at least one selected
          return prev;
        }
        updated = prev.selectedExperiences.filter((item) => item !== id);
      } else {
        updated = [...prev.selectedExperiences, id];
      }
      return {
        ...prev,
        selectedExperiences: updated,
      };
    });
    setErrors((prev) => ({ ...prev, selectedExperiences: '' }));
  };

  // Step 1 validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.eventType) errs.eventType = 'Veuillez choisir un type d’événement';
    if (!formData.eventDate) errs.eventDate = 'Veuillez indiquer la date souhaitée';
    if (!formData.address.trim()) errs.address = 'Veuillez préciser le lieu ou quartier';
    if (!formData.guestCount || formData.guestCount < 20) {
      errs.guestCount = 'Le minimum est de 20 invités';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.selectedExperiences || formData.selectedExperiences.length === 0) {
      errs.selectedExperiences = 'Veuillez sélectionner au moins une expérience';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 validation
  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!formData.personalization) {
      errs.personalization = 'Veuillez faire un choix pour continuer';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 validation & Submit
  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'Veuillez indiquer votre nom complet';
    if (!formData.phone.trim()) errs.phone = 'Numéro de téléphone requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setIsSubmitting(true);

    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const generatedRef = `SOL-${yy}${mm}${dd}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingRef: generatedRef,
          formData: {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName,
            location: formData.address,
            budgetMinimum: dynamicMinBudget,
            budgetDesired: Math.max(dynamicMinBudget, formData.budgetDesired || dynamicMinBudget),
            experiences: formData.selectedExperiences.map((id) => getExperienceLabel(id)),
          },
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const refToUse = resData.bookingRef || generatedRef;
        setBookingRef(refToUse);
        await submitBooking(formData, refToUse);
      } else {
        setBookingRef(generatedRef);
        await submitBooking(formData, generatedRef);
      }
    } catch (err) {
      console.error('[Booking Submit] Network or API error:', err);
      setBookingRef(generatedRef);
      await submitBooking(formData, generatedRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date à définir';

  const stepsList = [
    { num: 1, label: 'Événement' },
    { num: 2, label: 'Expériences' },
    { num: 3, label: 'Personnalisation' },
    { num: 4, label: 'Budget' },
  ];

  return (
    <div
      className={`w-full bg-white ${
        isInline
          ? 'rounded-[28px] sm:rounded-[32px] border border-solly-border shadow-solly-card'
          : 'rounded-t-[32px] sm:rounded-[30px]'
      } overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]`}
    >
      {/* 0. MOBILE BOTTOM SHEET DRAG HANDLE */}
      {!isInline && (
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center bg-white shrink-0">
          <div className="w-12 h-1.5 bg-solly-charcoal/20 rounded-full" />
        </div>
      )}

      {/* 1. TOP HEADER & PROGRESS BAR */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-solly-border/70 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <SollyLogo height={24} />
        </div>

        {/* Step Indicator on Mobile */}
        {!isSubmitted && (
          <div className="flex sm:hidden items-center gap-1.5 bg-solly-pink-soft px-3 py-1 rounded-full border border-solly-pink/20">
            <span className="text-[11px] font-extrabold text-solly-pink">
              Étape {currentStep}/4
            </span>
          </div>
        )}

        {/* Desktop Step Stepper */}
        {!isSubmitted && (
          <div className="hidden sm:flex items-center gap-3">
            {stepsList.map((s, idx) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-solly-pink text-white shadow-2xs'
                          : isPast
                          ? 'bg-solly-pink/20 text-solly-pink'
                          : 'bg-solly-cream text-solly-muted'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'text-solly-pink'
                          : isPast
                          ? 'text-solly-charcoal'
                          : 'text-solly-muted'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`w-6 h-0.5 rounded-full ${
                        currentStep > s.num ? 'bg-solly-pink' : 'bg-solly-border'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-solly-cream hover:bg-solly-cream-dark/60 border border-solly-border flex items-center justify-center text-solly-charcoal transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:p-7 overscroll-contain">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* SCREEN: CONFIRMATION APRÈS ENVOI */}
          {/* ========================================================= */}
          {isSubmitted ? (
            <motion.div
              key="submitted-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
              className="max-w-md mx-auto text-center py-2 sm:py-4 space-y-4"
            >
              {/* Sparkle graphic */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <Sparkle size={18} color="#DE1B52" className="absolute -top-1 -right-1 animate-bounce" />
                <Sparkle size={14} color="#DE1B52" className="absolute -bottom-1 -left-2 animate-pulse" />
                <div className="w-18 h-18 rounded-full bg-[#FFF8E3] border-2 border-[#FDE68A] flex items-center justify-center shadow-solly-soft">
                  <CheckCircle2 className="w-10 h-10 text-solly-pink" />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-display font-black text-solly-pink tracking-tight leading-tight">
                  Votre demande est bien envoyée ✨
                </h2>
                <p className="text-xs sm:text-sm text-solly-charcoal/90 font-semibold leading-relaxed">
                  Notre équipe vous contacte sur WhatsApp pour imaginer la suite avec vous.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-solly-border px-3 py-1 rounded-full text-xs font-bold text-solly-charcoal font-mono">
                    Référence : #{bookingRef || 'SOL-DEMANDE'}
                  </span>
                </div>
              </div>

              {/* Simple Recap Card */}
              <div className="bg-[#FAF7F2] border border-solly-border rounded-2xl p-4 text-left text-xs text-solly-charcoal space-y-2.5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-solly-border/70 pb-2">
                  <span className="font-bold text-solly-muted uppercase text-[10px] tracking-wider">
                    Événement
                  </span>
                  <span className="font-bold text-solly-charcoal">
                    {formData.eventType || 'Événement'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-solly-border/70 pb-2">
                  <span className="font-bold text-solly-muted uppercase text-[10px] tracking-wider">
                    Date & Lieu
                  </span>
                  <span className="font-semibold text-right">
                    {formattedDate} • {formData.address || 'Dakar'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-solly-border/70 pb-2">
                  <span className="font-bold text-solly-muted uppercase text-[10px] tracking-wider">
                    Invités
                  </span>
                  <span className="font-bold text-solly-pink">
                    {formData.guestCount || 20} personnes
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-solly-border/70 pb-2">
                  <span className="font-bold text-solly-muted uppercase text-[10px] tracking-wider shrink-0 pt-0.5">
                    Expériences
                  </span>
                  <span className="font-bold text-solly-charcoal text-right">
                    {formData.selectedExperiences.map((id) => getExperienceLabel(id)).join(', ')}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-solly-border/70 pb-2">
                  <span className="font-bold text-solly-muted uppercase text-[10px] tracking-wider">
                    Personnalisation
                  </span>
                  <span className="font-semibold text-solly-charcoal">
                    {formData.personalization === 'oui' ? 'Oui' : formData.personalization === 'non' ? 'Non' : 'À définir'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-solly-charcoal uppercase text-[10px] tracking-wider">
                    Budget envisagé
                  </span>
                  <span className="font-display font-black text-base text-solly-pink">
                    {formatPriceFCFA(formData.budgetDesired || formData.budgetMinimum || 80000)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display font-bold text-sm sm:text-base shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Poursuivre sur WhatsApp maintenant</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    resetBooking();
                  }}
                  className="w-full py-3 px-6 rounded-full bg-solly-cream hover:bg-solly-cream-dark/60 text-solly-charcoal font-bold text-xs sm:text-sm border border-solly-border transition-colors cursor-pointer"
                >
                  Retour au site
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* ÉTAPE 1 : VOTRE ÉVÉNEMENT */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNext}
                  className="max-w-xl mx-auto space-y-5 pb-2"
                >
                  {/* Heading */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                      Votre événement
                    </h2>
                    <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                      Quelques informations essentielles pour imaginer votre prestation Solly.
                    </p>
                    {formData.selectedExperiences && formData.selectedExperiences.length > 0 && (
                      <div className="flex items-center justify-center mt-2.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solly-pink/10 border border-solly-pink/20 text-solly-pink text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            Bar présélectionné : {formData.selectedExperiences.map((id) => getExperienceLabel(id)).join(' + ')}
                          </span>
                        </div>
                      </div>
                    )}
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
                          <option value="" disabled>
                            Sélectionnez un type...
                          </option>
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

                  {/* Créneau ou heure souhaitée */}
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
                          <input
                            type="time"
                            value={formData.eventTime.includes(':') ? formData.eventTime : '16:00'}
                            onChange={(e) => setFormData((prev) => ({ ...prev, eventTime: e.target.value }))}
                            className="bg-[#FAF7F2] border border-solly-border rounded-xl px-3 py-2 text-xs text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                          />
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

                  {/* Lieu de l'événement & Dakar Quick Chips */}
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      Lieu / Adresse <span className="text-solly-pink">*</span>
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
                        placeholder="Ex: Almadies, Plateau, Domicile..."
                        className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-solly-charcoal font-semibold placeholder:text-solly-charcoal/40 focus:outline-none focus:border-solly-pink/60 transition-colors"
                      />
                      <MapPin className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.address && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.address}</p>
                    )}

                    {/* Quick Area Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold text-solly-muted mr-1">Raccourcis :</span>
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

                  {/* Nombre d'invités */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-solly-charcoal">
                        Nombre d’invités estimé <span className="text-solly-pink">*</span>
                      </label>
                      <span className="text-[11px] font-bold text-solly-pink">
                        Minimum 20 invités
                      </span>
                    </div>

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

                        <input
                          type="number"
                          min="20"
                          max="500"
                          value={formData.guestCount}
                          placeholder="20"
                          onChange={(e) => {
                            const v = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                            const nextCount = typeof v === 'number' ? v : 20;
                            const nextMin = calculateMinimumBudget(nextCount);
                            setFormData((prev) => ({
                              ...prev,
                              guestCount: v,
                              budgetMinimum: nextMin,
                              budgetDesired: Math.max(nextMin, prev.budgetDesired || nextMin),
                            }));
                            setErrors((prev) => ({ ...prev, guestCount: '' }));
                          }}
                          className="w-16 text-center font-display font-black text-xl text-solly-charcoal bg-transparent focus:outline-none"
                        />

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

                    {errors.guestCount && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{errors.guestCount}</p>
                    )}

                    {/* Preset Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold text-solly-muted mr-1">Raccourcis :</span>
                      {GUEST_PRESETS.map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            const nextMin = calculateMinimumBudget(count);
                            setFormData((prev) => ({
                              ...prev,
                              guestCount: count,
                              budgetMinimum: nextMin,
                              budgetDesired: Math.max(nextMin, prev.budgetDesired || nextMin),
                            }));
                            setErrors((prev) => ({ ...prev, guestCount: '' }));
                          }}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            formData.guestCount === count
                              ? 'bg-solly-pink text-white border-solly-pink shadow-2xs'
                              : 'bg-white text-solly-charcoal/70 border-solly-border hover:bg-solly-cream'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Encadré informatif épuré avec règle de calcul dynamique */}
                  <div className="bg-[#FFF9E6] border border-[#FDE68A] text-solly-charcoal rounded-2xl p-3.5 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <Sparkle size={16} color="#DE1B52" className="shrink-0" />
                      <span>À partir de 4 000 FCFA / invité · minimum 20 invités</span>
                    </div>
                    <span className="font-extrabold text-solly-pink font-display whitespace-nowrap pl-2">
                      Min. {formatPriceFCFA(dynamicMinBudget)}
                    </span>
                  </div>
                </motion.form>
              )}

              {/* ========================================================= */}
              {/* ÉTAPE 2 : CHOISISSEZ VOS EXPÉRIENCES */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNext}
                  className="max-w-xl mx-auto space-y-5 pb-2"
                >
                  {/* Heading */}
                  <div className="text-center mb-3 sm:mb-5">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                      Choisissez vos expériences
                    </h2>
                    <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                      Sélectionnez une ou plusieurs expériences gourmandes pour vos invités.
                    </p>
                  </div>

                  {/* Grandes cartes visuelles avec photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {EXPERIENCES_CATALOG.map((exp) => {
                      const isSelected = formData.selectedExperiences.includes(exp.id);
                      return (
                        <div
                          key={exp.id}
                          onClick={() => toggleExperience(exp.id)}
                          className={`group relative rounded-[22px] overflow-hidden border-2 transition-all cursor-pointer flex flex-col ${
                            isSelected
                              ? 'border-solly-pink bg-[#FFF4F7] shadow-solly-soft scale-[1.01]'
                              : 'border-solly-border bg-white hover:border-solly-pink/40 hover:shadow-2xs'
                          }`}
                        >
                          {/* Image Banner */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-solly-cream">
                            <Image
                              src={exp.image}
                              alt={exp.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 300px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Tag badge */}
                            <div className="absolute top-2.5 left-2.5">
                              <span className="bg-white/95 backdrop-blur-xs text-solly-charcoal text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                                {exp.tag}
                              </span>
                            </div>

                            {/* Checkbox state */}
                            <div className="absolute top-2.5 right-2.5">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                                  isSelected
                                    ? 'bg-solly-pink text-white'
                                    : 'bg-white/90 text-transparent border border-solly-border'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            </div>
                          </div>

                          {/* Text info */}
                          <div className="p-3.5 flex flex-col flex-1 justify-between">
                            <div>
                              <h3
                                className={`font-display font-extrabold text-base transition-colors ${
                                  isSelected ? 'text-solly-pink' : 'text-solly-charcoal'
                                }`}
                              >
                                {exp.title}
                              </h3>
                              <p className="text-xs text-solly-muted font-medium mt-1 leading-snug">
                                {exp.subtitle}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-solly-border/40 flex items-center justify-between">
                              <span
                                className={`text-[11px] font-bold ${
                                  isSelected ? 'text-solly-pink' : 'text-solly-charcoal/60'
                                }`}
                              >
                                {isSelected ? '✓ Sélectionné' : '+ Ajouter cette envie'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.selectedExperiences && (
                    <p className="text-xs text-red-500 font-bold text-center">
                      {errors.selectedExperiences}
                    </p>
                  )}

                  {/* Note essentielle sous les cartes */}
                  <div className="bg-[#FAF7F2] border border-solly-border/80 rounded-2xl p-4 text-center">
                    <p className="text-xs text-solly-charcoal font-semibold leading-relaxed">
                      “Sélectionnez les expériences qui vous intéressent. Nous affinerons ensemble la composition selon votre événement et votre budget.”
                    </p>
                  </div>
                </motion.form>
              )}

              {/* ========================================================= */}
              {/* ÉTAPE 3 : PERSONNALISATION */}
              {/* ========================================================= */}
              {currentStep === 3 && (
                <motion.form
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNext}
                  className="max-w-xl mx-auto space-y-6 pb-2"
                >
                  {/* Heading */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                      Personnalisation
                    </h2>
                    <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                      Souhaitez-vous personnaliser votre expérience Solly ?
                    </p>
                  </div>

                  {/* 3 Grands choix interactifs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        value: 'oui',
                        title: 'Oui',
                        desc: 'Chariot, supports ou vaisselle sur mesure',
                        icon: Sparkles,
                      },
                      {
                        value: 'non',
                        title: 'Non',
                        desc: 'La formule standard officielle Solly',
                        icon: Check,
                      },
                      {
                        value: 'a-definir',
                        title: 'Je ne sais pas encore',
                        desc: 'À voir ensemble lors de notre échange',
                        icon: HelpCircle,
                      },
                    ].map((opt) => {
                      const isSelected = formData.personalization === opt.value;
                      const IconComp = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              personalization: opt.value as 'oui' | 'non' | 'a-definir',
                            }));
                            setErrors((prev) => ({ ...prev, personalization: '' }));
                          }}
                          className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-solly-pink-soft border-solly-pink shadow-solly-soft'
                              : 'bg-[#FAF7F2] border-solly-border hover:border-solly-pink/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-solly-pink text-white' : 'bg-white text-solly-pink'
                                }`}
                              >
                                <IconComp className="w-4 h-4" />
                              </span>
                              {isSelected && (
                                <span className="w-2.5 h-2.5 rounded-full bg-solly-pink" />
                              )}
                            </div>
                            <h4
                              className={`font-display font-extrabold text-base ${
                                isSelected ? 'text-solly-pink' : 'text-solly-charcoal'
                              }`}
                            >
                              {opt.title}
                            </h4>
                            <p className="text-xs text-solly-muted font-medium mt-1 leading-snug">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.personalization && (
                    <p className="text-xs text-red-500 font-bold text-center">
                      {errors.personalization}
                    </p>
                  )}

                  {/* Si OUI est choisi : Afficher les 2 sous-options simples */}
                  {formData.personalization === 'oui' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#FFF4F7] border border-solly-pink/30 rounded-2xl p-4 sm:p-5 space-y-3"
                    >
                      <h4 className="font-display font-extrabold text-xs sm:text-sm text-solly-pink uppercase tracking-wider">
                        Éléments que vous envisagez :
                      </h4>

                      <div className="space-y-2.5">
                        <label
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                            formData.personalizationCart
                              ? 'bg-white border-solly-pink shadow-2xs'
                              : 'bg-white/70 border-solly-border hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.personalizationCart}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                personalizationCart: e.target.checked,
                              }))
                            }
                            className="mt-0.5 w-4 h-4 text-solly-pink rounded border-gray-300 focus:ring-solly-pink accent-solly-pink"
                          />
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-solly-charcoal block">
                              Personnalisation du chariot / installation
                            </span>
                            <span className="text-[11px] text-solly-muted block mt-0.5">
                              Façade imprimée, logo de marque, prénom ou thème décoratif
                            </span>
                          </div>
                        </label>

                        <label
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                            formData.personalizationTableware
                              ? 'bg-white border-solly-pink shadow-2xs'
                              : 'bg-white/70 border-solly-border hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.personalizationTableware}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                personalizationTableware: e.target.checked,
                              }))
                            }
                            className="mt-0.5 w-4 h-4 text-solly-pink rounded border-gray-300 focus:ring-solly-pink accent-solly-pink"
                          />
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-solly-charcoal block">
                              Vaisselle et supports personnalisés
                            </span>
                            <span className="text-[11px] text-solly-muted block mt-0.5">
                              Contenants, stickers, serviettes ou accessoires à vos couleurs
                            </span>
                          </div>
                        </label>
                      </div>

                      <p className="text-[11px] text-solly-charcoal/70 font-medium italic pt-1">
                        Ces éléments seront définis et affinés directement avec l’équipe Solly sur WhatsApp.
                      </p>
                    </motion.div>
                  )}
                </motion.form>
              )}

              {/* ========================================================= */}
              {/* ÉTAPE 4 : VOTRE BUDGET & COORDONNÉES */}
              {/* ========================================================= */}
              {currentStep === 4 && (
                <motion.form
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNext}
                  className="max-w-xl mx-auto space-y-6 pb-2"
                >
                  {/* Heading */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-solly-pink tracking-tight">
                      Votre budget
                    </h2>
                    <p className="text-xs sm:text-sm text-solly-muted font-medium mt-1">
                      Quel budget souhaitez-vous consacrer à votre événement ?
                    </p>
                  </div>

                  {/* Slider interactif de budget */}
                  <div className="bg-[#FAF7F2] border border-solly-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="text-xs font-bold text-solly-charcoal">
                        Budget envisagé pour {effectiveGuests} invités :
                      </span>
                      <span className="text-2xl sm:text-3xl font-display font-black text-solly-pink">
                        {formatPriceFCFA(formData.budgetDesired || dynamicMinBudget)}
                        {formData.budgetDesired >= 1000000 && '+'}
                      </span>
                    </div>

                    {/* Interactive Slider Input */}
                    <div className="pt-2">
                      <input
                        type="range"
                        min={dynamicMinBudget}
                        max={1000000}
                        step={10000}
                        value={Math.max(dynamicMinBudget, formData.budgetDesired || dynamicMinBudget)}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setFormData((prev) => ({
                            ...prev,
                            budgetDesired: val,
                          }));
                        }}
                        className="w-full h-3 bg-solly-border rounded-lg appearance-none cursor-pointer accent-solly-pink"
                      />
                    </div>

                    {/* Minimum indicator notice directly below slider */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-solly-charcoal/80 pt-1">
                      <span>Minimum estimé : {formatPriceFCFA(dynamicMinBudget)}</span>
                      <span>1 000 000 FCFA+</span>
                    </div>

                    {/* Quick touch preset buttons */}
                    <div className="pt-2 border-t border-solly-border/60">
                      <span className="text-[11px] font-bold text-solly-muted block mb-2">
                        Paliers rapides :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BUDGET_PRESETS.map((amount) => {
                          const isDisabled = amount < dynamicMinBudget;
                          const isSelected = formData.budgetDesired === amount;
                          return (
                            <button
                              key={amount}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  budgetDesired: amount,
                                }));
                              }}
                              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                                isDisabled
                                  ? 'opacity-35 bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-solly-pink text-white border-solly-pink shadow-2xs'
                                  : 'bg-white text-solly-charcoal/80 border-solly-border hover:bg-solly-cream'
                              }`}
                            >
                              {formatPriceFCFA(amount)}
                              {amount >= 1000000 && '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées de contact */}
                  <div className="bg-white border border-solly-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal border-b border-solly-border/60 pb-2">
                      Vos coordonnées pour vous contacter
                    </h3>

                    {/* Nom et prénom */}
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
                          placeholder="Votre nom complet"
                          className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                        />
                        <User className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.firstName && (
                        <p className="text-[11px] text-red-500 font-bold mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Téléphone (WhatsApp) avec indicatif pays */}
                    <div>
                      <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                        Numéro de téléphone (WhatsApp) <span className="text-solly-pink">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative shrink-0 w-[92px] sm:w-[98px]">
                          <select
                            value={formData.countryCode || '+221'}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
                            }
                            className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-2.5 pr-6 py-3 text-sm sm:text-xs text-solly-charcoal font-bold appearance-none focus:outline-none focus:border-solly-pink/60 transition-colors cursor-pointer"
                          >
                            {COUNTRY_CODES.map((item) => (
                              <option key={item.country} value={item.code}>
                                {item.flag} {item.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-solly-charcoal/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, phone: e.target.value }));
                              setErrors((prev) => ({ ...prev, phone: '' }));
                            }}
                            placeholder="77 000 00 00"
                            className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                          />
                          <Phone className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 font-bold mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email optionnel */}
                    <div>
                      <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                        Adresse email <span className="text-solly-muted font-normal">(optionnel)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          autoComplete="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="exemple@email.com"
                          className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl pl-10 pr-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                        />
                        <Mail className="w-4 h-4 text-solly-charcoal/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Précisions / note optionnelle */}
                    <div>
                      <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                        Un détail à nous préciser ? <span className="text-solly-muted font-normal">(optionnel)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.message}
                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Allergies, horaire particulier, souhaits spécifiques..."
                        className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl p-3.5 text-base sm:text-sm text-solly-charcoal font-medium focus:outline-none focus:border-solly-pink/60 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Récapitulatif Final très simple */}
                  <div className="bg-[#FFF4F7] border border-solly-pink/30 rounded-2xl p-4 sm:p-5 text-xs text-solly-charcoal space-y-2.5 shadow-2xs">
                    <h4 className="font-display font-extrabold text-sm text-solly-pink border-b border-solly-pink/20 pb-2">
                      Votre demande Solly
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-solly-muted block">Événement :</span>
                        <span className="font-bold text-solly-charcoal">
                          {formData.eventType || 'À préciser'}
                        </span>
                      </div>
                      <div>
                        <span className="text-solly-muted block">Date :</span>
                        <span className="font-bold text-solly-charcoal">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-solly-muted block">Lieu :</span>
                        <span className="font-bold text-solly-charcoal">
                          {formData.address || 'Dakar'}
                        </span>
                      </div>
                      <div>
                        <span className="text-solly-muted block">Invités :</span>
                        <span className="font-bold text-solly-pink">{effectiveGuests}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-solly-pink/20">
                      <span className="text-solly-muted block text-[11px]">Expériences :</span>
                      <span className="font-bold text-solly-charcoal">
                        {formData.selectedExperiences.map((id) => getExperienceLabel(id)).join(', ')}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-solly-pink/20">
                      <span className="font-bold text-solly-charcoal">Budget envisagé :</span>
                      <span className="font-display font-black text-base text-solly-pink">
                        {formatPriceFCFA(formData.budgetDesired || dynamicMinBudget)}
                        {formData.budgetDesired >= 1000000 && '+'}
                      </span>
                    </div>
                  </div>
                </motion.form>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM ACTION BAR (Sticky at bottom) */}
      {!isSubmitted && (
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-solly-border bg-white flex items-center justify-between gap-3 shrink-0">
          {/* Bouton Retour (Étapes 2, 3, 4) */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-full border border-solly-border text-solly-charcoal font-bold text-xs sm:text-sm hover:bg-solly-cream transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          ) : (
            <div />
          )}

          {/* Bouton Continuer / Envoyer ma demande */}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => handleNext()}
              className="py-3 px-7 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink/90 shadow-solly-pink transition-all inline-flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="py-3.5 px-8 rounded-full bg-solly-pink text-white font-display font-bold text-sm sm:text-base hover:bg-solly-pink/90 shadow-solly-pink transition-all inline-flex items-center gap-2 cursor-pointer ml-auto disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Envoyer ma demande</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
