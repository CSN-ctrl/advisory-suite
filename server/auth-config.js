import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

const isProduction = process.env.NODE_ENV === "production";

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

export function getConfiguredAdminUsername() {
  return getAdminUsername();
}

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH || "";
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
  if (configuredHash) {
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
  const configuredSecret = process.env.ADMIN_SESSION_SECRET || "";
  if (isProduction && !configuredSecret) {
    throw new Error("ADMIN_SESSION_SECRET must be set in production.");
  }

  return configuredSecret || "dev-only-admin-session-secret-change-me";
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  };
}
