#!/usr/bin/env node
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "..", ".env");
if (existsSync(rootEnv)) loadEnv({ path: rootEnv, override: false });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function loadInsights() {
  const mod = await import(pathToFileURL(path.resolve(__dirname, "../src/data/insights.ts")).href);
  return mod.insights;
}

async function main() {
  const insights = await loadInsights();
  const rows = insights.map((article, index) => ({
    slug: article.slug,
    locale: "en",
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    article_date: article.date,
    meta_description: article.metaDescription,
    sort_order: index,
    published: true,
    updated_by: "seed-script",
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("insight_articles").upsert(rows, { onConflict: "slug,locale" });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log(`Seeded ${rows.length} insight articles.`);
}

main();
