import { sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  return sendJson(res, 410, {
    error: "Password login was removed. Sign in with Supabase Auth in the app, then retry.",
  });
}
