/**
 * Configuration et logique tarifaire centralisée de Solly
 * Source unique de vérité pour tous les calculs d'estimation et de devis.
 */

export const PRICING_CONFIG = {
  BASE_PRICE_PER_GUEST: 4000,     // 4 000 FCFA / invité (comprend 1 bar principal)
  EXTRA_BAR_PER_GUEST: 1000,      // +1 000 FCFA / invité par bar supplémentaire
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
  hasDrinks?: boolean;
  hasCartCustomization?: boolean;
  hasCustomPackaging?: boolean;
}

export interface BookingPricingResult {
  guestCount: number;
  effectiveGuests: number;
  basePrice: number;
  extraBarPrice: number;
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

  const basePrice = effectiveGuests * PRICING_CONFIG.BASE_PRICE_PER_GUEST;
  const extraBarPrice = params.hasExtraBar ? effectiveGuests * PRICING_CONFIG.EXTRA_BAR_PER_GUEST : 0;
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
