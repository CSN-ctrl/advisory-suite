import { readAdminSession } from "../_lib/auth.js";
import { sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const session = readAdminSession(req);
  if (!session) {
    // 200 so DevTools does not treat "logged out" as a failed request; body carries auth state.
    return sendJson(res, 200, { authenticated: false });
  }

  return sendJson(res, 200, {
    authenticated: true,
    admin: {
      username: session.username,
      role: session.role,
    },
  });
}
