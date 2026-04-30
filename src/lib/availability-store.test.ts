import { beforeEach, describe, expect, it } from "vitest";
import {
  addBooking,
  addSlotToDate,
  getAvailability,
  getAvailableDates,
  getAvailableSlotsForDate,
  getBookings,
  removeSlotFromDate,
  setAvailability,
  type Booking,
  type TimeSlot,
} from "@/lib/availability-store";

const AVAILABILITY_KEY = "advisory_availability";
const BOOKINGS_KEY = "advisory_bookings";

const slot: TimeSlot = {
  id: "slot-1",
  startTime: "09:00",
  endTime: "10:00",
};

const booking: Booking = {
  id: "booking-1",
  serviceId: "service-1",
  serviceName: "Service",
  clientName: "Client",
  clientEmail: "client@example.com",
  clientPhone: "+359888000111",
  date: "2026-05-01",
  timeSlot: slot,
  paymentType: "full",
  amountPaid: 200,
  status: "confirmed",
  createdAt: new Date().toISOString(),
};

describe("availability-store hardening", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists slot and booking data", () => {
    addSlotToDate("2026-05-01", slot);
    addBooking(booking);

    expect(getAvailability()).toEqual([{ date: "2026-05-01", slots: [slot] }]);
    expect(getBookings()).toHaveLength(1);
    expect(getAvailableSlotsForDate("2026-05-01")).toEqual([]);
    expect(getAvailableDates()).toEqual([]);
  });

  it("handles localStorage corruption safely with empty fallbacks", () => {
    localStorage.setItem(AVAILABILITY_KEY, "{not json");
    localStorage.setItem(BOOKINGS_KEY, "{also not json");

    expect(getAvailability()).toEqual([]);
    expect(getBookings()).toEqual([]);
  });

  it("filters invalid stored entries and ignores malformed writes", () => {
    localStorage.setItem(
      AVAILABILITY_KEY,
      JSON.stringify([
        { date: "bad-date", slots: [slot] },
        { date: "2026-05-01", slots: [{ ...slot, startTime: "25:00" }] },
      ]),
    );
    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify([
        { ...booking, amountPaid: Number.NaN },
        { ...booking, paymentType: "other" },
      ]),
    );

    expect(getAvailability()).toEqual([]);
    expect(getBookings()).toEqual([]);

    addSlotToDate("invalid-date", slot);
    addSlotToDate("2026-05-01", { ...slot, startTime: "11:00", endTime: "10:00" });
    addBooking({ ...booking, amountPaid: Number.NaN });

    expect(getAvailability()).toEqual([]);
    expect(getBookings()).toEqual([]);
  });

  it("removes empty dates after slot deletion", () => {
    setAvailability([{ date: "2026-05-01", slots: [slot] }]);
    removeSlotFromDate("2026-05-01", "slot-1");
    expect(getAvailability()).toEqual([]);
  });
});
