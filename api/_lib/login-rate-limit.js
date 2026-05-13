import { sendJson } from "./http.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;
const store = new Map();

function clientKey(req) {
  const raw = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";
  return String(raw).split(",")[0].trim() || "unknown";
}

/** Returns true if request may proceed; otherwise sends 429 and returns false. */
export function checkLoginRateLimit(req, res) {
  const now = Date.now();
  if (store.size > 5000) {
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }

  const key = clientKey(req);
  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }
  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    res.setHeader("Retry-After", "900");
    sendJson(res, 429, { error: "Too many login attempts, try again later." });
    return false;
  }
  return true;
}
