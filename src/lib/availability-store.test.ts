import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addBooking,
  addSlotToDate,
  getAvailableDates,
  getAvailableSlotsForDate,
  getBookings,
  getAvailability,
  removeSlotFromDate,
  type Booking,
  type DayAvailability,
  type NewBookingInput,
  type TimeSlot,
} from "@/lib/availability-store";

const slot: TimeSlot = {
  id: "slot-1",
  startTime: "09:00",
  endTime: "10:00",
};

const bookingInput: NewBookingInput = {
  serviceId: "service-1",
  serviceName: "Service",
  clientName: "Client",
  clientEmail: "client@example.com",
  clientPhone: "+359888000111",
  date: "2026-05-01",
  timeSlot: slot,
  paymentType: "full",
  amountPaid: 200,
};

const confirmedBooking: Booking = {
  id: "booking-1",
  ...bookingInput,
  status: "confirmed",
  createdAt: new Date().toISOString(),
};

describe("availability-store api client", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("loads public availability dates and slots", async () => {
    const payload: DayAvailability[] = [{ date: "2026-05-01", slots: [slot] }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => payload,
    });

    await expect(getAvailableDates()).resolves.toEqual(["2026-05-01"]);
    await expect(getAvailableSlotsForDate("2026-05-01")).resolves.toEqual([slot]);
  });

  it("creates booking through API", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ booking: confirmedBooking, emailStatus: "sent" }),
    });

    await expect(addBooking(bookingInput)).resolves.toEqual({ booking: confirmedBooking, emailStatus: "sent" });
  });

  it("calls admin endpoints with credentials", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getAvailability();
    await getBookings();
    await addSlotToDate("2026-05-01", slot);
    await removeSlotFromDate("2026-05-01", "slot-1");

    expect(fetchMock).toHaveBeenCalled();
  });
});
