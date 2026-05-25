import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient, tryGetSupabaseBrowserClient } from "@/integrations/supabase/client";
import { createDefaultDocument, isCanvasDocument, normalizeCanvasDocument, type CanvasDocument } from "@/lib/canvas-document";
import { createDefaultBlocks, normalizeBlocks, type PageBlock } from "@/lib/site-page-blocks";

export type SitePageEditor = "blocks" | "canvas";

export interface SitePageRow {
  id: string;
  slug: string;
  locale: string;
  title: string;
  parent_id: string | null;
  sort_order: number;
  published: boolean;
  editor: SitePageEditor;
  blocks: PageBlock[];
  document: CanvasDocument;
  updated_at: string;
  created_at: string;
}

function mapRow(row: Record<string, unknown>): SitePageRow {
  const raw = row.blocks;
  if (isCanvasDocument(raw)) {
    return {
      id: String(row.id),
      slug: String(row.slug ?? ""),
      locale: String(row.locale ?? "en"),
      title: String(row.title ?? ""),
      parent_id: row.parent_id == null ? null : String(row.parent_id),
      sort_order: Number(row.sort_order ?? 0),
      published: Boolean(row.published),
      editor: "canvas",
      blocks: createDefaultBlocks(),
      document: normalizeCanvasDocument(raw),
      updated_at: String(row.updated_at ?? ""),
      created_at: String(row.created_at ?? ""),
    };
  }
  return {
    id: String(row.id),
    slug: String(row.slug ?? ""),
    locale: String(row.locale ?? "en"),
    title: String(row.title ?? ""),
    parent_id: row.parent_id == null ? null : String(row.parent_id),
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
    editor: "blocks",
    blocks: normalizeBlocks(raw),
    document: createDefaultDocument(),
    updated_at: String(row.updated_at ?? ""),
    created_at: String(row.created_at ?? ""),
  };
}

export function useSitePagesList(locale: string) {
  const [pages, setPages] = useState<SitePageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sb = tryGetSupabaseBrowserClient();
      if (!sb) {
        setPages([]);
        return;
      }
      const { data, error: qErr } = await sb
        .from("site_pages")
        .select("id,slug,locale,title,parent_id,sort_order,published,blocks,updated_at,created_at")
        .eq("locale", locale === "bg" ? "bg" : "en")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (qErr) {
        setError(qErr.message);
        setPages([]);
        return;
      }
      setPages((data ?? []).map((r) => mapRow(r as Record<string, unknown>)));
    } catch {
      setError("Failed to load pages");
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { pages, loading, error, refresh };
}

export async function fetchSitePageBySlug(slug: string, locale: string): Promise<SitePageRow | null> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return null;
  const loc = locale === "bg" ? "bg" : "en";
  const { data, error } = await sb
    .from("site_pages")
    .select("id,slug,locale,title,parent_id,sort_order,published,blocks,updated_at,created_at")
    .eq("slug", slug)
    .eq("locale", loc)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function fetchSitePageById(id: string): Promise<SitePageRow | null> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("site_pages")
    .select("id,slug,locale,title,parent_id,sort_order,published,blocks,updated_at,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function insertSitePage(input: {
  slug: string;
  title: string;
  locale: string;
  parent_id?: string | null;
  editor?: SitePageEditor;
  blocks?: PageBlock[];
  document?: CanvasDocument;
}): Promise<{ id: string } | { error: string }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";
  const loc = input.locale === "bg" ? "bg" : "en";
  const editor = input.editor ?? "blocks";
  const blocksPayload =
    editor === "canvas"
      ? (input.document ?? createDefaultDocument())
      : (input.blocks ?? createDefaultBlocks());
  const { data, error } = await sb
    .from("site_pages")
    .insert({
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      locale: loc,
      parent_id: input.parent_id ?? null,
      sort_order: 0,
      published: true,
      blocks: blocksPayload,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) {
    return { error: error.message };
  }
  return { id: String((data as { id: string }).id) };
}

export async function updateSitePage(
  id: string,
  patch: Partial<{
    title: string;
    slug: string;
    published: boolean;
    parent_id: string | null;
    sort_order: number;
    blocks: PageBlock[];
    document: CanvasDocument;
  }>,
): Promise<{ error?: string }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";
  const payload: Record<string, unknown> = {
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  };
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.slug !== undefined) payload.slug = patch.slug.trim().toLowerCase();
  if (patch.published !== undefined) payload.published = patch.published;
  if (patch.parent_id !== undefined) payload.parent_id = patch.parent_id;
  if (patch.sort_order !== undefined) payload.sort_order = patch.sort_order;
  if (patch.blocks !== undefined) payload.blocks = patch.blocks;
  if (patch.document !== undefined) payload.blocks = patch.document;
  const { error } = await sb.from("site_pages").update(payload).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

/** @deprecated Use updateSitePage */
export async function updateSitePageBlocks(
  id: string,
  patch: Partial<Pick<SitePageRow, "title" | "slug" | "published" | "parent_id" | "sort_order" | "blocks">>,
): Promise<{ error?: string }> {
  return updateSitePage(id, patch);
}

export async function deleteSitePage(id: string): Promise<{ error?: string }> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("site_pages").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
