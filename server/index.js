import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { z } from "zod";
import { readAllContent, upsertContentValue } from "./content-store.mjs";
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
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
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

app.get("/api/content", async (req, res) => {
  try {
    const page = typeof req.query.page === "string" ? req.query.page : "";
    const content = await readAllContent();

    if (page) {
      return res.status(200).json(content[page] ?? {});
    }

    return res.status(200).json(content);
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
