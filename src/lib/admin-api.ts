import { getSupabaseBrowserClient } from "@/integrations/supabase/client";

/** True when signed in and DB `is_admin()` (metadata or admin_email_allowlist). */
export async function checkIsSupabaseAdmin(): Promise<boolean> {
  try {
    const sb = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session) return false;

    const { data, error } = await sb.rpc("is_admin");
    if (error) return false;
    return data === true;
  } catch {
    return false;
  }
}
