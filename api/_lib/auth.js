import "./env.js";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin.token";
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * Prefer ADMIN_SESSION_SECRET. If unset, derive a stable key from SUPABASE_SERVICE_ROLE_KEY
 * so Vercel can sign cookies without an extra env var (rotating the service role invalidates sessions).
 */
function getSessionSecret() {
  const direct = process.env.ADMIN_SESSION_SECRET?.trim();
  if (direct) return direct;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) {
    return createHash("sha256")
      .update(`advisory-suite:admin-cookie:${serviceRole}`, "utf8")
      .digest("hex");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Admin cookie signing needs ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return "dev-only-admin-session-secret-change-me";
}

function base64UrlEncode(value) {
  return Buffer.from(value, "utf-8")
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf-8");
}

function sign(value) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createAdminToken(payload, maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS) {
  const body = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const encoded = base64UrlEncode(JSON.stringify(body));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAdminToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const expectedBuf = Buffer.from(expected, "utf-8");
  const signatureBuf = Buffer.from(signature, "utf-8");
  if (expectedBuf.length !== signatureBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, signatureBuf)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const header = req.headers?.cookie;
  if (!header || typeof header !== "string") return {};
  const out = {};
  for (const piece of header.split(";")) {
    const [rawKey, ...rawValueParts] = piece.split("=");
    if (!rawKey) continue;
    const key = rawKey.trim();
    if (!key) continue;
    const value = rawValueParts.join("=").trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function buildCookie(name, value, options) {
  const parts = [`${name}=${value}`];
  parts.push("HttpOnly");
  parts.push("Path=/");
  parts.push("SameSite=Lax");
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  if (typeof options?.maxAge === "number") {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  return parts.join("; ");
}

export function setAdminCookie(res, token, maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS) {
  res.setHeader("Set-Cookie", buildCookie(COOKIE_NAME, token, { maxAge: maxAgeSeconds }));
}

export function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", buildCookie(COOKIE_NAME, "", { maxAge: 0 }));
}

export function readAdminSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
