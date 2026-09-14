'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EventType =
  | "Anniversaire d'enfant"
  | "Célébration familiale"
  | "Événement scolaire / parents"
  | "Événement d'entreprise"
  | "Autre événement";

export type ExperienceType =
  | 'Cake Bar'
  | 'Boissons'
  | 'Charcuterie'
  | 'Souhaite être conseillé';

export type SelectedBarType = 'cake-bar' | 'drinks' | 'charcuterie';

export interface CakeCustomization {
  barquette?: string; // 'Barquette standard Solly' | 'Barquette à thème' | 'Barquette premium'
  base: string;
  sauces: string[];
  composants: string[];
}

export interface CharcuterieCustomization {
  format: string; // 'Le Cornet' | 'Le Pot'
  composants: string[];
}

export interface OrderChoices {
  packageType?: string; // e.g. "L’expérience Solly (80 000 FCFA)" | "L’expérience personnalisée (100 000 FCFA)"
  cakeBar?: CakeCustomization;
  drinks?: string[];
  charcuterie?: CharcuterieCustomization;
  eventInspiration?: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventDate: string;
  eventTime: string; // e.g. '16:00'
  eventType: EventType | '';
  guestCount: number | '';
  address: string; // Strictly "Adresse de l'événement"
  experience: ExperienceType | '';
  selectedBars: SelectedBarType[];
  isAdvised: boolean;
  personalization: 'oui' | 'non' | 'a-definir';
  themeColor: string;
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
  updatePackageType: (pkg: string) => void;
  updateDrinksCustomization: (drinks: string[]) => void;
  updateCharcuterieCustomization: (charcuterie: CharcuterieCustomization) => void;
  hasCustomChoices: boolean;
  isSubmitted: boolean;
  submitBooking: (data?: BookingFormData) => Promise<void>;
  resetBooking: () => void;
  getWhatsAppUrl: () => string;
}

const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  eventDate: '2026-10-24',
  eventTime: '16:00',
  eventType: "Anniversaire d'enfant",
  guestCount: 30,
  address: 'Salle de réception, Dakar',
  experience: 'Cake Bar',
  selectedBars: ['cake-bar', 'drinks'],
  isAdvised: false,
  personalization: 'oui',
  themeColor: 'Dinosaures, vert et beige',
  message: '',
};

const initialOrderChoices: OrderChoices = {
  packageType: '',
  cakeBar: {
    barquette: 'Barquette standard Solly',
    base: 'Vanille',
    sauces: ['Chocolat'],
    composants: ['Oreo', 'Vermicelles'],
  },
  drinks: ['Bissap', 'Ananas'],
  charcuterie: {
    format: 'Le Cornet',
    composants: ['Rosettes de salami', 'Gouda doré', 'Olives marinées', 'Raisins frais'],
  },
  eventInspiration: 'Dinosaures, vert et beige',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [orderChoices, setOrderChoices] = useState<OrderChoices>(initialOrderChoices);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateCakeCustomization = (cake: CakeCustomization) => {
    setOrderChoices((prev) => ({ ...prev, cakeBar: cake }));
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
      setFormData((prev) => ({
        ...prev,
        experience: options,
        selectedBars:
          options === 'Cake Bar'
            ? Array.from(new Set([...prev.selectedBars, 'cake-bar']))
            : options === 'Boissons'
            ? Array.from(new Set([...prev.selectedBars, 'drinks']))
            : options === 'Charcuterie'
            ? Array.from(new Set([...prev.selectedBars, 'charcuterie']))
            : prev.selectedBars,
        isAdvised: options === 'Souhaite être conseillé' ? true : prev.isAdvised,
      }));
    } else if (options && typeof options === 'object') {
      setFormData((prev) => {
        const nextBars = [...prev.selectedBars];
        if (options.experience === 'Cake Bar' && !nextBars.includes('cake-bar')) nextBars.push('cake-bar');
        if (options.experience === 'Boissons' && !nextBars.includes('drinks')) nextBars.push('drinks');
        if (options.experience === 'Charcuterie' && !nextBars.includes('charcuterie')) nextBars.push('charcuterie');

        return {
          ...prev,
          experience: options.experience !== undefined ? options.experience : prev.experience,
          eventType: options.eventType !== undefined ? options.eventType : prev.eventType,
          themeColor: options.eventInspiration !== undefined ? options.eventInspiration : prev.themeColor,
          selectedBars: nextBars.length > 0 ? nextBars : prev.selectedBars,
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

  const submitBooking = async (data?: BookingFormData) => {
    if (data) {
      setFormData(data);
    }
    setIsSubmitted(true);
    setCurrentStep(4);
  };

  const resetBooking = () => {
    setFormData(initialFormData);
    setOrderChoices(initialOrderChoices);
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  const hasCustomChoices = Boolean(
    orderChoices.packageType ||
    (orderChoices.cakeBar && (orderChoices.cakeBar.barquette || orderChoices.cakeBar.base || orderChoices.cakeBar.composants.length > 0)) ||
    (orderChoices.drinks && orderChoices.drinks.length > 0) ||
    (orderChoices.charcuterie && (orderChoices.charcuterie.format || orderChoices.charcuterie.composants.length > 0)) ||
    orderChoices.eventInspiration
  );

  const getWhatsAppUrl = () => {
    const barsLabels: string[] = [];
    if (formData.selectedBars.includes('cake-bar')) barsLabels.push('Cake Bar');
    if (formData.selectedBars.includes('drinks')) barsLabels.push('Bar à boissons');
    if (formData.selectedBars.includes('charcuterie')) barsLabels.push('Bar à charcuterie');

    let text = `Bonjour Solly ! ✨ Je souhaite organiser un événement gourmand.\n\n` +
      `🎉 Type d'événement : ${formData.eventType || 'À préciser'}\n` +
      `📅 Date : ${formData.eventDate || 'À définir'} à ${formData.eventTime || '16:00'}\n` +
      `👥 Invités : ${formData.guestCount || 30} personnes\n` +
      `📍 Lieu : ${formData.address || 'Dakar'}\n\n` +
      `🍰 Bars sélectionnés : ${barsLabels.join(' + ') || 'À composer'}\n` +
      (formData.isAdvised ? `💡 Demande : Je souhaite être conseillé(e)\n` : '') +
      `🎨 Personnalisation : ${formData.personalization === 'oui' ? 'Oui' : formData.personalization === 'non' ? 'Non' : 'À définir'}\n` +
      (formData.themeColor ? `🎈 Thème / Couleurs : ${formData.themeColor}\n\n` : '\n') +
      `👤 Contact :\n` +
      `• Nom : ${formData.firstName || ''} ${formData.lastName || ''}\n` +
      `• Téléphone : ${formData.phone || ''}\n` +
      `• Email : ${formData.email || ''}\n`;

    if (orderChoices.cakeBar && formData.selectedBars.includes('cake-bar')) {
      text += `\n🍰 Détails Cake Bar :\n` +
        (orderChoices.cakeBar.barquette ? `  - Barquette : ${orderChoices.cakeBar.barquette}\n` : '') +
        `  - Base : ${orderChoices.cakeBar.base || 'Vanille'}\n` +
        `  - Sauces : ${orderChoices.cakeBar.sauces.join(', ') || 'Chocolat'}\n` +
        `  - Composants : ${orderChoices.cakeBar.composants.join(', ') || 'Oreo, Vermicelles'}\n`;
    }

    if (orderChoices.drinks && orderChoices.drinks.length > 0 && formData.selectedBars.includes('drinks')) {
      text += `\n🍹 Détails Boissons : ${orderChoices.drinks.join(', ')}\n`;
    }

    if (orderChoices.charcuterie && formData.selectedBars.includes('charcuterie')) {
      text += `\n🧀 Détails Charcuterie : Format ${orderChoices.charcuterie.format || 'Cornet'} (${orderChoices.charcuterie.composants.join(', ')})\n`;
    }

    if (formData.message) {
      text += `\n💬 Note / Précisions : ${formData.message}\n`;
    }

    text += `\nMerci et à très vite ! ♡`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
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
        updatePackageType,
        updateDrinksCustomization,
        updateCharcuterieCustomization,
        hasCustomChoices,
        isSubmitted,
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
