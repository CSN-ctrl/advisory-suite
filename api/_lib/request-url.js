/**
 * Parse req.url with correct host/proto on Vercel (x-forwarded-*).
 */
export function parseRequestUrl(req) {
  const pathAndQuery = req.url || "/";
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "localhost")
    .split(",")[0]
    .trim();
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim() || "https";
  return new URL(pathAndQuery, `${proto}://${host}`);
}
