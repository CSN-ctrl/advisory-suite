import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { readAllContent, upsertContentValue } from "./content-store.mjs";
import { sendBookingConfirmationEmails } from "./booking-email.mjs";
import {
  addAvailabilitySlot,
  addBooking,
  getAvailability,
  getAvailableSlotsForDate,
  getBookings,
  removeAvailabilitySlot,
} from "./booking-store.mjs";
import {
  getAdminSessionPayload,
  getCookieOptions,
  getSessionSecret,
  verifyAdminCredentials,
} from "./auth-config.js";
import { requireAdmin } from "./admin-auth-middleware.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(
  session({
    name: "admin.sid",
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: getCookieOptions(),
  }),
);

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, try again later." },
});

const loginSchema = z.object({
  username: z.string().trim().min(1).max(128),
  password: z.string().min(8).max(256),
});

const contentPathParamsSchema = z.object({
  page: z.string().min(1).max(128),
  section: z.string().min(1).max(128),
  key: z.string().min(1).max(128),
});

const updateContentBodySchema = z.object({
  value: z.string().trim().min(1).max(20000),
  updatedBy: z.string().trim().min(1).max(128).optional(),
  locale: z.enum(["en", "bg"]).optional(),
});

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slotSchema = z.object({
  id: z.string().trim().min(1).max(128),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});
const bookingSchema = z.object({
  serviceId: z.string().trim().min(1).max(128),
  serviceName: z.string().trim().min(1).max(200),
  clientName: z.string().trim().min(1).max(120),
  clientEmail: z.string().trim().email().max(255),
  clientPhone: z.string().trim().min(5).max(30),
  date: dateStringSchema,
  timeSlot: slotSchema,
  paymentType: z.enum(["deposit", "full"]),
  amountPaid: z.number().nonnegative(),
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/availability", async (_req, res) => {
  try {
    const availability = await getAvailability();
    const bookings = await getBookings();
    const withOpenSlots = availability
      .map((entry) => ({
        date: entry.date,
        slots: getAvailableSlotsForDate(entry.date, availability, bookings),
      }))
      .filter((entry) => entry.slots.length > 0);
    return res.status(200).json(withOpenSlots);
  } catch {
    return res.status(500).json({ error: "Failed to load availability." });
  }
});

app.post("/api/admin/login", loginRateLimiter, async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid credentials payload" });
  }

  const valid = await verifyAdminCredentials({
    username: parseResult.data.username,
    password: parseResult.data.password,
  });
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  return req.session.regenerate((error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to initialize session" });
    }

    req.session.admin = getAdminSessionPayload();
    return res.status(200).json({
      authenticated: true,
      admin: req.session.admin,
    });
  });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to end session" });
    }

    res.clearCookie("admin.sid", getCookieOptions());
    return res.status(200).json({ authenticated: false });
  });
});

app.get("/api/admin/me", (req, res) => {
  if (!req.session?.admin) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    admin: req.session.admin,
  });
});

app.get("/api/admin/protected", requireAdmin, (req, res) => {
  return res.status(200).json({ ok: true });
});

app.get("/api/admin/availability", requireAdmin, async (_req, res) => {
  try {
    const availability = await getAvailability();
    return res.status(200).json(availability);
  } catch {
    return res.status(500).json({ error: "Failed to load admin availability." });
  }
});

app.post("/api/admin/availability/:date/slots", requireAdmin, async (req, res) => {
  const parsedDate = dateStringSchema.safeParse(req.params.date);
  const parsedSlot = slotSchema.safeParse(req.body);
  if (!parsedDate.success || !parsedSlot.success) {
    return res.status(400).json({ error: "Invalid date or time slot payload." });
  }

  if (parsedSlot.data.startTime >= parsedSlot.data.endTime) {
    return res.status(400).json({ error: "Slot end time must be after start time." });
  }

  try {
    const nextAvailability = await addAvailabilitySlot(parsedDate.data, parsedSlot.data);
    return res.status(200).json(nextAvailability);
  } catch {
    return res.status(500).json({ error: "Failed to add availability slot." });
  }
});

app.delete("/api/admin/availability/:date/slots/:slotId", requireAdmin, async (req, res) => {
  const parsedDate = dateStringSchema.safeParse(req.params.date);
  if (!parsedDate.success || !req.params.slotId) {
    return res.status(400).json({ error: "Invalid date or slot identifier." });
  }

  try {
    const nextAvailability = await removeAvailabilitySlot(parsedDate.data, req.params.slotId);
    return res.status(200).json(nextAvailability);
  } catch {
    return res.status(500).json({ error: "Failed to remove availability slot." });
  }
});

app.get("/api/admin/bookings", requireAdmin, async (_req, res) => {
  try {
    const bookings = await getBookings();
    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to load bookings." });
  }
});

app.post("/api/bookings", async (req, res) => {
  const payload = bookingSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ error: "Invalid booking payload." });
  }

  try {
    const availability = await getAvailability();
    const bookings = await getBookings();
    const openSlots = getAvailableSlotsForDate(payload.data.date, availability, bookings);
    const hasRequestedSlot = openSlots.some((slot) => slot.id === payload.data.timeSlot.id);

    if (!hasRequestedSlot) {
      return res.status(409).json({ error: "Selected slot is no longer available." });
    }

    const booking = {
      id: randomUUID(),
      ...payload.data,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    await addBooking(booking);
    let emailStatus = "not_sent";
    try {
      const emailResult = await sendBookingConfirmationEmails(booking);
      emailStatus = emailResult.sent ? "sent" : "not_configured";
    } catch {
      emailStatus = "failed";
    }

    return res.status(201).json({
      booking,
      emailStatus,
    });
  } catch {
    return res.status(500).json({ error: "Failed to create booking." });
  }
});

app.get("/api/content", async (req, res) => {
  try {
    const page = typeof req.query.page === "string" ? req.query.page : "";
    const locale = req.query.locale === "bg" ? "bg" : "en";
    const content = await readAllContent();
    const localizedContent =
      content?.locales && typeof content.locales === "object"
        ? (content.locales[locale] ?? {})
        : content;

    if (page) {
      return res.status(200).json(localizedContent[page] ?? {});
    }

    return res.status(200).json(localizedContent);
  } catch {
    return res.status(500).json({ error: "Failed to read content store." });
  }
});

app.put("/api/admin/content/:page/:section/:key", requireAdmin, async (req, res) => {
  const pathParams = contentPathParamsSchema.safeParse(req.params);
  if (!pathParams.success) {
    return res.status(400).json({ error: "Invalid content target path." });
  }

  const body = updateContentBodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Body must include non-empty string 'value'." });
  }

  const { page, section, key } = pathParams.data;

  try {
    await upsertContentValue({
      page: decodeURIComponent(page),
      section: decodeURIComponent(section),
      key: decodeURIComponent(key),
      value: body.data.value,
      locale: body.data.locale ?? "en",
      updatedBy: body.data.updatedBy ?? req.session.admin.username,
    });

    return res.status(200).json({
      message: "Content updated successfully.",
      page: decodeURIComponent(page),
      section: decodeURIComponent(section),
      key: decodeURIComponent(key),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown update error.";
    return res.status(400).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Admin API listening on http://localhost:${port}`);
});
