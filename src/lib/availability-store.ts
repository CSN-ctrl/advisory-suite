// localStorage-based availability management

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
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
const ADMIN_PASSWORD = "admin123"; // Simple password for now

export function getAvailability(): DayAvailability[] {
  const data = localStorage.getItem(AVAILABILITY_KEY);
  return data ? JSON.parse(data) : [];
}

export function setAvailability(availability: DayAvailability[]) {
  localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(availability));
}

export function getAvailabilityForDate(date: string): TimeSlot[] {
  const all = getAvailability();
  const day = all.find((d) => d.date === date);
  return day?.slots || [];
}

export function addSlotToDate(date: string, slot: TimeSlot) {
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
  const data = localStorage.getItem(BOOKINGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addBooking(booking: Booking) {
  const all = getBookings();
  all.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
