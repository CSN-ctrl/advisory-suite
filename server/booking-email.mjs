import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBookingConfirmationEmails(booking) {
  const transporter = createTransporter();
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL || process.env.SMTP_USER;

  if (!transporter || !adminEmail || !fromEmail) {
    return { sent: false, reason: "smtp_not_configured" };
  }

  const sessionDateTime = `${booking.date} ${booking.timeSlot.startTime}-${booking.timeSlot.endTime}`;
  const paymentLabel =
    booking.paymentType === "deposit" ? `Deposit payment (€${booking.amountPaid})` : `Full payment (€${booking.amountPaid})`;

  const clientSubject = `Booking confirmed: ${booking.serviceName}`;
  const clientText = [
    `Hello ${booking.clientName},`,
    "",
    "Your booking is confirmed.",
    `Service: ${booking.serviceName}`,
    `Date/Time: ${sessionDateTime}`,
    `Payment: ${paymentLabel}`,
    "",
    "Thank you.",
  ].join("\n");

  const adminSubject = `New booking: ${booking.serviceName}`;
  const adminText = [
    "A new booking was confirmed.",
    `Client: ${booking.clientName}`,
    `Email: ${booking.clientEmail}`,
    `Phone: ${booking.clientPhone}`,
    `Service: ${booking.serviceName}`,
    `Date/Time: ${sessionDateTime}`,
    `Payment: ${paymentLabel}`,
  ].join("\n");

  await Promise.all([
    transporter.sendMail({
      from: fromEmail,
      to: booking.clientEmail,
      subject: clientSubject,
      text: clientText,
    }),
    transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
    }),
  ]);

  return { sent: true };
}
