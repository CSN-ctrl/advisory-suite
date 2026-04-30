import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingFilePath = path.join(__dirname, "data", "bookings.json");

function createEmptyStore() {
  return {
    availability: [],
    bookings: [],
  };
}

async function ensureStore() {
  try {
    await fs.access(bookingFilePath);
  } catch {
    await fs.mkdir(path.dirname(bookingFilePath), { recursive: true });
    await fs.writeFile(bookingFilePath, JSON.stringify(createEmptyStore(), null, 2), "utf-8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(bookingFilePath, "utf-8");
  const parsed = JSON.parse(raw);
  return {
    availability: Array.isArray(parsed.availability) ? parsed.availability : [],
    bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
  };
}

async function writeStore(store) {
  await fs.writeFile(bookingFilePath, JSON.stringify(store, null, 2), "utf-8");
}

export async function getAvailability() {
  const store = await readStore();
  return store.availability;
}

export async function getBookings() {
  const store = await readStore();
  return store.bookings;
}

export async function addAvailabilitySlot(date, slot) {
  const store = await readStore();
  const dateBucket = store.availability.find((entry) => entry.date === date);
  if (!dateBucket) {
    store.availability.push({ date, slots: [slot] });
  } else {
    dateBucket.slots = [...dateBucket.slots, slot];
  }
  await writeStore(store);
  return store.availability;
}

export async function removeAvailabilitySlot(date, slotId) {
  const store = await readStore();
  const dateBucket = store.availability.find((entry) => entry.date === date);
  if (!dateBucket) {
    return store.availability;
  }

  dateBucket.slots = dateBucket.slots.filter((slot) => slot.id !== slotId);
  store.availability = store.availability.filter((entry) => !(entry.date === date && entry.slots.length === 0));
  await writeStore(store);
  return store.availability;
}

export async function addBooking(booking) {
  const store = await readStore();
  store.bookings.push(booking);
  await writeStore(store);
  return booking;
}

export function getAvailableSlotsForDate(date, availability, bookings) {
  const day = availability.find((entry) => entry.date === date);
  const slots = day?.slots ?? [];
  const busySlotIds = bookings
    .filter((booking) => booking.date === date && booking.status !== "cancelled")
    .map((booking) => booking.timeSlot.id);
  return slots.filter((slot) => !busySlotIds.includes(slot.id));
}
