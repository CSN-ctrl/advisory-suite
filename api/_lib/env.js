/**
 * Load repo-root `.env` for Vercel serverless and any Node process.
 * Does not override variables already set (e.g. on Vercel).
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..", "..");
const envPath = resolve(rootDir, ".env");

if (existsSync(envPath)) {
  config({ path: envPath, override: false });
}
