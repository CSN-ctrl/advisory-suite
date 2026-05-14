import { verifySupabaseAdminRequest } from "../_lib/supabase-admin-verify.js";
import { sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const admin = await verifySupabaseAdminRequest(req);
  if (!admin) {
    return sendJson(res, 200, { authenticated: false });
  }

  return sendJson(res, 200, {
    authenticated: true,
    admin: {
      username: admin.username,
      role: admin.role,
    },
  });
}
