import fs from 'fs';
import path from 'path';

export type BookingStatus =
  | 'PENDING'          // Demande reçue
  | 'APPROVED'         // Demande validée / disponible
  | 'AWAITING_DEPOSIT' // En attente de l’acompte (70%)
  | 'CONFIRMED'        // Réservation confirmée
  | 'CANCELLED'        // Annulée
  | 'COMPLETED';       // Prestation réalisée

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Demande reçue',
  APPROVED: 'Demande validée / disponible',
  AWAITING_DEPOSIT: 'En attente de l’acompte (70%)',
  CONFIRMED: 'Réservation confirmée',
  CANCELLED: 'Annulée',
  COMPLETED: 'Prestation réalisée',
};

export interface StoredBooking {
  id: string; // e.g. 'SOL-260923-001'
  createdAt: string; // ISO string
  status: BookingStatus;
  statusLabel: string;
  client: {
    name: string;
    phone: string;
    countryCode?: string;
    email?: string;
  };
  event: {
    type: string;
    date: string;
    time: string;
    location: string;
    guestCount: number;
    effectiveGuests: number;
    message?: string;
  };
  configuration: {
    mainBar: string;
    hasExtraBar: boolean;
    extraBarType?: string;
    hasDrinks: boolean;
    hasCartCustomization: boolean;
    hasCustomPackaging: boolean;
    orderChoices?: any;
    inspirationPhotosCount?: number;
  };
  pricing: {
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
  };
}

// Global in-memory cache to ensure speed and persistence across invocations within process
const memoryBookings: Map<string, StoredBooking> = new Map();
let counter = 1;

/**
 * Generate a clean human-readable reference, e.g. SOL-260923-001
 * Uses format SOL-YYMMDD-XXX
 */
export function generateBookingReference(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  // Unique sequential or random seed within day
  const seq = String(counter++).padStart(3, '0');
  return `SOL-${dateStr}-${seq}`;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

/**
 * Save booking to memory and persist to local JSON file when running in Node environment
 */
export async function saveBooking(booking: StoredBooking): Promise<StoredBooking> {
  memoryBookings.set(booking.id, booking);

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existing: Record<string, StoredBooking> = {};
    if (fs.existsSync(BOOKINGS_FILE)) {
      try {
        const content = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
        existing = JSON.parse(content || '{}');
      } catch (err) {
        console.warn('[saveBooking] Could not read existing bookings file, initializing new.');
      }
    }

    existing[booking.id] = booking;
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[saveBooking] Persistence to disk skipped/failed (memory cache preserved):', err?.message);
  }

  return booking;
}

/**
 * Get booking by ID
 */
export async function getBooking(id: string): Promise<StoredBooking | null> {
  if (memoryBookings.has(id)) {
    return memoryBookings.get(id)!;
  }

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const content = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const existing: Record<string, StoredBooking> = JSON.parse(content || '{}');
      if (existing[id]) {
        memoryBookings.set(id, existing[id]);
        return existing[id];
      }
    }
  } catch (err) {
    console.warn('[getBooking] Error reading bookings:', err);
  }

  return null;
}

/**
 * List all bookings
 */
export async function listBookings(): Promise<StoredBooking[]> {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const content = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const existing: Record<string, StoredBooking> = JSON.parse(content || '{}');
      return Object.values(existing).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  } catch (err) {
    console.warn('[listBookings] Error reading bookings:', err);
  }

  return Array.from(memoryBookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
