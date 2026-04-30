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

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return (await response.json()) as T;
}

export async function getAvailability(): Promise<DayAvailability[]> {
  const response = await fetch("/api/admin/availability", {
    credentials: "include",
  });
  return parseResponse<DayAvailability[]>(response);
}

export async function getAvailabilityForDate(date: string): Promise<TimeSlot[]> {
  const all = await getAvailability();
  return all.find((day) => day.date === date)?.slots ?? [];
}

export async function addSlotToDate(date: string, slot: TimeSlot): Promise<void> {
  const response = await fetch(`/api/admin/availability/${encodeURIComponent(date)}/slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(slot),
  });
  await parseResponse(response);
}

export async function removeSlotFromDate(date: string, slotId: string): Promise<void> {
  const response = await fetch(
    `/api/admin/availability/${encodeURIComponent(date)}/slots/${encodeURIComponent(slotId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  await parseResponse(response);
}

export async function getAvailableDates(): Promise<string[]> {
  const response = await fetch("/api/availability");
  const data = await parseResponse<DayAvailability[]>(response);
  return data.map((day) => day.date);
}

export async function getAvailableSlotsForDate(date: string): Promise<TimeSlot[]> {
  const response = await fetch("/api/availability");
  const data = await parseResponse<DayAvailability[]>(response);
  return data.find((day) => day.date === date)?.slots ?? [];
}

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch("/api/admin/bookings", {
    credentials: "include",
  });
  return parseResponse<Booking[]>(response);
}

export async function addBooking(booking: NewBookingInput): Promise<{ booking: Booking; emailStatus: string }> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  return parseResponse<{ booking: Booking; emailStatus: string }>(response);
}
