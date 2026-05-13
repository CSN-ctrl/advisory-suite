#!/usr/bin/env node
// Seeds existing server/data/content.json into the Supabase `site_content` table.
// Loads repo-root `.env` (same as app). Requires `site_content` from
// supabase/migrations/20260512190000_site_content.sql.

import { config as loadEnv } from "dotenv";
import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnv = path.resolve(__dirname, "..", ".env");
if (existsSync(rootEnv)) {
  loadEnv({ path: rootEnv, override: false });
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const contentPath = path.join(__dirname, "..", "server", "data", "content.json");

function flattenLocale(locale, payload) {
  const rows = [];
  if (!payload || typeof payload !== "object") return rows;
  for (const [page, sections] of Object.entries(payload)) {
    if (page === "_meta" || page === "locales") continue;
    if (!sections || typeof sections !== "object") continue;
    for (const [section, keys] of Object.entries(sections)) {
      if (!keys || typeof keys !== "object") continue;
      for (const [key, value] of Object.entries(keys)) {
        if (typeof value !== "string" || value.length === 0) continue;
        rows.push({
          page,
          section,
          key,
          locale,
          value,
          updated_by: "seed-script",
          updated_at: new Date().toISOString(),
        });
      }
    }
  }
  return rows;
}

async function main() {
  const raw = await fs.readFile(contentPath, "utf-8");
  const data = JSON.parse(raw);

  const rows = [];

  // New shape: data.locales.en / data.locales.bg
  if (data?.locales && typeof data.locales === "object") {
    for (const [locale, payload] of Object.entries(data.locales)) {
      rows.push(...flattenLocale(locale === "bg" ? "bg" : "en", payload));
    }
  }

  // Legacy shape: top-level page maps treated as English.
  for (const [page, sections] of Object.entries(data)) {
    if (page === "_meta" || page === "locales") continue;
    rows.push(...flattenLocale("en", { [page]: sections }));
  }

  if (rows.length === 0) {
    console.log("No content rows to seed.");
    return;
  }

  console.log(`Seeding ${rows.length} content rows...`);

  const { error } = await supabase
    .from("site_content")
    .upsert(rows, { onConflict: "page,section,key,locale" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
