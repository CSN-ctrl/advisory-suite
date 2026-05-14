import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addBooking,
  getAvailableDates,
  getAvailableSlotsForDate,
  getAvailability,
  type NewBookingInput,
  type TimeSlot,
} from "@/lib/availability-store";

const rpcMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({
    from: (...args: unknown[]) => fromMock(...args),
    rpc: (...args: unknown[]) => rpcMock(...args),
  }),
}));

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

describe("availability-store (Supabase client)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    rpcMock.mockReset();
    fromMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads public booking dates via RPC", async () => {
    rpcMock.mockResolvedValue({
      data: [{ available_date: "2026-05-01" }],
      error: null,
    });

    await expect(getAvailableDates()).resolves.toEqual(["2026-05-01"]);
    expect(rpcMock).toHaveBeenCalledWith("get_available_booking_dates");
  });

  it("loads public slots for a date via RPC", async () => {
    rpcMock.mockResolvedValue({
      data: [{ slot_id: "slot-1", start_time: "09:00", end_time: "10:00" }],
      error: null,
    });

    await expect(getAvailableSlotsForDate("2026-05-01")).resolves.toEqual([slot]);
    expect(rpcMock).toHaveBeenCalledWith("get_available_slots_for_booking", { p_date: "2026-05-01" });
  });

  it("loads admin availability grouped by date", async () => {
    const data = [
      {
        availability_date: "2026-05-01",
        slot_id: "slot-1",
        start_time: "09:00",
        end_time: "10:00",
      },
    ];
    fromMock.mockImplementation(() => {
      const out: Record<string, unknown> = {};
      out.select = () => out;
      out.order = () => out;
      out.then = (onF: unknown, onR: unknown) =>
        Promise.resolve({ data, error: null }).then(onF as (v: unknown) => unknown, onR as (e: unknown) => unknown);
      return out;
    });

    const rows = await getAvailability();
    expect(rows).toEqual([{ date: "2026-05-01", slots: [slot] }]);
    expect(fromMock).toHaveBeenCalledWith("availability_slots");
  });

  it("inserts booking without calling email notify", async () => {
    const row = {
      id: "booking-uuid-1",
      service_id: bookingInput.serviceId,
      service_name: bookingInput.serviceName,
      client_name: bookingInput.clientName,
      client_email: bookingInput.clientEmail,
      client_phone: bookingInput.clientPhone,
      booking_date: bookingInput.date,
      slot_id: bookingInput.timeSlot.id,
      start_time: bookingInput.timeSlot.startTime,
      end_time: bookingInput.timeSlot.endTime,
      payment_type: bookingInput.paymentType,
      amount_paid: bookingInput.amountPaid,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    fromMock.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: row, error: null }),
        }),
      }),
    });

    const result = await addBooking(bookingInput);
    expect(result.booking.id).toBe("booking-uuid-1");
    expect(result.emailStatus).toBe("off");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
