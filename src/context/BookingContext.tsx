'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

import { calculateBookingPrice, formatPriceFCFA, PRICING_CONFIG } from '@/lib/pricing';

export type EventType =
  | "Anniversaire d'enfant"
  | "Célébration familiale"
  | "Événement scolaire / parents"
  | "Événement d'entreprise"
  | "Autre événement";

export type ExperienceType =
  | 'Cake Bar'
  | 'Mini Pancakes'
  | 'Croffles'
  | 'Boissons'
  | 'Charcuterie'
  | 'Souhaite être conseillé';

export type MainBarType = 'cake-bar' | 'mini-pancakes' | 'croffles' | 'charcuterie';
export type SelectedBarType = 'cake-bar' | 'mini-pancakes' | 'croffles' | 'drinks' | 'charcuterie';

export function getBarTitle(bar: MainBarType): string {
  switch (bar) {
    case 'cake-bar':
      return 'Cake Bar';
    case 'mini-pancakes':
      return 'Mini Pancakes';
    case 'croffles':
      return 'Croffles';
    case 'charcuterie':
      return 'Bar salé / Charcuterie';
    default:
      return 'Bar gourmand';
  }
}

export interface CakeCustomization {
  barquette?: string; // 'Barquette standard Solly' | 'Barquette à thème' | 'Barquette premium'
  base: string;
  sauces: string[];
  composants: string[];
}

export interface PancakeCustomization {
  sauces: string[];
  toppings: string[];
}

export interface CroffleCustomization {
  sauces: string[];
  toppings: string[];
}

export interface CharcuterieCustomization {
  format: string; // 'Le Cornet' | 'Le Pot'
  composants: string[];
}

export interface OrderChoices {
  packageType?: string; // e.g. "Cake Bar", "Mini Pancakes", etc.
  cakeBar?: CakeCustomization;
  miniPancakes?: PancakeCustomization;
  croffles?: CroffleCustomization;
  drinks?: string[];
  charcuterie?: CharcuterieCustomization;
  eventInspiration?: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string; // e.g. '+221'
  email?: string;
  eventDate: string;
  eventTime: string;
  eventType: EventType | '';
  guestCount: number | '';
  address: string; // Strictly "Adresse de l'événement"
  experience: ExperienceType | '';
  // Pricing & bars model
  mainBar: MainBarType | '';
  selectedBars: SelectedBarType[];
  hasExtraBar: boolean;
  extraBarType?: MainBarType;
  extraBars?: MainBarType[];
  hasDrinks: boolean;
  hasCartCustomization: boolean; // +15 000 FCFA
  hasCustomPackaging: boolean;   // +10 000 FCFA
  isAdvised: boolean;
  personalization: 'oui' | 'non' | 'a-definir' | '';
  themeColor: string;
  inspirationPhotos?: { name: string; size: number; dataUrl: string }[];
  message: string;
}

export interface OpenBookingOptions {
  experience?: ExperienceType;
  packageType?: string;
  cakeBar?: CakeCustomization;
  drinks?: string[];
  charcuterie?: CharcuterieCustomization;
  eventType?: EventType;
  eventInspiration?: string;
  initialStep?: 1 | 2 | 3 | 4;
}

interface BookingContextType {
  isOpen: boolean;
  openBooking: (options?: ExperienceType | OpenBookingOptions) => void;
  closeBooking: () => void;
  currentStep: 1 | 2 | 3 | 4;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  orderChoices: OrderChoices;
  setOrderChoices: React.Dispatch<React.SetStateAction<OrderChoices>>;
  updateCakeCustomization: (cake: CakeCustomization) => void;
  updateMiniPancakesCustomization: (pancakes: PancakeCustomization) => void;
  updateCrofflesCustomization: (croffles: CroffleCustomization) => void;
  updatePackageType: (pkg: string) => void;
  updateDrinksCustomization: (drinks: string[]) => void;
  updateCharcuterieCustomization: (charcuterie: CharcuterieCustomization) => void;
  hasCustomChoices: boolean;
  isSubmitted: boolean;
  bookingRef: string | null;
  setBookingRef: (ref: string | null) => void;
  bookingStatus: string;
  setBookingStatus: (status: string) => void;
  submitBooking: (data?: BookingFormData, ref?: string) => Promise<void>;
  resetBooking: () => void;
  getWhatsAppUrl: () => string;
}

const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  countryCode: '+221',
  email: '',
  eventDate: '',
  eventTime: '',
  eventType: '',
  guestCount: 20, // Base minimum 20 invités
  address: '',
  experience: '',
  mainBar: '',
  selectedBars: [],
  hasExtraBar: false,
  extraBarType: undefined,
  extraBars: [],
  hasDrinks: false,
  hasCartCustomization: false,
  hasCustomPackaging: false,
  isAdvised: false,
  personalization: '',
  themeColor: '',
  inspirationPhotos: [],
  message: '',
};

const initialOrderChoices: OrderChoices = {
  packageType: '',
  cakeBar: undefined,
  miniPancakes: undefined,
  croffles: undefined,
  drinks: [],
  charcuterie: undefined,
  eventInspiration: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [orderChoices, setOrderChoices] = useState<OrderChoices>(initialOrderChoices);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>('PENDING');

  const updateCakeCustomization = (cake: CakeCustomization) => {
    setOrderChoices((prev) => ({ ...prev, cakeBar: cake }));
  };

  const updateMiniPancakesCustomization = (pancakes: PancakeCustomization) => {
    setOrderChoices((prev) => ({ ...prev, miniPancakes: pancakes }));
  };

  const updateCrofflesCustomization = (croffles: CroffleCustomization) => {
    setOrderChoices((prev) => ({ ...prev, croffles }));
  };

  const updatePackageType = (pkg: string) => {
    setOrderChoices((prev) => ({ ...prev, packageType: pkg }));
  };

  const updateDrinksCustomization = (drinks: string[]) => {
    setOrderChoices((prev) => ({ ...prev, drinks }));
  };

  const updateCharcuterieCustomization = (charcuterie: CharcuterieCustomization) => {
    setOrderChoices((prev) => ({ ...prev, charcuterie }));
  };

  const openBooking = (options?: ExperienceType | OpenBookingOptions) => {
    if (typeof options === 'string') {
      const isCharc = options === 'Charcuterie';
      const isPancakes = options === 'Mini Pancakes';
      const isCroffles = options === 'Croffles';
      const isCake = options === 'Cake Bar';
      const isDrinks = options === 'Boissons';

      let bar: MainBarType | '' = '';
      if (isCharc) bar = 'charcuterie';
      else if (isPancakes) bar = 'mini-pancakes';
      else if (isCroffles) bar = 'croffles';
      else if (isCake) bar = 'cake-bar';

      const nextBars: SelectedBarType[] = bar ? [bar] : [];
      if (isDrinks && !nextBars.includes('drinks')) nextBars.push('drinks');

      setFormData((prev) => ({
        ...prev,
        experience: options,
        mainBar: bar,
        hasDrinks: isDrinks ? true : prev.hasDrinks,
        selectedBars: nextBars,
        extraBars: [],
        hasExtraBar: false,
        isAdvised: options === 'Souhaite être conseillé' ? true : prev.isAdvised,
      }));
    } else if (options && typeof options === 'object') {
      const pkg = options.packageType || '';
      const isMix = pkg.includes('2 Bars') || pkg.includes('mix');
      const isCharcuterie = options.experience === 'Charcuterie' || pkg.includes('Charcuterie') || pkg.includes('salé');
      const isPancakes = options.experience === 'Mini Pancakes' || pkg.includes('Pancakes');
      const isCroffles = options.experience === 'Croffles' || pkg.includes('Croffles');
      const isCake = options.experience === 'Cake Bar' || pkg.includes('Cake');
      const isDrinks = options.experience === 'Boissons' || (options.drinks && options.drinks.length > 0);

      let mainBar: MainBarType | '' = '';
      if (isCharcuterie) mainBar = 'charcuterie';
      else if (isPancakes) mainBar = 'mini-pancakes';
      else if (isCroffles) mainBar = 'croffles';
      else if (isCake) mainBar = 'cake-bar';

      setFormData((prev) => {
        const hasExtraBar = isMix;
        const extraBarType: MainBarType | undefined = isMix ? (mainBar === 'charcuterie' ? 'cake-bar' : 'charcuterie') : undefined;
        const extraBars: MainBarType[] = extraBarType ? [extraBarType] : [];
        const hasDrinks = Boolean(isDrinks);

        const nextBars: SelectedBarType[] = mainBar ? [mainBar] : [];
        if (hasExtraBar && extraBarType && !nextBars.includes(extraBarType)) nextBars.push(extraBarType);
        if (hasDrinks && !nextBars.includes('drinks')) nextBars.push('drinks');

        return {
          ...prev,
          experience: options.experience !== undefined ? options.experience : prev.experience,
          eventType: options.eventType !== undefined ? options.eventType : prev.eventType,
          themeColor: options.eventInspiration !== undefined ? options.eventInspiration : prev.themeColor,
          mainBar,
          hasExtraBar,
          extraBarType,
          extraBars,
          hasDrinks,
          selectedBars: nextBars,
          isAdvised: options.experience === 'Souhaite être conseillé' ? true : prev.isAdvised,
        };
      });

      setOrderChoices((prev) => ({
        ...prev,
        packageType: options.packageType !== undefined ? options.packageType : prev.packageType,
        cakeBar: options.cakeBar !== undefined ? options.cakeBar : prev.cakeBar,
        drinks: options.drinks !== undefined ? options.drinks : prev.drinks,
        charcuterie: options.charcuterie !== undefined ? options.charcuterie : prev.charcuterie,
        eventInspiration: options.eventInspiration !== undefined ? options.eventInspiration : prev.eventInspiration,
      }));

      if (options.initialStep) {
        setCurrentStep(options.initialStep);
      } else {
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(1);
    }
    setIsSubmitted(false);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  const submitBooking = async (data?: BookingFormData, ref?: string) => {
    if (data) {
      setFormData(data);
    }
    if (ref) {
      setBookingRef(ref);
    }
    setIsSubmitted(true);
    setCurrentStep(4);
  };

  const resetBooking = () => {
    setFormData(initialFormData);
    setOrderChoices(initialOrderChoices);
    setIsSubmitted(false);
    setBookingRef(null);
    setBookingStatus('PENDING');
    setCurrentStep(1);
  };

  const hasCustomChoices = Boolean(
    orderChoices.packageType ||
    (orderChoices.cakeBar && (orderChoices.cakeBar.barquette || orderChoices.cakeBar.base || orderChoices.cakeBar.composants.length > 0)) ||
    (orderChoices.miniPancakes && (orderChoices.miniPancakes.sauces.length > 0 || orderChoices.miniPancakes.toppings.length > 0)) ||
    (orderChoices.croffles && (orderChoices.croffles.sauces.length > 0 || orderChoices.croffles.toppings.length > 0)) ||
    (orderChoices.drinks && orderChoices.drinks.length > 0) ||
    (orderChoices.charcuterie && (orderChoices.charcuterie.format || orderChoices.charcuterie.composants.length > 0)) ||
    orderChoices.eventInspiration
  );

  const getWhatsAppUrl = () => {
    const extraBarsCount = formData.extraBars && formData.extraBars.length > 0
      ? formData.extraBars.length
      : (formData.hasExtraBar ? 1 : 0);

    const pricing = calculateBookingPrice({
      guestCount: formData.guestCount,
      extraBars: formData.extraBars,
      extraBarsCount,
      hasExtraBar: extraBarsCount > 0,
      hasDrinks: formData.hasDrinks,
      hasCartCustomization: formData.hasCartCustomization,
      hasCustomPackaging: formData.hasCustomPackaging,
    });

    const mainBarLabel = formData.mainBar ? getBarTitle(formData.mainBar) : 'Cake Bar';
    const phoneWithCountry = formData.countryCode
      ? `${formData.countryCode} ${formData.phone}`.trim()
      : formData.phone;

    let text = `Bonjour Solly ! ✨ Je souhaite organiser un événement gourmand.\n\n` +
      `🎉 Type d'événement : ${formData.eventType || 'À préciser'}\n` +
      `📅 Date : ${formData.eventDate || 'À définir'} ${formData.eventTime ? `à ${formData.eventTime}` : ''}\n` +
      `👥 Invités : ${formData.guestCount || '20'} personnes\n` +
      `📍 Lieu : ${formData.address || 'Dakar'}\n\n` +
      `🍰 Bar principal : ${mainBarLabel} (inclus à 4 000 FCFA / invité)\n`;

    if (formData.extraBars && formData.extraBars.length > 0) {
      formData.extraBars.forEach((b) => {
        const rateText = b === 'croffles' ? '+1 500 FCFA' : '+1 000 FCFA';
        text += `➕ Bar supplémentaire : ${getBarTitle(b)} (${rateText} / invité)\n`;
      });
    } else if (formData.hasExtraBar && formData.extraBarType) {
      const rateText = formData.extraBarType === 'croffles' ? '+1 500 FCFA' : '+1 000 FCFA';
      text += `➕ Bar supplémentaire : ${getBarTitle(formData.extraBarType)} (${rateText} / invité)\n`;
    }

    if (formData.hasDrinks) {
      text += `🍹 Option Boissons Solly : +1 000 FCFA / invité\n`;
    }
    if (formData.hasCartCustomization) {
      text += `🎨 Personnalisation du chariot : +15 000 FCFA\n`;
    }
    if (formData.hasCustomPackaging) {
      text += `✨ Couverts / contenants personnalisés : +10 000 FCFA\n`;
    }

    text += `\n💰 Estimation totale : ${formatPriceFCFA(pricing.total)} (hors transport)\n` +
      `📌 Acompte de 70% pour bloquer la date : ${formatPriceFCFA(pricing.deposit70)}\n` +
      `📌 Solde de 30% à J-2 : ${formatPriceFCFA(pricing.balance30)}\n` +
      `🚚 Transport : À confirmer selon l'adresse exacte\n\n` +
      `👤 Contact :\n` +
      `• Nom : ${formData.firstName || ''} ${formData.lastName || ''}\n` +
      `• Téléphone (WhatsApp) : ${phoneWithCountry || 'Non renseigné'}\n`;

    const allBars = [formData.mainBar, ...(formData.extraBars || [])];

    if (orderChoices.cakeBar && allBars.includes('cake-bar')) {
      text += `\n🍰 Détails Cake Bar :\n` +
        (orderChoices.cakeBar.barquette ? `  - Barquette : ${orderChoices.cakeBar.barquette}\n` : '') +
        `  - Base : ${orderChoices.cakeBar.base || 'Vanille'}\n` +
        `  - Sauces : ${orderChoices.cakeBar.sauces.join(', ') || 'Chocolat'}\n` +
        `  - Composants : ${orderChoices.cakeBar.composants.join(', ') || 'Toppings'}\n`;
    }

    if (orderChoices.miniPancakes && allBars.includes('mini-pancakes')) {
      text += `\n🥞 Détails Mini Pancakes :\n` +
        (orderChoices.miniPancakes.sauces.length > 0 ? `  - Sauces : ${orderChoices.miniPancakes.sauces.join(', ')}\n` : '') +
        (orderChoices.miniPancakes.toppings.length > 0 ? `  - Toppings : ${orderChoices.miniPancakes.toppings.join(', ')}\n` : '');
    }

    if (orderChoices.croffles && allBars.includes('croffles')) {
      text += `\n🥐 Détails Croffles :\n` +
        (orderChoices.croffles.sauces.length > 0 ? `  - Sauces : ${orderChoices.croffles.sauces.join(', ')}\n` : '') +
        (orderChoices.croffles.toppings.length > 0 ? `  - Toppings : ${orderChoices.croffles.toppings.join(', ')}\n` : '');
    }

    if (formData.hasDrinks && orderChoices.drinks && orderChoices.drinks.length > 0) {
      text += `\n🍹 Détails Boissons : ${orderChoices.drinks.join(', ')}\n`;
    }

    if (orderChoices.charcuterie && allBars.includes('charcuterie')) {
      text += `\n🧀 Détails Charcuterie : Format ${orderChoices.charcuterie.format || 'Cornet'} (${orderChoices.charcuterie.composants.join(', ')})\n`;
    }

    if (formData.message) {
      text += `\n💬 Note / Précisions : ${formData.message}\n`;
    }

    text += `\nMerci et à très vite ! ♡`;

    return `https://wa.me/221776900458?text=${encodeURIComponent(text)}`;
  };

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        openBooking,
        closeBooking,
        currentStep,
        setCurrentStep,
        formData,
        setFormData,
        orderChoices,
        setOrderChoices,
        updateCakeCustomization,
        updateMiniPancakesCustomization,
        updateCrofflesCustomization,
        updatePackageType,
        updateDrinksCustomization,
        updateCharcuterieCustomization,
        hasCustomChoices,
        isSubmitted,
        bookingRef,
        setBookingRef,
        bookingStatus,
        setBookingStatus,
        submitBooking,
        resetBooking,
        getWhatsAppUrl,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
