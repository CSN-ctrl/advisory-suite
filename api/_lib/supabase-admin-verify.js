import "./env.js";
import { getAdminClient } from "./supabase.js";

/**
 * @param {import("http").IncomingMessage} req
 * @returns {string | null}
 */
export function getBearerAccessToken(req) {
  const raw = req.headers?.authorization;
  if (typeof raw !== "string" || !raw.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  const token = raw.slice(7).trim();
  return token.length > 0 ? token : null;
}

function parseEnvAllowlist() {
  const raw = process.env.ADMIN_SUPABASE_ALLOWLIST?.trim() || "";
  if (!raw) return null;
  const parts = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return parts.length > 0 ? parts : null;
}

/**
 * @param {import("@supabase/supabase-js").User} user
 * @returns {Promise<boolean>}
 */
async function isAdminProfile(user) {
  if (!user?.email) return false;
  const envAllow = parseEnvAllowlist();
  if (envAllow?.includes(user.email.toLowerCase())) return true;
  const app = user.app_metadata ?? {};
  const meta = user.user_metadata ?? {};
  if (app.admin === true || meta.admin === true) return true;

  try {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from("admin_email_allowlist")
      .select("email")
      .eq("email", user.email.trim().toLowerCase())
      .maybeSingle();
    return Boolean(data?.email);
  } catch {
    return false;
  }
}

/**
 * Validates Supabase access token and admin eligibility.
 * @param {import("http").IncomingMessage} req
 * @returns {Promise<{ username: string; role: "admin"; id: string } | null>}
 */
export async function verifySupabaseAdminRequest(req) {
  const accessToken = getBearerAccessToken(req);
  if (!accessToken) return null;

  try {
    const supabase = getAdminClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);
    if (error || !user) return null;
    if (!(await isAdminProfile(user))) return null;
    return {
      username: user.email ?? user.id,
      role: "admin",
      id: user.id,
    };
  } catch {
    return null;
  }
}
