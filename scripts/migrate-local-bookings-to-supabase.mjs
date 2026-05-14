/**
 * One-off: copy server/data/bookings.json into Supabase (availability_slots + bookings).
 * Run from repo root: node scripts/migrate-local-bookings-to-supabase.mjs
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env"), override: false });

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const dataPath = resolve(__dirname, "..", "server", "data", "bookings.json");
const raw = await readFile(dataPath, "utf-8").catch(() => null);
if (!raw) {
  console.error("Missing server/data/bookings.json — nothing to migrate.");
  process.exit(0);
}

const store = JSON.parse(raw);
const availability = Array.isArray(store.availability) ? store.availability : [];
const bookings = Array.isArray(store.bookings) ? store.bookings : [];

for (const day of availability) {
  if (!day?.date || !Array.isArray(day.slots)) continue;
  for (const slot of day.slots) {
    if (!slot?.id) continue;
    const { error } = await supabase.from("availability_slots").upsert(
      {
        availability_date: day.date,
        slot_id: slot.id,
        start_time: slot.startTime ?? "09:00",
        end_time: slot.endTime ?? "10:00",
      },
      { onConflict: "availability_date,slot_id" },
    );
    if (error) {
      console.error("availability_slots upsert failed:", day.date, slot.id, error.message);
      process.exit(1);
    }
  }
}

for (const b of bookings) {
  if (!b?.id || !b?.date || !b?.timeSlot?.id) continue;
  const row = {
    id: b.id,
    service_id: b.serviceId,
    service_name: b.serviceName,
    client_name: b.clientName,
    client_email: b.clientEmail,
    client_phone: b.clientPhone,
    booking_date: b.date,
    slot_id: b.timeSlot.id,
    start_time: b.timeSlot.startTime,
    end_time: b.timeSlot.endTime,
    payment_type: b.paymentType,
    amount_paid: b.amountPaid,
    status: b.status ?? "confirmed",
    created_at: b.createdAt ?? new Date().toISOString(),
  };
  const { error } = await supabase.from("bookings").upsert(row, { onConflict: "id" });
  if (error) {
    console.error("bookings upsert failed:", b.id, error.message);
    process.exit(1);
  }
}

console.log(`Migrated ${availability.length} day rows (slots) and ${bookings.length} bookings.`);
