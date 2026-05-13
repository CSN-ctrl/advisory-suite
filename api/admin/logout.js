import { clearAdminCookie } from "../_lib/auth.js";
import { sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  clearAdminCookie(res);
  return sendJson(res, 200, { authenticated: false });
}
