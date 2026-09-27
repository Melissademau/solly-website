/**
 * Configuration et logique tarifaire centralisée de Solly
 * Source unique de vérité pour tous les calculs d'estimation et de devis.
 */

export const PRICING_CONFIG = {
  BASE_PRICE_PER_GUEST: 4000,     // 4 000 FCFA / invité (comprend 1 bar principal)
  EXTRA_BAR_PER_GUEST: 1000,      // +1 000 FCFA / invité par bar supplémentaire standard
  EXTRA_CROFFLES_PER_GUEST: 1500, // +1 500 FCFA / invité pour l'option Croffles en bar supplémentaire
  DRINKS_PER_GUEST: 1000,         // +1 000 FCFA / invité pour l'option Boissons Solly
  CART_CUSTOMIZATION: 15000,      // +15 000 FCFA forfaitaire (façade avant amovible)
  CUSTOM_PACKAGING: 10000,        // +10 000 FCFA forfaitaire (couverts / contenants personnalisés)
  MIN_GUESTS: 20,                 // Minimum 20 invités
  DEPOSIT_RATE: 0.70,             // 70% d'acompte à la réservation
  BALANCE_RATE: 0.30,             // 30% de solde à J-2
} as const;

export interface BookingPricingParams {
  guestCount: number | '' | undefined;
  hasExtraBar?: boolean;
  extraBarType?: string;
  extraBars?: string[];
  extraBarsCount?: number;
  hasDrinks?: boolean;
  hasCartCustomization?: boolean;
  hasCustomPackaging?: boolean;
}

export interface BookingPricingResult {
  guestCount: number;
  effectiveGuests: number;
  basePrice: number;
  extraBarPrice: number;
  extraBarsCount: number;
  drinksPrice: number;
  cartCustomizationPrice: number;
  customPackagingPrice: number;
  total: number;
  deposit70: number;
  balance30: number;
}

/**
 * Calcule dynamiquement le prix total, l'acompte 70% et le solde 30%
 */
export function calculateBookingPrice(params: BookingPricingParams): BookingPricingResult {
  const rawCount =
    typeof params.guestCount === 'number' && !isNaN(params.guestCount) && params.guestCount > 0
      ? params.guestCount
      : PRICING_CONFIG.MIN_GUESTS;

  // Le minimum contractuel est de 20 invités
  const effectiveGuests = Math.max(PRICING_CONFIG.MIN_GUESTS, rawCount);

  let extraBarPrice = 0;
  let countOfExtraBars = 0;

  if (params.extraBars && params.extraBars.length > 0) {
    countOfExtraBars = params.extraBars.length;
    params.extraBars.forEach((bar) => {
      const pricePerGuest =
        bar === 'croffles'
          ? PRICING_CONFIG.EXTRA_CROFFLES_PER_GUEST
          : PRICING_CONFIG.EXTRA_BAR_PER_GUEST;
      extraBarPrice += effectiveGuests * pricePerGuest;
    });
  } else if (params.extraBarType) {
    countOfExtraBars = 1;
    const pricePerGuest =
      params.extraBarType === 'croffles'
        ? PRICING_CONFIG.EXTRA_CROFFLES_PER_GUEST
        : PRICING_CONFIG.EXTRA_BAR_PER_GUEST;
    extraBarPrice = effectiveGuests * pricePerGuest;
  } else {
    countOfExtraBars =
      typeof params.extraBarsCount === 'number'
        ? params.extraBarsCount
        : params.hasExtraBar
        ? 1
        : 0;
    extraBarPrice = effectiveGuests * PRICING_CONFIG.EXTRA_BAR_PER_GUEST * countOfExtraBars;
  }

  const basePrice = effectiveGuests * PRICING_CONFIG.BASE_PRICE_PER_GUEST;
  const drinksPrice = params.hasDrinks ? effectiveGuests * PRICING_CONFIG.DRINKS_PER_GUEST : 0;
  const cartCustomizationPrice = params.hasCartCustomization ? PRICING_CONFIG.CART_CUSTOMIZATION : 0;
  const customPackagingPrice = params.hasCustomPackaging ? PRICING_CONFIG.CUSTOM_PACKAGING : 0;

  const total = basePrice + extraBarPrice + drinksPrice + cartCustomizationPrice + customPackagingPrice;
  const deposit70 = Math.round(total * PRICING_CONFIG.DEPOSIT_RATE);
  const balance30 = total - deposit70;

  return {
    guestCount: rawCount,
    effectiveGuests,
    basePrice,
    extraBarPrice,
    extraBarsCount: countOfExtraBars,
    drinksPrice,
    cartCustomizationPrice,
    customPackagingPrice,
    total,
    deposit70,
    balance30,
  };
}

/**
 * Formate un montant en FCFA avec séparateur de milliers
 */
export function formatPriceFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount).replace(/\u202F/g, ' ') + ' FCFA';
}
