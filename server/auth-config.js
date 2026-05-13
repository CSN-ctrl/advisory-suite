import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";

const isProduction = process.env.NODE_ENV === "production";

function getAdminUsername() {
  return (process.env.ADMIN_USERNAME || "admin").trim() || "admin";
}

export function getConfiguredAdminUsername() {
  return getAdminUsername();
}

function getAdminPasswordHash() {
  return (process.env.ADMIN_PASSWORD_HASH || "").trim();
}

function getFallbackAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function safeStringCompare(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function verifyAdminCredentials({ username, password }) {
  if (!safeStringCompare(username, getAdminUsername())) {
    return false;
  }

  const configuredHash = getAdminPasswordHash();
  if (configuredHash.length > 0) {
    return bcrypt.compare(password, configuredHash);
  }

  const fallbackPassword = getFallbackAdminPassword();
  if (!fallbackPassword) {
    return false;
  }

  return safeStringCompare(password, fallbackPassword);
}

export function getAdminSessionPayload() {
  return {
    username: getAdminUsername(),
    role: "admin",
  };
}

export function getSessionSecret() {
  const direct = process.env.ADMIN_SESSION_SECRET?.trim();
  if (direct) return direct;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) {
    return createHash("sha256")
      .update(`advisory-suite:admin-cookie:${serviceRole}`, "utf8")
      .digest("hex");
  }

  if (isProduction) {
    throw new Error(
      "Admin sessions need ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY in production.",
    );
  }

  return "dev-only-admin-session-secret-change-me";
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  };
}
