'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { formatPriceFCFA } from '@/lib/pricing';

export type EventType =
  | 'Anniversaire'
  | 'Baptême'
  | 'Mariage'
  | 'Baby shower'
  | "Événement d’entreprise"
  | "Événement d'entreprise"
  | 'Activation de marque'
  | 'Autre'
  | "Anniversaire d'enfant"
  | "Célébration familiale"
  | "Événement scolaire / parents"
  | "Autre événement"
  | (string & {});

export type ExperienceId = 'mini-pancakes' | 'croffles' | 'cake-bar' | 'charcuterie';

export function getExperienceLabel(id: ExperienceId | string): string {
  switch (id) {
    case 'mini-pancakes':
      return 'Mini Pancakes';
    case 'croffles':
      return 'Croffles';
    case 'cake-bar':
      return 'Cake Bar';
    case 'charcuterie':
      return 'Charcuterie';
    default:
      return id;
  }
}

// Backward compatibility helpers
export type MainBarType = ExperienceId;
export type SelectedBarType = ExperienceId | 'drinks';
export function getBarTitle(bar: string): string {
  return getExperienceLabel(bar);
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string; // e.g. '+221'
  email?: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  guestCount: number | '';
  address: string;
  budgetMinimum: number;
  budgetDesired: number;
  selectedExperiences: ExperienceId[];
  personalization: 'oui' | 'non' | 'a-definir' | '';
  personalizationCart: boolean;
  personalizationTableware: boolean;
  message: string;

  // Backward compatibility fields
  experience?: string;
  mainBar?: string;
  selectedBars?: SelectedBarType[];
  hasExtraBar?: boolean;
  extraBars?: string[];
  hasDrinks?: boolean;
  hasCartCustomization?: boolean;
  hasCustomPackaging?: boolean;
  isAdvised?: boolean;
  themeColor?: string;
  inspirationPhotos?: { name: string; size: number; dataUrl: string }[];
}

export interface OpenBookingOptions {
  experience?: string;
  packageType?: string;
  cakeBar?: any;
  drinks?: string[];
  charcuterie?: any;
  eventType?: string;
  eventInspiration?: string;
  initialStep?: 1 | 2 | 3 | 4;
}

export interface OrderChoices {
  packageType?: string;
  cakeBar?: any;
  miniPancakes?: any;
  croffles?: any;
  drinks?: string[];
  charcuterie?: any;
  eventInspiration?: string;
}

interface BookingContextType {
  isOpen: boolean;
  openBooking: (options?: string | OpenBookingOptions) => void;
  closeBooking: () => void;
  currentStep: 1 | 2 | 3 | 4;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  orderChoices: OrderChoices;
  setOrderChoices: React.Dispatch<React.SetStateAction<OrderChoices>>;
  updateCakeCustomization: (cake: any) => void;
  updateMiniPancakesCustomization: (pancakes: any) => void;
  updateCrofflesCustomization: (croffles: any) => void;
  updatePackageType: (pkg: string) => void;
  updateDrinksCustomization: (drinks: string[]) => void;
  updateCharcuterieCustomization: (charcuterie: any) => void;
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

export const calculateMinimumBudget = (guestCount: number | '' | undefined): number => {
  const count = typeof guestCount === 'number' && !isNaN(guestCount) && guestCount > 0 ? guestCount : 20;
  return Math.max(80000, count * 4000);
};

const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  countryCode: '+221',
  email: '',
  eventDate: '',
  eventTime: '',
  eventType: '',
  guestCount: 20,
  address: '',
  budgetMinimum: 80000,
  budgetDesired: 80000,
  selectedExperiences: ['cake-bar'],
  personalization: '',
  personalizationCart: false,
  personalizationTableware: false,
  message: '',
  mainBar: 'cake-bar',
  selectedBars: ['cake-bar'],
  hasExtraBar: false,
  hasDrinks: false,
  hasCartCustomization: false,
  hasCustomPackaging: false,
  isAdvised: false,
  themeColor: '',
  inspirationPhotos: [],
};

const initialOrderChoices: OrderChoices = {
  packageType: '',
  drinks: [],
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

  const updateCakeCustomization = () => {};
  const updateMiniPancakesCustomization = () => {};
  const updateCrofflesCustomization = () => {};
  const updatePackageType = (pkg: string) => {
    setOrderChoices((prev) => ({ ...prev, packageType: pkg }));
  };
  const updateDrinksCustomization = () => {};
  const updateCharcuterieCustomization = () => {};

  const openBooking = (options?: string | OpenBookingOptions) => {
    if (typeof options === 'string') {
      const optLower = options.toLowerCase();
      if (optLower.includes('2 bar') || optLower.includes('formule 2')) {
        setFormData((prev) => ({
          ...prev,
          selectedExperiences: ['mini-pancakes', 'croffles'],
          selectedBars: ['mini-pancakes', 'croffles'],
          mainBar: 'mini-pancakes',
          experience: 'Formule 2 Bars',
        }));
      } else {
        let exp: ExperienceId = 'cake-bar';
        if (optLower.includes('pancake')) exp = 'mini-pancakes';
        else if (optLower.includes('croffle')) exp = 'croffles';
        else if (optLower.includes('charcuterie') || optLower.includes('salé')) exp = 'charcuterie';
        else if (optLower.includes('cake')) exp = 'cake-bar';

        setFormData((prev) => ({
          ...prev,
          selectedExperiences: [exp],
          selectedBars: [exp],
          mainBar: exp,
          experience: getExperienceLabel(exp),
        }));
      }
      setCurrentStep(1);
    } else if (options && typeof options === 'object') {
      const expStr = options.experience?.toLowerCase() || options.packageType?.toLowerCase() || '';
      if (expStr.includes('2 bar') || expStr.includes('formule 2')) {
        setFormData((prev) => ({
          ...prev,
          selectedExperiences: ['mini-pancakes', 'croffles'],
          selectedBars: ['mini-pancakes', 'croffles'],
          mainBar: 'mini-pancakes',
          experience: options.experience || options.packageType || 'Formule 2 Bars',
          eventType: options.eventType || prev.eventType,
        }));
      } else {
        let exp: ExperienceId = 'cake-bar';
        if (expStr.includes('pancake')) exp = 'mini-pancakes';
        else if (expStr.includes('croffle')) exp = 'croffles';
        else if (expStr.includes('charcuterie') || expStr.includes('salé')) exp = 'charcuterie';
        else if (expStr.includes('cake')) exp = 'cake-bar';

        setFormData((prev) => ({
          ...prev,
          selectedExperiences: [exp],
          selectedBars: [exp],
          mainBar: exp,
          experience: options.experience || options.packageType || getExperienceLabel(exp),
          eventType: options.eventType || prev.eventType,
        }));
      }

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
  };

  const resetBooking = () => {
    setFormData(initialFormData);
    setOrderChoices(initialOrderChoices);
    setIsSubmitted(false);
    setBookingRef(null);
    setBookingStatus('PENDING');
    setCurrentStep(1);
  };

  const hasCustomChoices = Boolean(formData.selectedExperiences.length > 0);

  const getWhatsAppUrl = () => {
    const experiencesList =
      formData.selectedExperiences && formData.selectedExperiences.length > 0
        ? formData.selectedExperiences.map((id) => getExperienceLabel(id)).join(', ')
        : 'À définir ensemble';

    const minBudget = calculateMinimumBudget(formData.guestCount);
    const chosenBudget = Math.max(minBudget, formData.budgetDesired || minBudget);

    const phoneWithCountry = formData.countryCode
      ? `${formData.countryCode} ${formData.phone}`.trim()
      : formData.phone;

    let text = `Bonjour Solly ! ✨ Je souhaite échanger sur ma demande d'événement.\n\n` +
      `🎉 Type d'événement : ${formData.eventType || 'À préciser'}\n` +
      `📅 Date : ${formData.eventDate || 'À définir'} ${formData.eventTime ? `à ${formData.eventTime}` : ''}\n` +
      `👥 Invités : ${formData.guestCount || 20} personnes\n` +
      `📍 Lieu : ${formData.address || 'Dakar'}\n\n` +
      `🍰 Expériences souhaitées :\n• ${experiencesList}\n\n`;

    if (formData.personalization === 'oui') {
      text += `🎨 Personnalisation : Oui\n`;
      if (formData.personalizationCart) text += `  - Personnalisation du chariot / installation\n`;
      if (formData.personalizationTableware) text += `  - Vaisselle et supports personnalisés\n`;
    } else if (formData.personalization === 'non') {
      text += `🎨 Personnalisation : Non (formule standard)\n`;
    } else {
      text += `🎨 Personnalisation : À définir ensemble\n`;
    }

    text += `\n💰 Budget envisagé : ${formatPriceFCFA(chosenBudget)}\n` +
      `📌 (Budget minimum pour ${formData.guestCount || 20} pers. : ${formatPriceFCFA(minBudget)})\n\n` +
      `👤 Contact :\n` +
      `• Nom : ${formData.firstName || ''} ${formData.lastName || ''}\n` +
      `• Téléphone (WhatsApp) : ${phoneWithCountry || 'Non renseigné'}\n`;

    if (formData.email) {
      text += `• Email : ${formData.email}\n`;
    }

    if (formData.message) {
      text += `\n💬 Note / Précisions : ${formData.message}\n`;
    }

    if (bookingRef) {
      text += `\n🔖 Référence demande : #${bookingRef}\n`;
    }

    text += `\nMerci et à très vite pour composer la suite sur mesure ! ♡`;

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
