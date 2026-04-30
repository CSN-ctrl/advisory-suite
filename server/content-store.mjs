import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentFilePath = path.join(__dirname, "data", "content.json");

async function ensureStore() {
  try {
    await fs.access(contentFilePath);
  } catch {
    await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
    await fs.writeFile(contentFilePath, JSON.stringify({}, null, 2), "utf-8");
  }
}

export async function readAllContent() {
  await ensureStore();
  const fileData = await fs.readFile(contentFilePath, "utf-8");
  return JSON.parse(fileData);
}

export async function upsertContentValue({ page, section, key, value, locale = "en", updatedBy = "admin" }) {
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
