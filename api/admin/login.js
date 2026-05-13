import { verifyAdminCredentials, getAdminUsername } from "../_lib/admin-credentials.js";
import { createAdminToken, setAdminCookie } from "../_lib/auth.js";
import { checkLoginRateLimit } from "../_lib/login-rate-limit.js";
import { readJsonBody, sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  if (!checkLoginRateLimit(req, res)) {
    return;
  }

  const body = await readJsonBody(req);
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || username.length > 128 || password.length < 8 || password.length > 256) {
    return sendJson(res, 400, { error: "Invalid credentials payload" });
  }

  let valid = false;
  try {
    valid = await verifyAdminCredentials({ username, password });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth error";
    return sendJson(res, 500, { error: message });
  }

  if (!valid) {
    return sendJson(res, 401, { error: "Invalid username or password" });
  }

  const adminPayload = {
    username: getAdminUsername(),
    role: "admin",
  };
  const token = createAdminToken(adminPayload);
  setAdminCookie(res, token);

  return sendJson(res, 200, {
    authenticated: true,
    admin: adminPayload,
  });
}
