import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH || "";
}

function getFallbackAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function safeStringCompare(left, right) {
  const leftBuffer = Buffer.from(String(left), "utf8");
  const rightBuffer = Buffer.from(String(right), "utf8");
  if (leftBuffer.length !== rightBuffer.length) return false;
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
  if (!fallbackPassword) return false;
  return safeStringCompare(password, fallbackPassword);
}
