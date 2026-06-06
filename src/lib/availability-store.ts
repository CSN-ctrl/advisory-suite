import { getSupabaseBrowserClient } from "@/integrations/supabase/client";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  date: string;
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

export interface NewBookingInput {
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlot: TimeSlot;
  paymentType: "deposit" | "full";
  amountPaid: number;
}

type SlotRow = {
  availability_date: string;
  slot_id: string;
  start_time: string;
  end_time: string;
};

function groupSlots(rows: SlotRow[]): DayAvailability[] {
  const map = new Map<string, TimeSlot[]>();
  for (const r of rows) {
    const d = r.availability_date;
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push({ id: r.slot_id, startTime: r.start_time, endTime: r.end_time });
  }
  return [...map.entries()]
    .map(([date, slots]) => ({ date, slots }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mapBookingRow(row: {
  id: string;
  service_id: string;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  booking_date: string;
  slot_id: string;
  start_time: string;
  end_time: string;
  payment_type: string;
  amount_paid: number;
  status: string;
  created_at: string;
}): Booking {
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    date: row.booking_date,
    timeSlot: { id: row.slot_id, startTime: row.start_time, endTime: row.end_time },
    paymentType: row.payment_type as Booking["paymentType"],
    amountPaid: Number(row.amount_paid),
    status: row.status as Booking["status"],
    createdAt: row.created_at,
  };
}

export async function getAvailability(): Promise<DayAvailability[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("availability_slots")
    .select("availability_date, slot_id, start_time, end_time")
    .order("availability_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return groupSlots((data ?? []) as SlotRow[]);
}

export async function getAvailabilityForDate(date: string): Promise<TimeSlot[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("availability_slots")
    .select("slot_id, start_time, end_time")
    .eq("availability_date", date)
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: (r as { slot_id: string }).slot_id,
    startTime: (r as { start_time: string }).start_time,
    endTime: (r as { end_time: string }).end_time,
  }));
}

export async function addSlotToDate(date: string, slot: TimeSlot): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("availability_slots").insert({
    availability_date: date,
    slot_id: slot.id,
    start_time: slot.startTime,
    end_time: slot.endTime,
  });
  if (error) throw new Error(error.message);
}

export async function removeSlotFromDate(date: string, slotId: string): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("availability_slots").delete().eq("availability_date", date).eq("slot_id", slotId);
  if (error) throw new Error(error.message);
}

export async function getAvailableDates(): Promise<string[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.rpc("get_available_booking_dates");
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { available_date: string }[];
  return rows.map((r) => r.available_date).sort();
}

export async function getAvailableSlotsForDate(date: string): Promise<TimeSlot[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.rpc("get_available_slots_for_booking", { p_date: date });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { slot_id: string; start_time: string; end_time: string }[];
  return rows.map((r) => ({
    id: r.slot_id,
    startTime: r.start_time,
    endTime: r.end_time,
  }));
}

export async function getBookings(): Promise<Booking[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("bookings")
    .select(
      "id, service_id, service_name, client_name, client_email, client_phone, booking_date, slot_id, start_time, end_time, payment_type, amount_paid, status, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapBookingRow(row as Parameters<typeof mapBookingRow>[0]));
}

export async function addBooking(booking: NewBookingInput): Promise<{ booking: Booking; emailStatus: string }> {
  const sb = getSupabaseBrowserClient();
  const id = crypto.randomUUID();
  const row = {
    id,
    service_id: booking.serviceId,
    service_name: booking.serviceName,
    client_name: booking.clientName,
    client_email: booking.clientEmail,
    client_phone: booking.clientPhone,
    booking_date: booking.date,
    slot_id: booking.timeSlot.id,
    start_time: booking.timeSlot.startTime,
    end_time: booking.timeSlot.endTime,
    payment_type: booking.paymentType,
    amount_paid: booking.amountPaid,
    status: "confirmed" as const,
  };
  const { data, error } = await sb.from("bookings").insert(row).select().single();
  if (error) throw new Error(error.message);
  const mapped = mapBookingRow(data as Parameters<typeof mapBookingRow>[0]);

  let emailStatus = "off";
  try {
    const response = await fetch("/api/bookings/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking: {
          serviceName: booking.serviceName,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          date: booking.date,
          timeSlot: booking.timeSlot,
          paymentType: booking.paymentType,
          amountPaid: booking.amountPaid,
        },
      }),
    });
    if (response.ok) {
      const payload = (await response.json()) as { sent?: boolean; reason?: string };
      emailStatus = payload.sent ? "sent" : payload.reason ?? "failed";
    } else {
      emailStatus = "failed";
    }
  } catch {
    emailStatus = "failed";
  }

  return { booking: mapped, emailStatus };
}
