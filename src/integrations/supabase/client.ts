import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function readBrowserConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);
  return { url, key };
}

/** True when Vite env has Supabase URL + anon/publishable key (required on Vercel). */
export function hasSupabaseBrowserConfig(): boolean {
  const { url, key } = readBrowserConfig();
  return Boolean(url?.trim() && key?.trim());
}

/** Returns client or null — never throws (safe for public page load). */
export function tryGetSupabaseBrowserClient(): SupabaseClient | null {
  if (!hasSupabaseBrowserConfig()) return null;
  if (browserClient) return browserClient;
  const { url, key } = readBrowserConfig();
  if (!url || !key) return null;
  browserClient = createClient(url, key);
  return browserClient;
}

/** Browser Supabase client (Auth + public API). Throws if env is missing. */
export function getSupabaseBrowserClient(): SupabaseClient {
  const client = tryGetSupabaseBrowserClient();
  if (!client) {
    throw new Error(
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in .env or Vercel Environment Variables.",
    );
  }
  return client;
}
