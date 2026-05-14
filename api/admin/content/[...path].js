import { verifySupabaseAdminRequest } from "../../_lib/supabase-admin-verify.js";
import { getAdminClient } from "../../_lib/supabase.js";
import { readJsonBody, sendJson } from "../../_lib/http.js";

const MAX_VALUE_LENGTH = 20000;
const MAX_NAME_LENGTH = 128;

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolvePathSegments(query) {
  const raw = query?.path;
  if (Array.isArray(raw)) return raw.map((segment) => safeDecode(String(segment)));
  if (typeof raw === "string") return raw.split("/").map((segment) => safeDecode(segment));
  return [];
}

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const session = await verifySupabaseAdminRequest(req);
  if (!session || session.role !== "admin") {
    return sendJson(res, 401, { error: "Unauthorized" });
  }

  const segments = resolvePathSegments(req.query);
  if (segments.length !== 3) {
    return sendJson(res, 400, { error: "Expected path /api/admin/content/:page/:section/:key" });
  }

  const [page, section, key] = segments;

  if (!page || !section || !key) {
    return sendJson(res, 400, { error: "Missing content target path." });
  }
  if (page.length > MAX_NAME_LENGTH || section.length > MAX_NAME_LENGTH || key.length > MAX_NAME_LENGTH) {
    return sendJson(res, 400, { error: "Content target path too long." });
  }

  const body = await readJsonBody(req);
  const rawValue = typeof body.value === "string" ? body.value : "";
  const value = rawValue.trim();
  const locale = body.locale === "bg" ? "bg" : "en";
  const updatedBy =
    typeof body.updatedBy === "string" && body.updatedBy.trim().length > 0
      ? body.updatedBy.trim().slice(0, MAX_NAME_LENGTH)
      : session.username || "admin";

  if (value.length < 1 || value.length > MAX_VALUE_LENGTH) {
    return sendJson(res, 400, {
      error: "Body must include non-empty string 'value'.",
    });
  }

  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          page,
          section,
          key,
          locale,
          value,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page,section,key,locale" },
      );

    if (error) {
      return sendJson(res, 500, { error: error.message });
    }

    return sendJson(res, 200, {
      message: "Content updated successfully.",
      page,
      section,
      key,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save content";
    return sendJson(res, 500, { error: message });
  }
}
