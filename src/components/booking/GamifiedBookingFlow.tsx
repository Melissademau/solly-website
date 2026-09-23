'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronUp,
  Plus,
  Minus,
  Phone,
  User,
  CheckCircle2,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { SollyLogo, Sparkle } from '@/components/ui/Doodles';
import { useBooking, EventType, SelectedBarType, MainBarType, CakeCustomization, CharcuterieCustomization } from '@/context/BookingContext';
import { calculateBookingPrice, formatPriceFCFA, PRICING_CONFIG } from '@/lib/pricing';

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

const GUEST_PRESETS = [20, 25, 30, 40, 50, 75];
const DAKAR_QUICK_AREAS = ['Almadies', 'Plateau', 'Ngor', 'Point E', 'Mamelles'];

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

// Bar items data matching the experiences pages
const CAKE_OPTIONS = {
  barquettes: [
    { id: 'Barquette standard Solly', name: 'Standard Solly', badge: 'Incontournable' },
    { id: 'Barquette à thème', name: 'À thème personnalisé', badge: 'Sur mesure' },
    { id: 'Barquette premium', name: 'Premium dorée', badge: 'Élégance' },
  ],
  bases: ['Vanille', 'Chocolat'],
  sauces: ['Chocolat', 'Caramel beurre salé', 'Fruits rouges', 'Lait concentré sucré'],
  toppings: ['Oreo', 'Spéculoos', 'Vermicelles festifs', 'Mangue', 'Marshmallow', 'Fraises fraîches', 'Banane', 'Autres'],
};

const DRINK_OPTIONS = [
  { id: 'Bissap glacé', name: 'Bissap glacé', desc: 'Hibiscus, menthe douce & vanille' },
  { id: 'Jus d’ananas', name: 'Jus d’ananas', desc: 'Pur jus frais pressé et doux' },
  { id: 'Gingembre-agrumes', name: 'Gingembre-agrumes', desc: 'Gingembre tonique, oranges & citron vert' },
  { id: 'Jus orange-passion', name: 'Jus orange-passion', desc: 'Nectar acidulé et doux aux fruits de la passion' },
];

const CHARCUTERIE_OPTIONS = {
  formats: [
    { id: 'Le Cornet', name: 'Le Cornet', desc: 'Cône individuel pour picorer debout' },
    { id: 'Le Pot', name: 'Le Pot', desc: 'Pot généreux facile à poser' },
  ],
  composants: [
    'Rosettes de salami',
    'Jambon cuit',
    'Gouda doré',
    'Fromage doux',
    'Olives marinées',
    'Raisins frais',
    'Mini bretzels',
    'Crackers dorés',
    'Autres',
  ],
};

export function GamifiedBookingFlow({ onClose, isInline = false }: GamifiedBookingFlowProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    orderChoices,
    setOrderChoices,
    submitBooking,
    resetBooking,
    getWhatsAppUrl,
  } = useBooking();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inspirationAdded, setInspirationAdded] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [inspirationError, setInspirationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<{
    pdfBase64?: string;
    docxBase64?: string;
    pdfFilename?: string;
    docxFilename?: string;
    emailSent?: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInspirationError('');
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentPhotos = formData.inspirationPhotos || [];
    if (currentPhotos.length + files.length > 2) {
      setInspirationError('Vous pouvez joindre 2 photos maximum au total.');
      e.target.value = '';
      return;
    }

    const currentSize = currentPhotos.reduce((acc, p) => acc + p.size, 0);
    const newFilesSize = files.reduce((acc, f) => acc + f.size, 0);
    const totalBytes = currentSize + newFilesSize;
    const maxBytes = 2 * 1024 * 1024; // 2 Mo

    if (totalBytes > maxBytes) {
      setInspirationError(
        `Le poids total dépasse 2 Mo (actuellement ${(totalBytes / (1024 * 1024)).toFixed(1)} Mo). Veuillez choisir des photos plus légères.`
      );
      e.target.value = '';
      return;
    }

    try {
      const readAsDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const newPhotos = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          size: file.size,
          dataUrl: await readAsDataUrl(file),
        }))
      );

      setFormData((prev) => ({
        ...prev,
        inspirationPhotos: [...(prev.inspirationPhotos || []), ...newPhotos].slice(0, 2),
      }));
    } catch {
      setInspirationError('Impossible de charger cette image.');
    }
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inspirationPhotos: (prev.inspirationPhotos || []).filter((_, i) => i !== index),
    }));
    setInspirationError('');
  };

  // Active accordion tab in step 2 (e.g. 'cake-bar' | 'drinks' | 'charcuterie')
  const [activeCustomizer, setActiveCustomizer] = useState<SelectedBarType | null>(null);

  // Guest count logic: minimum 20 invités
  const guestCount =
    typeof formData.guestCount === 'number'
      ? formData.guestCount
      : formData.guestCount
      ? parseInt(String(formData.guestCount), 10)
      : 20;

  const handleGuestChange = (delta: number) => {
    const current = guestCount || 20;
    const nextVal = Math.max(20, Math.min(500, current + delta));
    setFormData((prev) => ({ ...prev, guestCount: nextVal }));
    setErrors((prev) => ({ ...prev, guestCount: '' }));
  };

  // Centralized dynamic pricing calculation
  const pricing = calculateBookingPrice({
    guestCount: formData.guestCount,
    hasExtraBar: formData.hasExtraBar,
    hasDrinks: formData.hasDrinks,
    hasCartCustomization: formData.hasCartCustomization,
    hasCustomPackaging: formData.hasCustomPackaging,
  });

  // Handler for selecting the main bar (included at base 4 000 FCFA / guest)
  const handleMainBarSelect = (bar: 'cake-bar' | 'charcuterie') => {
    setFormData((prev) => {
      const hasExtra = prev.hasExtraBar && prev.extraBarType !== bar;
      const extraType = hasExtra ? prev.extraBarType : undefined;

      const nextBars: SelectedBarType[] = [bar];
      if (hasExtra && extraType) nextBars.push(extraType);
      if (prev.hasDrinks) nextBars.push('drinks');

      return {
        ...prev,
        mainBar: bar,
        hasExtraBar: hasExtra,
        extraBarType: extraType,
        selectedBars: nextBars,
      };
    });
    setActiveCustomizer(bar);
    setErrors((prev) => ({ ...prev, selectedBars: '' }));

    if (bar === 'cake-bar' && !orderChoices.cakeBar) {
      setOrderChoices((prev) => ({
        ...prev,
        cakeBar: {
          barquette: 'Barquette standard Solly',
          base: 'Vanille',
          sauces: ['Chocolat'],
          composants: ['Oreo'],
        },
      }));
    } else if (bar === 'charcuterie' && !orderChoices.charcuterie) {
      setOrderChoices((prev) => ({
        ...prev,
        charcuterie: {
          format: 'Le Cornet',
          composants: ['Rosettes de salami', 'Gouda doré'],
        },
      }));
    }
  };

  // Handler for toggling an additional bar (+1 000 FCFA / guest)
  const handleExtraBarToggle = (bar: 'cake-bar' | 'charcuterie') => {
    setFormData((prev) => {
      const willEnable = !prev.hasExtraBar || prev.extraBarType !== bar;
      const nextBars: SelectedBarType[] = [prev.mainBar || 'cake-bar'];
      if (willEnable) nextBars.push(bar);
      if (prev.hasDrinks) nextBars.push('drinks');

      return {
        ...prev,
        hasExtraBar: willEnable,
        extraBarType: willEnable ? bar : undefined,
        selectedBars: nextBars,
      };
    });

    if (!formData.hasExtraBar) {
      setActiveCustomizer(bar);
      if (bar === 'cake-bar' && !orderChoices.cakeBar) {
        setOrderChoices((prev) => ({
          ...prev,
          cakeBar: {
            barquette: 'Barquette standard Solly',
            base: 'Vanille',
            sauces: ['Chocolat'],
            composants: ['Oreo'],
          },
        }));
      } else if (bar === 'charcuterie' && !orderChoices.charcuterie) {
        setOrderChoices((prev) => ({
          ...prev,
          charcuterie: {
            format: 'Le Cornet',
            composants: ['Rosettes de salami', 'Gouda doré'],
          },
        }));
      }
    }
  };

  // Handler for drinks option (+1 000 FCFA / guest)
  const handleDrinksToggle = () => {
    setFormData((prev) => {
      const willEnable = !prev.hasDrinks;
      const nextBars = willEnable
        ? Array.from(new Set([...prev.selectedBars, 'drinks' as SelectedBarType]))
        : prev.selectedBars.filter((b) => b !== 'drinks');

      return {
        ...prev,
        hasDrinks: willEnable,
        selectedBars: nextBars,
      };
    });

    if (!formData.hasDrinks) {
      setActiveCustomizer('drinks');
      if (!orderChoices.drinks || orderChoices.drinks.length === 0) {
        setOrderChoices((prev) => ({
          ...prev,
          drinks: ['Bissap glacé'],
        }));
      }
    }
  };

  // Handler for cart customization (+15 000 FCFA)
  const handleCartCustomizationToggle = () => {
    setFormData((prev) => ({
      ...prev,
      hasCartCustomization: !prev.hasCartCustomization,
      personalization: !prev.hasCartCustomization ? 'oui' : prev.personalization,
    }));
  };

  // Handler for custom packaging (+10 000 FCFA)
  const handleCustomPackagingToggle = () => {
    setFormData((prev) => ({
      ...prev,
      hasCustomPackaging: !prev.hasCustomPackaging,
    }));
  };

  // Backward compatible handleBarToggle
  const handleBarToggle = (bar: SelectedBarType) => {
    if (bar === 'drinks') {
      handleDrinksToggle();
    } else if (bar === formData.mainBar) {
      // already main bar, no-op or open customizer
      setActiveCustomizer(bar);
    } else if (formData.mainBar && bar !== formData.mainBar) {
      handleExtraBarToggle(bar as 'cake-bar' | 'charcuterie');
    } else {
      handleMainBarSelect(bar as 'cake-bar' | 'charcuterie');
    }
  };

  // Customization handlers for Cake Bar
  const handleCakeBarquette = (b: string) => {
    setOrderChoices((prev) => ({
      ...prev,
      cakeBar: {
        ...(prev.cakeBar || { base: 'Vanille', sauces: [], composants: [] }),
        barquette: b,
      },
    }));
  };

  const handleCakeBase = (base: string) => {
    setOrderChoices((prev) => ({
      ...prev,
      cakeBar: {
        ...(prev.cakeBar || { sauces: [], composants: [] }),
        base,
      },
    }));
  };

  const handleCakeSauceToggle = (sauce: string) => {
    const current = orderChoices.cakeBar?.sauces || [];
    let updated: string[];
    if (current.includes(sauce)) {
      updated = current.filter((s) => s !== sauce);
    } else {
      if (current.length >= 2) {
        updated = [...current.slice(1), sauce];
      } else {
        updated = [...current, sauce];
      }
    }
    setOrderChoices((prev) => ({
      ...prev,
      cakeBar: {
        ...(prev.cakeBar || { base: 'Vanille', composants: [] }),
        sauces: updated,
      },
    }));
  };

  const handleCakeToppingToggle = (top: string) => {
    const current = orderChoices.cakeBar?.composants || [];
    let updated: string[];
    if (current.includes(top)) {
      updated = current.filter((t) => t !== top);
    } else {
      if (current.length >= 6) {
        return; // Maximum 6 toppings autorisés
      }
      updated = [...current, top];
    }
    setOrderChoices((prev) => ({
      ...prev,
      cakeBar: {
        ...(prev.cakeBar || { base: 'Vanille', sauces: [] }),
        composants: updated,
      },
    }));
    setErrors((prev) => ({ ...prev, cakeBarToppings: '' }));
  };

  // Customization handlers for Drinks (Limited to 3 juices maximum)
  const handleDrinkToggle = (drinkId: string) => {
    const current = orderChoices.drinks || [];
    let updated: string[];
    if (current.includes(drinkId)) {
      updated = current.filter((d) => d !== drinkId);
    } else {
      if (current.length >= 3) {
        return; // Max 3 juices limit
      }
      updated = [...current, drinkId];
    }
    setOrderChoices((prev) => ({
      ...prev,
      drinks: updated,
    }));
  };

  // Customization handlers for Charcuterie
  const handleCharcuterieFormat = (format: string) => {
    setOrderChoices((prev) => ({
      ...prev,
      charcuterie: {
        ...(prev.charcuterie || { composants: [] }),
        format,
      },
    }));
  };

  const handleCharcuterieComposantToggle = (comp: string) => {
    const current = orderChoices.charcuterie?.composants || [];
    let updated: string[];
    if (current.includes(comp)) {
      updated = current.filter((c) => c !== comp);
    } else {
      if (current.length >= 6) {
        return; // Maximum 6 composants autorisés
      }
      updated = [...current, comp];
    }
    setOrderChoices((prev) => ({
      ...prev,
      charcuterie: {
        ...(prev.charcuterie || { format: 'Le Cornet' }),
        composants: updated,
      },
    }));
    setErrors((prev) => ({ ...prev, charcuterieComposants: '' }));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.eventType) errs.eventType = 'Choisissez un type d’événement';
    if (!formData.eventDate) errs.eventDate = 'Indiquez une date';
    if (!formData.guestCount || Number(formData.guestCount) < 20) {
      errs.guestCount = 'Minimum 20 invités requis (tarif de base : 4 000 FCFA / invité)';
    }
    if (!formData.address.trim()) errs.address = 'Indiquez l’adresse ou la ville de l’événement';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'Prénom et nom requis';
    if (!formData.phone.trim()) errs.phone = 'Numéro de téléphone requis';
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
    if (!formData.mainBar) {
      setErrors({ selectedBars: 'Veuillez sélectionner votre bar principal' });
      return;
    }

    setErrors({});
    setCurrentStep(3);
  };

  const handleSubmitStep3 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep3()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/send-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: {
              ...formData,
              name: formData.firstName,
              location: formData.address,
            },
            orderChoices,
            pricing,
          }),
        });
        if (response.ok) {
          const resData = await response.json();
          setGeneratedQuote(resData);
        }
      } catch (err) {
        console.error('[Booking Submit] Error requesting quote email:', err);
      } finally {
        setIsSubmitting(false);
        submitBooking(formData);
      }
    }
  };

  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date à définir';

  const selectedBarsSummary = () => {
    const mainLabel = formData.mainBar === 'charcuterie' ? 'Bar salé / Charcuterie' : 'Cake Bar';
    const extras: string[] = [];
    if (formData.hasExtraBar) {
      extras.push(formData.extraBarType === 'charcuterie' ? 'Bar salé' : 'Cake Bar');
    }
    if (formData.hasDrinks) {
      extras.push('Boissons Solly');
    }
    return extras.length > 0 ? `${mainLabel} + ${extras.join(' + ')}` : mainLabel;
  };

  return (
    <div
      className={`w-full bg-white ${
        isInline
          ? 'rounded-[28px] sm:rounded-[32px] border border-solly-border shadow-solly-card'
          : 'rounded-t-[32px] sm:rounded-[30px]'
      } overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]`}
    >
      {/* 0. MOBILE BOTTOM SHEET DRAG HANDLE (Visible in modal on small screens) */}
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
                  Quelques détails pour imaginer votre prestation personnalisée.
                </p>
              </div>

              {/* Type d'événement & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type d'événement (No pre-selected choice) */}
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

                {/* Date (Blank initially) */}
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

              {/* Nombre d'invités (Clean Counter with min 20) */}
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
                        setFormData((prev) => ({ ...prev, guestCount: v }));
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
                        setFormData((prev) => ({ ...prev, guestCount: count }));
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

              {/* Encadré informatif simplifié */}
              <div className="bg-[#FFF9E6] border border-[#FDE68A] text-solly-charcoal/90 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-medium">
                <Sparkle size={16} color="#DE1B52" className="shrink-0" />
                <span>À partir de 4 000 FCFA / invité · minimum 20 invités</span>
              </div>
            </motion.form>
          )}

          {/* ========================================================= */}
          {/* STEP 02: VOS ENVIES (GAMIFIED BARS & INLINE CUSTOMIZERS) */}
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
                  Choisissez votre bar principal, puis ajoutez vos options selon vos envies.
                </p>
              </div>

              {errors.selectedBars && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-2.5 text-xs font-bold text-center">
                  {errors.selectedBars}
                </div>
              )}

              {/* 1. Bar principal (inclus à 4 000 FCFA / invité) */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="block text-xs font-bold text-solly-charcoal">
                    1. Choisissez votre bar principal <span className="text-solly-pink">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-solly-pink bg-solly-pink-soft px-2.5 py-0.5 rounded-full border border-solly-pink/20 inline-block w-fit">
                    Inclus dans votre formule à 4 000 FCFA / invité
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Main Bar 1: Cake Bar */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMainBarSelect('cake-bar')}
                    className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                      formData.mainBar === 'cake-bar'
                        ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                        : 'border-solly-border hover:border-solly-pink/40'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                      <Image
                        src="/images/solly-assets/05-experience/gateau-marshmallow.png"
                        alt="Cake Bar"
                        fill
                        sizes="(max-width: 640px) 50vw, 250px"
                        loading="lazy"
                        decoding="async"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all z-10 ${
                          formData.mainBar === 'cake-bar'
                            ? 'bg-solly-pink text-white shadow-sm scale-110'
                            : 'bg-white/85 border border-solly-border text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-solly-charcoal px-2 py-0.5 rounded-md shadow-2xs">
                        Inclus
                      </span>
                    </div>
                    <div className="py-2.5 px-2 text-center">
                      <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                        Cake Bar
                      </span>
                      <span className="text-[10px] text-solly-muted block mt-0.5">
                        {formData.mainBar === 'cake-bar' ? '✦ Bar principal sélectionné' : 'Gâteaux moelleux minute'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Main Bar 2: Bar salé / Charcuterie */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMainBarSelect('charcuterie')}
                    className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-white flex flex-col group select-none ${
                      formData.mainBar === 'charcuterie'
                        ? 'border-solly-pink shadow-solly-card ring-2 ring-solly-pink/20'
                        : 'border-solly-border hover:border-solly-pink/40'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-solly-cream overflow-hidden relative">
                      <Image
                        src="/images/solly-assets/05-experience/pot-charcuterie-partage.png"
                        alt="Bar salé / Charcuterie"
                        fill
                        sizes="(max-width: 640px) 50vw, 250px"
                        loading="lazy"
                        decoding="async"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all z-10 ${
                          formData.mainBar === 'charcuterie'
                            ? 'bg-solly-pink text-white shadow-sm scale-110'
                            : 'bg-white/85 border border-solly-border text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-solly-charcoal px-2 py-0.5 rounded-md shadow-2xs">
                        Inclus
                      </span>
                    </div>
                    <div className="py-2.5 px-2 text-center">
                      <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                        Bar salé / Charcuterie
                      </span>
                      <span className="text-[10px] text-solly-muted block mt-0.5">
                        {formData.mainBar === 'charcuterie' ? '✦ Bar principal sélectionné' : 'Cornets & pots salés'}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* 2. Options gourmandes (Bar supplémentaire & Boissons) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-solly-charcoal">
                  2. Options gourmandes (à ajouter selon vos envies)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Bar supplémentaire */}
                  {formData.mainBar === 'charcuterie' ? (
                    <div
                      onClick={() => handleExtraBarToggle('cake-bar')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        formData.hasExtraBar && formData.extraBarType === 'cake-bar'
                          ? 'border-solly-pink bg-solly-pink-soft/30 shadow-2xs'
                          : 'border-solly-border bg-white hover:border-solly-pink/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-solly-cream overflow-hidden relative shrink-0">
                          <Image
                            src="/images/solly-assets/05-experience/gateau-marshmallow.png"
                            alt="Cake Bar supplémentaire"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                            + Cake Bar
                          </span>
                          <span className="text-[11px] font-bold text-solly-pink block">
                            +1 000 FCFA / invité
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          formData.hasExtraBar && formData.extraBarType === 'cake-bar'
                            ? 'bg-solly-pink text-white'
                            : 'border border-solly-border bg-[#FAF7F2] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleExtraBarToggle('charcuterie')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        formData.hasExtraBar && formData.extraBarType === 'charcuterie'
                          ? 'border-solly-pink bg-solly-pink-soft/30 shadow-2xs'
                          : 'border-solly-border bg-white hover:border-solly-pink/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-solly-cream overflow-hidden relative shrink-0">
                          <Image
                            src="/images/solly-assets/05-experience/pot-charcuterie-partage.png"
                            alt="Bar salé supplémentaire"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                            + Bar salé / Charcuterie
                          </span>
                          <span className="text-[11px] font-bold text-solly-pink block">
                            +1 000 FCFA / invité
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          formData.hasExtraBar && formData.extraBarType === 'charcuterie'
                            ? 'bg-solly-pink text-white'
                            : 'border border-solly-border bg-[#FAF7F2] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}

                  {/* Option Boissons Solly */}
                  <div
                    onClick={handleDrinksToggle}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      formData.hasDrinks
                        ? 'border-solly-pink bg-solly-pink-soft/30 shadow-2xs'
                        : 'border-solly-border bg-white hover:border-solly-pink/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-solly-cream overflow-hidden relative shrink-0">
                        <Image
                          src="/images/solly-assets/05-experience/jus-glaces-ananas-bissap.png"
                          alt="Boissons Solly"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                          + Boissons Solly
                        </span>
                        <span className="text-[11px] font-bold text-solly-pink block">
                          +1 000 FCFA / invité
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        formData.hasDrinks
                          ? 'bg-solly-pink text-white'
                          : 'border border-solly-border bg-[#FAF7F2] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================= */}
              {/* INLINE CUSTOMIZERS FOR SELECTED BARS */}
              {/* ======================================================= */}

              {/* 1. CAKE BAR CUSTOMIZER */}
              {formData.selectedBars.includes('cake-bar') && (
                <div className="bg-[#FAF7F2] border-2 border-solly-pink/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-solly-border/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🍰</span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                        Personnalisation du Cake Bar
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-solly-pink bg-solly-pink-soft px-2.5 py-0.5 rounded-full">
                      Étape par étape
                    </span>
                  </div>

                  {/* Choix de la barquette */}
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      1. Votre barquette
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {CAKE_OPTIONS.barquettes.map((b) => {
                        const isChosen = orderChoices.cakeBar?.barquette === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleCakeBarquette(b.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-white border-solly-pink shadow-2xs ring-1 ring-solly-pink'
                                : 'bg-white/70 border-solly-border hover:bg-white'
                            }`}
                          >
                            <span className="text-[10px] font-extrabold text-solly-pink uppercase tracking-wider block">
                              {b.badge}
                            </span>
                            <span className="text-xs font-bold text-solly-charcoal block mt-0.5">
                              {b.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choix de la base */}
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      2. Votre base de gâteau
                    </label>
                    <div className="flex items-center gap-2">
                      {CAKE_OPTIONS.bases.map((base) => {
                        const isChosen = orderChoices.cakeBar?.base === base;
                        return (
                          <button
                            key={base}
                            type="button"
                            onClick={() => handleCakeBase(base)}
                            className={`flex-1 py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-solly-pink text-white border-solly-pink shadow-2xs'
                                : 'bg-white text-solly-charcoal border-solly-border hover:bg-solly-cream'
                            }`}
                          >
                            {base}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choix des sauces (Max 2) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-solly-charcoal">
                        3. Vos sauces préférées
                      </label>
                      <span className="text-[11px] text-solly-muted font-medium">Max 2 sauces</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {CAKE_OPTIONS.sauces.map((sauce) => {
                        const isSelected = orderChoices.cakeBar?.sauces?.includes(sauce);
                        return (
                          <button
                            key={sauce}
                            type="button"
                            onClick={() => handleCakeSauceToggle(sauce)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-solly-pink-soft text-solly-pink border-solly-pink'
                                : 'bg-white text-solly-charcoal/80 border-solly-border hover:border-solly-pink/30'
                            }`}
                          >
                            <span className="truncate">{sauce}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-solly-pink shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choix des toppings (Exactement 6 obligatoires) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-solly-charcoal">
                        4. Vos toppings & friandises <span className="text-solly-pink">*</span>
                      </label>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          (orderChoices.cakeBar?.composants?.length || 0) === 6
                            ? 'bg-green-100 text-green-700'
                            : 'bg-solly-pink-soft text-solly-pink'
                        }`}
                      >
                        {orderChoices.cakeBar?.composants?.length || 0}/6 obligatoires
                      </span>
                    </div>
                    <p className="text-[11px] text-solly-muted mb-2 font-medium">
                      {(orderChoices.cakeBar?.composants?.length || 0) === 6
                        ? '✓ 6 toppings sélectionnés !'
                        : `Veuillez sélectionner 6 toppings pour valider (encore ${6 - (orderChoices.cakeBar?.composants?.length || 0)} à choisir).`}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CAKE_OPTIONS.toppings.map((top) => {
                        const isSelected = orderChoices.cakeBar?.composants?.includes(top);
                        const isMaxReached = (orderChoices.cakeBar?.composants?.length || 0) >= 6 && !isSelected;
                        return (
                          <button
                            key={top}
                            type="button"
                            disabled={isMaxReached}
                            onClick={() => handleCakeToppingToggle(top)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-1 ${
                              isSelected
                                ? 'bg-solly-pink text-white border-solly-pink shadow-2xs cursor-pointer'
                                : isMaxReached
                                ? 'bg-white/40 text-solly-charcoal/40 border-solly-border/40 opacity-40 cursor-not-allowed'
                                : 'bg-white text-solly-charcoal/80 border-solly-border hover:border-solly-pink/30 cursor-pointer'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{top}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.cakeBarToppings && (
                      <p className="text-[11px] text-red-600 font-bold mt-2 bg-red-50 p-2 rounded-xl border border-red-200">
                        {errors.cakeBarToppings}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 2. DRINKS CUSTOMIZER */}
              {formData.selectedBars.includes('drinks') && (
                <div className="bg-[#FAF7F2] border-2 border-solly-pink/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-solly-border/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🍹</span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                        Saveurs du Bar à Boissons
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-solly-pink bg-solly-pink-soft px-2.5 py-0.5 rounded-full">
                      {orderChoices.drinks?.length || 0}/3 jus max
                    </span>
                  </div>

                  <p className="text-xs text-solly-muted font-medium">
                    Cochez jusqu’à 3 saveurs que vous aimeriez proposer à vos invités :
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DRINK_OPTIONS.map((d) => {
                      const isSelected = orderChoices.drinks?.includes(d.id);
                      const isMaxReached = (orderChoices.drinks?.length || 0) >= 3 && !isSelected;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          disabled={isMaxReached}
                          onClick={() => handleDrinkToggle(d.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-white border-solly-pink shadow-2xs ring-1 ring-solly-pink cursor-pointer'
                              : isMaxReached
                              ? 'bg-white/40 border-solly-border/40 opacity-40 cursor-not-allowed'
                              : 'bg-white/70 border-solly-border hover:bg-white cursor-pointer'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-solly-charcoal block">
                              {d.name}
                            </span>
                            <span className="text-[11px] text-solly-muted font-medium block mt-0.5">
                              {d.desc}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-solly-pink text-white'
                                : 'border border-solly-border bg-white text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. CHARCUTERIE CUSTOMIZER */}
              {formData.selectedBars.includes('charcuterie') && (
                <div className="bg-[#FAF7F2] border-2 border-solly-pink/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-solly-border/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧀</span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                        Garnitures du Bar à Charcuterie
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-solly-pink bg-solly-pink-soft px-2.5 py-0.5 rounded-full">
                      Plaisirs salés
                    </span>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                      1. Format de service
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHARCUTERIE_OPTIONS.formats.map((f) => {
                        const isChosen = orderChoices.charcuterie?.format === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleCharcuterieFormat(f.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-white border-solly-pink shadow-2xs ring-1 ring-solly-pink'
                                : 'bg-white/70 border-solly-border hover:bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold text-solly-charcoal block">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-solly-muted block mt-0.5">
                              {f.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Composants salés (Exactement 6 obligatoires) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-solly-charcoal">
                        2. Vos bouchées salées souhaitées <span className="text-solly-pink">*</span>
                      </label>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          (orderChoices.charcuterie?.composants?.length || 0) === 6
                            ? 'bg-green-100 text-green-700'
                            : 'bg-solly-pink-soft text-solly-pink'
                        }`}
                      >
                        {orderChoices.charcuterie?.composants?.length || 0}/6 obligatoires
                      </span>
                    </div>
                    <p className="text-[11px] text-solly-muted mb-2 font-medium">
                      {(orderChoices.charcuterie?.composants?.length || 0) === 6
                        ? '✓ 6 composants sélectionnés !'
                        : `Veuillez sélectionner 6 composants pour valider (encore ${6 - (orderChoices.charcuterie?.composants?.length || 0)} à choisir).`}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CHARCUTERIE_OPTIONS.composants.map((comp) => {
                        const isSelected = orderChoices.charcuterie?.composants?.includes(comp);
                        const isMaxReached = (orderChoices.charcuterie?.composants?.length || 0) >= 6 && !isSelected;
                        return (
                          <button
                            key={comp}
                            type="button"
                            disabled={isMaxReached}
                            onClick={() => handleCharcuterieComposantToggle(comp)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-1 ${
                              isSelected
                                ? 'bg-solly-pink text-white border-solly-pink shadow-2xs cursor-pointer'
                                : isMaxReached
                                ? 'bg-white/40 text-solly-charcoal/40 border-solly-border/40 opacity-40 cursor-not-allowed'
                                : 'bg-white text-solly-charcoal/80 border-solly-border hover:border-solly-pink/30 cursor-pointer'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            <span>{comp}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.charcuterieComposants && (
                      <p className="text-[11px] text-red-600 font-bold mt-2 bg-red-50 p-2 rounded-xl border border-red-200">
                        {errors.charcuterieComposants}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Large touch card: Je souhaite être conseillé(e) */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, isAdvised: !prev.isAdvised }))}
                className="p-3.5 rounded-2xl border border-solly-border hover:border-solly-pink/40 bg-white flex items-center gap-3 cursor-pointer transition-colors"
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

              {/* Compact, clean, non-cumbersome summary strip for choices */}
              {(orderChoices.cakeBar || (orderChoices.drinks && orderChoices.drinks.length > 0) || orderChoices.charcuterie) && (
                <div className="bg-white border border-solly-border/90 rounded-xl p-3 shadow-2xs">
                  <div
                    onClick={() => setSummaryExpanded(!summaryExpanded)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-solly-pink">✦ Vos choix en direct :</span>
                      <span className="text-[11px] font-semibold text-solly-charcoal/80 truncate max-w-[200px] sm:max-w-xs">
                        {formData.selectedBars.map((b) => (b === 'cake-bar' ? 'Cake Bar' : b === 'drinks' ? 'Boissons' : 'Charcuterie')).join(', ')}
                      </span>
                    </div>
                    <button type="button" className="text-solly-charcoal/60 hover:text-solly-pink">
                      {summaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {summaryExpanded && (
                    <div className="mt-2 pt-2 border-t border-solly-border/60 text-xs text-solly-charcoal/80 space-y-1">
                      {orderChoices.cakeBar && formData.selectedBars.includes('cake-bar') && (
                        <p>
                          <span className="font-bold text-solly-charcoal">Cake Bar :</span> {orderChoices.cakeBar.barquette || 'Standard'} • {orderChoices.cakeBar.base || 'Vanille'} • {orderChoices.cakeBar.sauces.join(', ') || 'Chocolat'} • {orderChoices.cakeBar.composants.join(', ') || 'Toppings'}
                        </p>
                      )}
                      {orderChoices.drinks && orderChoices.drinks.length > 0 && formData.selectedBars.includes('drinks') && (
                        <p>
                          <span className="font-bold text-solly-charcoal">Boissons :</span> {orderChoices.drinks.join(', ')}
                        </p>
                      )}
                      {orderChoices.charcuterie && formData.selectedBars.includes('charcuterie') && (
                        <p>
                          <span className="font-bold text-solly-charcoal">Charcuterie :</span> {orderChoices.charcuterie.format} • {orderChoices.charcuterie.composants.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Section Personnalisation : 2 Options claires */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal">
                    Options de personnalisation (facultatif)
                  </label>
                  <p className="text-[11px] text-solly-muted font-medium mt-0.5">
                    Sublimez votre chariot ou vos contenants aux couleurs de votre célébration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Chariot */}
                  <div
                    onClick={handleCartCustomizationToggle}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      formData.hasCartCustomization
                        ? 'border-solly-pink bg-solly-pink-soft/30 shadow-2xs'
                        : 'border-solly-border bg-white hover:border-solly-pink/40'
                    }`}
                  >
                    <div>
                      <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                        Personnalisation du chariot
                      </span>
                      <span className="text-[11px] text-solly-muted block mt-0.5 leading-snug">
                        Panneau prénom / logo sur la façade avant amovible
                      </span>
                      <span className="text-xs font-extrabold text-solly-pink block mt-1.5">
                        +{formatPriceFCFA(PRICING_CONFIG.CART_CUSTOMIZATION)}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        formData.hasCartCustomization
                          ? 'bg-solly-pink text-white'
                          : 'border border-solly-border bg-[#FAF7F2] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Option 2: Contenants */}
                  <div
                    onClick={handleCustomPackagingToggle}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      formData.hasCustomPackaging
                        ? 'border-solly-pink bg-solly-pink-soft/30 shadow-2xs'
                        : 'border-solly-border bg-white hover:border-solly-pink/40'
                    }`}
                  >
                    <div>
                      <span className="font-display font-black text-xs sm:text-sm text-solly-charcoal block">
                        Couverts & contenants personnalisés
                      </span>
                      <span className="text-[11px] text-solly-muted block mt-0.5 leading-snug">
                        Stickers personnalisés sur les barquettes, pots ou serviettes
                      </span>
                      <span className="text-xs font-extrabold text-solly-pink block mt-1.5">
                        +{formatPriceFCFA(PRICING_CONFIG.CUSTOM_PACKAGING)}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        formData.hasCustomPackaging
                          ? 'bg-solly-pink text-white'
                          : 'border border-solly-border bg-[#FAF7F2] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Thème ou couleurs & Photos d'inspiration */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-solly-charcoal">
                  Thème, couleurs ou inspirations visuelles
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, themeColor: e.target.value }))}
                    placeholder="Ex: Pastel rose & or, Safari dinosaure, Bleu ciel..."
                    className="flex-1 bg-[#FAF7F2] border border-solly-border rounded-2xl px-3.5 py-3 text-base sm:text-sm text-solly-charcoal font-semibold focus:outline-none focus:border-solly-pink/60 transition-colors"
                  />
                  
                  {/* Invisible file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* Trigger button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={(formData.inspirationPhotos?.length || 0) >= 2}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                      (formData.inspirationPhotos?.length || 0) >= 2
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-90 cursor-default'
                        : 'border-solly-pink text-solly-pink hover:bg-solly-pink-soft'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {(formData.inspirationPhotos?.length || 0) === 0
                        ? 'Ajouter une inspiration'
                        : (formData.inspirationPhotos?.length || 0) === 1
                        ? '+ Ajouter 2e photo'
                        : '2/2 photos jointes ✓'}
                    </span>
                  </button>
                </div>

                {/* Counter & limits note */}
                <div className="flex items-center justify-between text-[11px] text-solly-muted font-medium px-1">
                  <span>Max. 2 photos (2 Mo max au total)</span>
                  {formData.inspirationPhotos && formData.inspirationPhotos.length > 0 && (
                    <span className="font-bold text-solly-pink">
                      {formData.inspirationPhotos.length}/2 photo(s) •{' '}
                      {(formData.inspirationPhotos.reduce((acc, p) => acc + p.size, 0) / 1024).toFixed(0)} Ko
                    </span>
                  )}
                </div>

                {/* Error message */}
                {inspirationError && (
                  <p className="text-[11px] text-red-500 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {inspirationError}
                  </p>
                )}

                {/* Attached photos thumbnails */}
                {formData.inspirationPhotos && formData.inspirationPhotos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {formData.inspirationPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white border border-solly-border rounded-xl p-2 flex items-center justify-between gap-2.5 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={photo.dataUrl}
                            alt={photo.name}
                            className="w-11 h-11 rounded-lg object-cover border border-solly-border shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-solly-charcoal truncate">
                              {photo.name}
                            </p>
                            <p className="text-[10px] text-solly-muted">
                              {(photo.size / 1024).toFixed(0)} Ko
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="w-7 h-7 rounded-full bg-solly-cream hover:bg-red-50 hover:text-red-500 border border-solly-border flex items-center justify-center text-solly-charcoal transition-colors cursor-pointer shrink-0"
                          aria-label="Supprimer la photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.form>
          )}

          {/* ========================================================= */}
          {/* STEP 03: VOS COORDONNÉES (NO EMAIL, COUNTRY SELECTOR) */}
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
                  Pour vous transmettre votre devis et échanger directement sur WhatsApp.
                </p>
              </div>

              {/* Nom & Téléphone avec sélecteur d'indicatif pays */}
              <div className="space-y-4">
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

                {/* Téléphone (WhatsApp) avec indicateur de pays */}
                <div>
                  <label className="block text-xs font-bold text-solly-charcoal mb-1.5">
                    Numéro de téléphone (WhatsApp) <span className="text-solly-pink">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* Country code selector: Only flag and dial code */}
                    <div className="relative shrink-0 w-[92px] sm:w-[98px]">
                      <select
                        value={formData.countryCode || '+221'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, countryCode: e.target.value }))}
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

                    {/* Phone input */}
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
                  placeholder="Allergies, horaire d’installation, accès salle..."
                  className="w-full bg-[#FAF7F2] border border-solly-border rounded-2xl p-3.5 text-base sm:text-sm text-solly-charcoal font-medium focus:outline-none focus:border-solly-pink/60 transition-colors resize-none"
                />
              </div>

              {/* Summary Card: Estimation & Récapitulatif détaillé */}
              <div className="bg-[#FCECEF] border border-solly-pink/25 rounded-2xl p-4 sm:p-5 text-solly-charcoal shadow-2xs space-y-3.5">
                <div className="flex items-start justify-between gap-3 border-b border-solly-pink/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-solly-pink/30 flex items-center justify-center text-solly-pink shrink-0 shadow-2xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-solly-charcoal">
                        Votre devis estimatif
                      </h4>
                      <p className="text-[11px] text-solly-muted font-medium mt-0.5">
                        {formData.eventType || 'Événement'} • {formattedDate} {formData.eventTime ? `• ${formData.eventTime}` : ''} • {formData.address || 'Dakar'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-solly-pink hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Modifier</span>
                  </button>
                </div>

                {/* Itemized calculation breakdown */}
                <div className="space-y-2 text-xs">
                  {/* Base formula */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-solly-charcoal block">
                        Formule de base ({pricing.effectiveGuests} invités × 4 000 FCFA)
                      </span>
                      <span className="text-[11px] text-solly-muted block">
                        Bar principal inclus : {formData.mainBar === 'charcuterie' ? 'Bar salé / Charcuterie' : 'Cake Bar'}
                      </span>
                    </div>
                    <span className="font-bold text-solly-charcoal shrink-0">
                      {formatPriceFCFA(pricing.basePrice)}
                    </span>
                  </div>

                  {/* Extra bar if selected */}
                  {formData.hasExtraBar && (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-solly-charcoal block">
                          Bar supplémentaire : {formData.extraBarType === 'charcuterie' ? 'Bar salé / Charcuterie' : 'Cake Bar'}
                        </span>
                        <span className="text-[11px] text-solly-muted block">
                          {pricing.effectiveGuests} invités × 1 000 FCFA
                        </span>
                      </div>
                      <span className="font-bold text-solly-pink shrink-0">
                        +{formatPriceFCFA(pricing.extraBarPrice)}
                      </span>
                    </div>
                  )}

                  {/* Drinks if selected */}
                  {formData.hasDrinks && (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-solly-charcoal block">
                          Option Boissons Solly (3 jus frais)
                        </span>
                        <span className="text-[11px] text-solly-muted block">
                          {pricing.effectiveGuests} invités × 1 000 FCFA
                        </span>
                      </div>
                      <span className="font-bold text-solly-pink shrink-0">
                        +{formatPriceFCFA(pricing.drinksPrice)}
                      </span>
                    </div>
                  )}

                  {/* Cart customization if selected */}
                  {formData.hasCartCustomization && (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-solly-charcoal block">
                          Personnalisation du chariot
                        </span>
                        <span className="text-[11px] text-solly-muted block">
                          Façade amovible personnalisée (forfait)
                        </span>
                      </div>
                      <span className="font-bold text-solly-pink shrink-0">
                        +{formatPriceFCFA(pricing.cartCustomizationPrice)}
                      </span>
                    </div>
                  )}

                  {/* Packaging customization if selected */}
                  {formData.hasCustomPackaging && (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-solly-charcoal block">
                          Couverts & contenants personnalisés
                        </span>
                        <span className="text-[11px] text-solly-muted block">
                          Stickers contenants de l’événement (forfait)
                        </span>
                      </div>
                      <span className="font-bold text-solly-pink shrink-0">
                        +{formatPriceFCFA(pricing.customPackagingPrice)}
                      </span>
                    </div>
                  )}

                  {/* Inspirations */}
                  {formData.inspirationPhotos && formData.inspirationPhotos.length > 0 && (
                    <p className="text-[11px] text-solly-pink font-semibold pt-1">
                      📸 {formData.inspirationPhotos.length} photo(s) d’inspiration jointe(s)
                    </p>
                  )}
                </div>

                {/* Total box */}
                <div className="pt-2.5 border-t border-solly-pink/20 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-solly-charcoal block">
                      Total estimé :
                    </span>
                    <span className="text-[11px] text-solly-muted block">
                      Transport à confirmer selon l’adresse
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-display font-black text-solly-pink">
                    {formatPriceFCFA(pricing.total)}
                  </span>
                </div>

                {/* Deposit & Balance Schedule */}
                <div className="bg-white/80 rounded-xl p-2.5 border border-solly-pink/20 text-[11px] text-solly-charcoal space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Acompte 70% à la réservation :</span>
                    <span className="text-solly-pink">{formatPriceFCFA(pricing.deposit70)}</span>
                  </div>
                  <div className="flex justify-between text-solly-muted font-medium">
                    <span>Solde 30% à J-2 :</span>
                    <span>{formatPriceFCFA(pricing.balance30)}</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-solly-muted font-medium">
                <Info className="w-4 h-4 text-solly-charcoal/60 shrink-0" />
                <span>Réponse et devis gratuit sous 24h ouvrées. Sans engagement.</span>
              </div>

              {/* CGV & Remboursement notice */}
              <p className="text-[10px] sm:text-[11px] text-solly-muted text-center pt-1 leading-normal">
                En envoyant votre demande, vous acceptez nos{' '}
                <Link href="/cgv" target="_blank" className="text-solly-pink underline font-semibold hover:text-solly-charcoal">
                  CGV
                </Link>
                {' '}et notre{' '}
                <Link href="/politique-de-remboursement" target="_blank" className="text-solly-pink underline font-semibold hover:text-solly-charcoal">
                  politique d’annulation
                </Link>.
              </p>
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
                  Votre demande Solly est bien partie ♡
                </h2>
                <p className="text-xs sm:text-sm text-solly-charcoal/80 font-medium mt-1.5 leading-relaxed px-2">
                  Nous vérifions la disponibilité de votre date et les détails de votre événement avant validation définitive.
                </p>
              </div>

              {/* 4-step Progress Stepper */}
              <div className="bg-[#FAF7F2] border border-solly-border rounded-2xl p-4 text-left space-y-3 shadow-2xs">
                <h4 className="text-[11px] font-extrabold text-solly-charcoal uppercase tracking-wider text-center">
                  Les étapes de votre réservation
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-solly-charcoal">1. Demande reçue</p>
                      <p className="text-[11px] text-solly-muted">Votre demande est bien enregistrée par notre équipe.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-solly-pink text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 animate-pulse">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-solly-charcoal">2. Vérification de disponibilité</p>
                      <p className="text-[11px] text-solly-muted">Nous vérifions notre planning et revenons vers vous sous 24h ouvrées.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white border border-solly-border text-solly-muted flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-solly-charcoal">3. Acompte de 70%</p>
                      <p className="text-[11px] text-solly-muted">Le versement de l’acompte ({formatPriceFCFA(pricing.deposit70)}) bloque officiellement la date.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white border border-solly-border text-solly-muted flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="text-xs font-bold text-solly-charcoal">4. Réservation confirmée</p>
                      <p className="text-[11px] text-solly-muted">Votre date est bloquée ! Le solde de 30% sera réglé à J-2.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Summary Card */}
              <div className="bg-[#FCECEF] border border-solly-pink/20 rounded-2xl p-3.5 text-left text-xs text-solly-charcoal space-y-1.5 shadow-2xs">
                <div className="flex justify-between font-bold pb-1.5 border-b border-solly-pink/20">
                  <span>Récapitulatif de votre demande</span>
                  <span className="text-solly-pink font-display font-black">{formatPriceFCFA(pricing.total)}</span>
                </div>
                <div className="text-[11px] space-y-1 text-solly-charcoal/80">
                  <p><strong>Date & Lieu :</strong> {formattedDate} {formData.eventTime ? `(${formData.eventTime})` : ''} • {formData.address || 'Dakar'}</p>
                  <p><strong>Formule :</strong> {pricing.effectiveGuests} personnes • {selectedBarsSummary()}</p>
                  {formData.hasCartCustomization && <p><strong>Personnalisation :</strong> Façade du chariot (+15 000 FCFA)</p>}
                  {formData.hasCustomPackaging && <p><strong>Contenants :</strong> Couverts personnalisés (+10 000 FCFA)</p>}
                  <p className="text-solly-pink font-semibold"><strong>Acompte pour bloquer la date :</strong> {formatPriceFCFA(pricing.deposit70)} (70%)</p>
                </div>
              </div>

              {/* Primary Action: WhatsApp Optional Link (no auto-redirection) */}
              <div className="space-y-2 pt-1">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    if (formData.inspirationPhotos && formData.inspirationPhotos.length > 0) {
                      try {
                        const firstPhoto = formData.inspirationPhotos[0];
                        if (firstPhoto.dataUrl && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                          const res = await fetch(firstPhoto.dataUrl);
                          const blob = await res.blob();
                          await navigator.clipboard.write([
                            new ClipboardItem({ [blob.type]: blob }),
                          ]);
                        }
                      } catch {
                        // ignore clipboard write restrictions
                      }
                    }
                  }}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#25D366] text-white font-display font-bold text-sm sm:text-base hover:bg-[#1EBE5D] shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Échanger avec nous sur WhatsApp</span>
                </a>
                <p className="text-[11px] text-solly-muted font-medium">
                  Optionnel : pour poser une question ou échanger directement avec notre équipe.
                </p>
              </div>

              {/* Photo inspiration reminder */}
              {formData.inspirationPhotos && formData.inspirationPhotos.length > 0 && (
                <div className="bg-[#FFF8E3] border border-[#FDE68A] rounded-2xl p-3 sm:p-3.5 text-left space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <span>📸</span>
                    <span>{formData.inspirationPhotos.length} photo(s) d’inspiration :</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Vos photos sont transmises dans le récapitulatif par email à l’équipe Solly. En ouvrant WhatsApp ci-dessus, pensez également à joindre votre/vos photo(s) dans la discussion !
                  </p>
                </div>
              )}

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

      {/* 4. STICKY THUMB-ZONE ACTION FOOTER */}
      {currentStep < 4 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 sm:px-6 sm:py-3.5 border-t border-solly-border/70 flex items-center justify-between gap-3 z-20 shrink-0">
          <div className="flex items-center gap-2">
            {currentStep === 1 ? (
              <div className="flex items-center gap-1.5 pl-1 text-xs font-bold text-solly-charcoal/80">
                <span className="w-2 h-2 rounded-full bg-solly-pink inline-block" />
                <span>{formData.guestCount || 20} invités sélectionnés</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep === 3 ? 2 : 1)}
                  className="text-xs sm:text-sm font-bold text-solly-muted hover:text-solly-charcoal transition-colors cursor-pointer inline-flex items-center gap-1 px-2.5 py-2 rounded-xl hover:bg-solly-cream"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Retour</span>
                </button>

                {/* Live Pricing Estimation from Step 2 onwards */}
                <div className="flex flex-col text-left pl-1">
                  <span className="text-[10px] sm:text-xs text-solly-muted font-semibold leading-tight">
                    Estimation ({pricing.effectiveGuests} pers.)
                  </span>
                  <span className="text-xs sm:text-base font-display font-black text-solly-pink leading-tight">
                    {formatPriceFCFA(pricing.total)}
                  </span>
                  <span className="text-[9px] text-solly-muted/80 leading-none hidden sm:block">
                    Hors transport • Acompte 70%
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleNextFromStep1}
                className="px-5 sm:px-8 py-3 rounded-full bg-solly-pink text-white font-display font-bold text-xs sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continuer vers les bars</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleNextFromStep2}
                className="px-5 sm:px-8 py-3 rounded-full bg-solly-pink text-white font-display font-bold text-xs sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleSubmitStep3}
                disabled={isSubmitting}
                className="px-5 sm:px-8 py-3 rounded-full bg-solly-pink text-white font-display font-bold text-xs sm:text-base hover:bg-solly-pink-hover shadow-solly-pink transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi...</span>
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
        </div>
      )}
    </div>
  );
}
