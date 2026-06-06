import { sendBookingConfirmationEmails } from "../_lib/booking-email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const booking = body?.booking;

    if (!booking?.clientEmail || !booking?.serviceName || !booking?.date || !booking?.timeSlot) {
      res.status(400).json({ error: "Invalid booking payload" });
      return;
    }

    const result = await sendBookingConfirmationEmails(booking);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Email failed" });
  }
}
