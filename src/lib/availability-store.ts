// localStorage-based availability management

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
}

export interface DayAvailability {
  date: string; // "YYYY-MM-DD"
  slots: TimeSlot[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlot: TimeSlot;
  paymentType: "deposit" | "full";
  amountPaid: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

const AVAILABILITY_KEY = "advisory_availability";
const BOOKINGS_KEY = "advisory_bookings";
const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function getStorage(): StorageLike | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isValidTimeSlot(slot: unknown): slot is TimeSlot {
  if (!slot || typeof slot !== "object") return false;
  const candidate = slot as TimeSlot;
  return (
    typeof candidate.id === "string" &&
    TIME_24H_REGEX.test(candidate.startTime) &&
    TIME_24H_REGEX.test(candidate.endTime) &&
    candidate.startTime < candidate.endTime
  );
}

function isValidDayAvailability(entry: unknown): entry is DayAvailability {
  if (!entry || typeof entry !== "object") return false;
  const candidate = entry as DayAvailability;
  return (
    typeof candidate.date === "string" &&
    DATE_REGEX.test(candidate.date) &&
    Array.isArray(candidate.slots) &&
    candidate.slots.every(isValidTimeSlot)
  );
}

function isValidBooking(entry: unknown): entry is Booking {
  if (!entry || typeof entry !== "object") return false;
  const candidate = entry as Booking;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.serviceId === "string" &&
    typeof candidate.serviceName === "string" &&
    typeof candidate.clientName === "string" &&
    typeof candidate.clientEmail === "string" &&
    typeof candidate.clientPhone === "string" &&
    typeof candidate.date === "string" &&
    DATE_REGEX.test(candidate.date) &&
    isValidTimeSlot(candidate.timeSlot) &&
    (candidate.paymentType === "deposit" || candidate.paymentType === "full") &&
    Number.isFinite(candidate.amountPaid) &&
    ["confirmed", "pending", "cancelled"].includes(candidate.status) &&
    typeof candidate.createdAt === "string"
  );
}

export function getAvailability(): DayAvailability[] {
  const storage = getStorage();
  const parsed = safeParseJson<unknown[]>(storage?.getItem(AVAILABILITY_KEY) ?? null, []);
  return parsed.filter(isValidDayAvailability);
}

export function setAvailability(availability: DayAvailability[]) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AVAILABILITY_KEY, JSON.stringify(availability.filter(isValidDayAvailability)));
}

export function getAvailabilityForDate(date: string): TimeSlot[] {
  const all = getAvailability();
  const day = all.find((d) => d.date === date);
  return day?.slots || [];
}

export function addSlotToDate(date: string, slot: TimeSlot) {
  if (!DATE_REGEX.test(date) || !isValidTimeSlot(slot)) return;

  const all = getAvailability();
  const dayIndex = all.findIndex((d) => d.date === date);
  if (dayIndex >= 0) {
    all[dayIndex].slots.push(slot);
  } else {
    all.push({ date, slots: [slot] });
  }
  setAvailability(all);
}

export function removeSlotFromDate(date: string, slotId: string) {
  const all = getAvailability();
  const dayIndex = all.findIndex((d) => d.date === date);
  if (dayIndex >= 0) {
    all[dayIndex].slots = all[dayIndex].slots.filter((s) => s.id !== slotId);
    if (all[dayIndex].slots.length === 0) {
      all.splice(dayIndex, 1);
    }
    setAvailability(all);
  }
}

export function getAvailableDates(): string[] {
  const all = getAvailability();
  const bookings = getBookings();
  return all
    .filter((d) => {
      // A date is available if it has at least one unbooked slot
      const bookedSlotIds = bookings
        .filter((b) => b.date === d.date && b.status !== "cancelled")
        .map((b) => b.timeSlot.id);
      return d.slots.some((s) => !bookedSlotIds.includes(s.id));
    })
    .map((d) => d.date);
}

export function getAvailableSlotsForDate(date: string): TimeSlot[] {
  const slots = getAvailabilityForDate(date);
  const bookings = getBookings();
  const bookedSlotIds = bookings
    .filter((b) => b.date === date && b.status !== "cancelled")
    .map((b) => b.timeSlot.id);
  return slots.filter((s) => !bookedSlotIds.includes(s.id));
}

export function getBookings(): Booking[] {
  const storage = getStorage();
  const parsed = safeParseJson<unknown[]>(storage?.getItem(BOOKINGS_KEY) ?? null, []);
  return parsed.filter(isValidBooking);
}

export function addBooking(booking: Booking) {
  if (!isValidBooking(booking)) return;

  const all = getBookings();
  all.push(booking);
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(BOOKINGS_KEY, JSON.stringify(all));
}

