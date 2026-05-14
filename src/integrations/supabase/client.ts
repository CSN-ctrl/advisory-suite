import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function readBrowserConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);
  return { url, key };
}

/** Browser Supabase client (Auth + public API). Lazily created. */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const { url, key } = readBrowserConfig();
  if (!url || !key) {
    throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in .env.");
  }
  browserClient = createClient(url, key);
  return browserClient;
}
