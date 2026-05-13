import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentFilePath = path.join(__dirname, "data", "content.json");

function isSupabaseContentEnabled() {
  return Boolean(
    process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

let cachedAdminClient = null;
function getSupabaseAdmin() {
  if (cachedAdminClient) return cachedAdminClient;
  cachedAdminClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return cachedAdminClient;
}

async function readAllContentFromSupabase() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_content")
    .select("page, section, key, locale, value");
  if (error) throw error;

  const locales = { en: {}, bg: {} };
  for (const row of data ?? []) {
    const loc = row.locale === "bg" ? "bg" : "en";
    if (!locales[loc][row.page]) locales[loc][row.page] = {};
    if (!locales[loc][row.page][row.section]) locales[loc][row.page][row.section] = {};
    locales[loc][row.page][row.section][row.key] = row.value ?? "";
  }
  return { locales, _meta: {} };
}

async function ensureStore() {
  try {
    await fs.access(contentFilePath);
  } catch {
    await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
    await fs.writeFile(contentFilePath, JSON.stringify({}, null, 2), "utf-8");
  }
}

export async function readAllContent() {
  if (isSupabaseContentEnabled()) {
    return readAllContentFromSupabase();
  }
  await ensureStore();
  const fileData = await fs.readFile(contentFilePath, "utf-8");
  return JSON.parse(fileData);
}

async function upsertContentValueSupabase({
  page,
  section,
  key,
  value,
  locale = "en",
  updatedBy = "admin",
}) {
  const supabase = getSupabaseAdmin();
  const normalizedLocale = locale === "bg" ? "bg" : "en";
  const { error } = await supabase.from("site_content").upsert(
    {
      page,
      section,
      key,
      locale: normalizedLocale,
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "page,section,key,locale" },
  );
  if (error) throw error;
  return readAllContentFromSupabase();
}

export async function upsertContentValue({
  page,
  section,
  key,
  value,
  locale = "en",
  updatedBy = "admin",
}) {
  if (isSupabaseContentEnabled()) {
    return upsertContentValueSupabase({
      page,
      section,
      key,
      value,
      locale,
      updatedBy,
    });
  }

  const content = await readAllContent();
  if (!content.locales || typeof content.locales !== "object") {
    content.locales = {};
  }

  const normalizedLocale = locale === "bg" ? "bg" : "en";
  const localeBucket = content.locales[normalizedLocale] ?? {};
  const nextPage = localeBucket[page] ?? {};
  const nextSection = nextPage[section] ?? {};

  content.locales[normalizedLocale] = {
    ...localeBucket,
    [page]: {
      ...nextPage,
      [section]: {
        ...nextSection,
        [key]: value,
      },
    },
  };

  const metadata = content._meta ?? {};
  metadata[`${normalizedLocale}.${page}.${section}.${key}`] = {
    updatedBy,
    updatedAt: new Date().toISOString(),
    locale: normalizedLocale,
  };
  content._meta = metadata;

  await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf-8");
  return content;
}
