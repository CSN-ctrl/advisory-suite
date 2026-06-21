#!/usr/bin/env node
/**
 * Apply a SQL migration file to the linked Supabase Postgres database.
 *
 * Requires one of:
 *   - DATABASE_URL or SUPABASE_DB_URL (Session pooler URI from Supabase Dashboard → Database)
 *   - Or `psql` on PATH and the same env var
 *
 * Usage:
 *   node scripts/apply-sql-migration.mjs supabase/migrations/20260524120000_site_pages.sql
 *
 * Loads repo-root `.env` when present.
 */
import { config as loadEnv } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rootEnv = path.join(root, ".env");
if (existsSync(rootEnv)) {
  loadEnv({ path: rootEnv, override: false });
}

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Usage: node scripts/apply-sql-migration.mjs <path-to.sql>");
  process.exit(1);
}

const absSql = path.isAbsolute(sqlPath) ? sqlPath : path.join(root, sqlPath);
if (!existsSync(absSql)) {
  console.error(`SQL file not found: ${absSql}`);
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DB_URL in .env.\n" +
      "Get the connection string from Supabase Dashboard → Project Settings → Database → Connection string (URI).",
  );
  process.exit(1);
}

const sql = readFileSync(absSql, "utf8");
console.log(`Applying ${path.relative(root, absSql)} …`);

const result = spawnSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", absSql], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error(`Migration failed (exit ${result.status ?? "unknown"}).`);
  process.exit(result.status ?? 1);
}

console.log("Migration applied successfully.");
