import "./env.js";
import { createClient } from "@supabase/supabase-js";

let cachedAdminClient = null;
let cachedAnonClient = null;

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_URL is not configured.");
  }
  return url;
}

export function getAdminClient() {
  if (cachedAdminClient) return cachedAdminClient;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  cachedAdminClient = createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdminClient;
}

export function getAnonClient() {
  if (cachedAnonClient) return cachedAnonClient;
  const key =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Supabase public key is not configured (set SUPABASE_ANON_KEY, SUPABASE_PUBLISHABLE_KEY, or VITE_* equivalents).",
    );
  }
  cachedAnonClient = createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAnonClient;
}
