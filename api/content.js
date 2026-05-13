import { getAnonClient } from "./_lib/supabase.js";
import { parseRequestUrl } from "./_lib/request-url.js";
import { sendJson } from "./_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const url = parseRequestUrl(req);
  const page = url.searchParams.get("page") || "";
  const locale = url.searchParams.get("locale") === "bg" ? "bg" : "en";

  try {
    const supabase = getAnonClient();
    let query = supabase
      .from("site_content")
      .select("page, section, key, value")
      .eq("locale", locale);

    if (page) {
      query = query.eq("page", page);
    }

    const { data, error } = await query;
    if (error) {
      return sendJson(res, 500, { error: error.message });
    }

    const rows = Array.isArray(data) ? data : [];

    if (page) {
      const sections = {};
      for (const row of rows) {
        if (!row?.section || !row?.key) continue;
        if (!sections[row.section]) sections[row.section] = {};
        sections[row.section][row.key] = row.value ?? "";
      }
      return sendJson(res, 200, sections);
    }

    const pages = {};
    for (const row of rows) {
      if (!row?.page || !row?.section || !row?.key) continue;
      if (!pages[row.page]) pages[row.page] = {};
      if (!pages[row.page][row.section]) pages[row.page][row.section] = {};
      pages[row.page][row.section][row.key] = row.value ?? "";
    }

    return sendJson(res, 200, pages);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read content";
    return sendJson(res, 500, { error: message });
  }
}
