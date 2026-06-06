import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient, tryGetSupabaseBrowserClient } from "@/integrations/supabase/client";
import { createDefaultDocument, isCanvasDocument, normalizeCanvasDocument, type CanvasDocument } from "@/lib/canvas-document";
import { createDefaultBlocks, normalizeBlocks, type PageBlock } from "@/lib/site-page-blocks";
import {
  blocksPayloadEqual,
  patchHasContentChange,
  nextRevisionPayload,
  SITE_PAGE_REVISION_RETENTION,
  type SitePageRevisionRow,
} from "@/lib/site-page-revisions";
import {
  createDefaultPageDocument,
  isPageDocumentV2,
  normalizePageDocument,
  type PageDocumentV2,
} from "@/visual-editor/schema/page-node";

export type { SitePageRevisionRow };

export type SitePageEditor = "blocks" | "canvas" | "visual-tree";

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
  pageTree: PageDocumentV2;
  pageMeta: { title?: string; description?: string };
  updated_at: string;
  created_at: string;
}

function mapRow(row: Record<string, unknown>): SitePageRow {
  const raw = row.blocks;
  if (isPageDocumentV2(raw)) {
    const pageTree = normalizePageDocument(raw);
    return {
      id: String(row.id),
      slug: String(row.slug ?? ""),
      locale: String(row.locale ?? "en"),
      title: String(row.title ?? ""),
      parent_id: row.parent_id == null ? null : String(row.parent_id),
      sort_order: Number(row.sort_order ?? 0),
      published: Boolean(row.published),
      editor: "visual-tree",
      blocks: createDefaultBlocks(),
      document: createDefaultDocument(),
      pageTree,
      pageMeta: pageTree.meta ?? {},
      updated_at: String(row.updated_at ?? ""),
      created_at: String(row.created_at ?? ""),
    };
  }
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
      pageTree: createDefaultPageDocument(),
      pageMeta: {},
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
    pageTree: createDefaultPageDocument(),
    pageMeta: {},
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

function getPageContentPayload(page: SitePageRow): unknown {
  if (page.editor === "visual-tree") return page.pageTree;
  if (page.editor === "canvas") return page.document;
  return page.blocks;
}

function mapRevisionRow(row: Record<string, unknown>): SitePageRevisionRow {
  const editorRaw = String(row.editor ?? "blocks");
  const editor: SitePageEditor =
    editorRaw === "visual-tree" || editorRaw === "canvas" ? editorRaw : "blocks";
  return {
    id: String(row.id),
    page_id: String(row.page_id),
    revision_number: Number(row.revision_number ?? 0),
    blocks: row.blocks,
    title: String(row.title ?? ""),
    published: Boolean(row.published),
    editor,
    created_by: row.created_by == null ? null : String(row.created_by),
    created_at: String(row.created_at ?? ""),
  };
}

async function insertSitePageRevisionSnapshot(
  sb: ReturnType<typeof getSupabaseBrowserClient>,
  page: SitePageRow,
  createdBy: string,
): Promise<void> {
  const { data: maxRow, error: maxErr } = await sb
    .from("site_page_revisions")
    .select("revision_number")
    .eq("page_id", page.id)
    .order("revision_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (maxErr) throw maxErr;

  const revisionNumber = Number((maxRow as { revision_number?: number } | null)?.revision_number ?? 0) + 1;
  const blocksSnapshot =
    page.editor === "visual-tree"
      ? page.pageTree
      : page.editor === "canvas"
        ? page.document
        : page.blocks;

  const { error: insertErr } = await sb.from("site_page_revisions").insert({
    page_id: page.id,
    revision_number: revisionNumber,
    blocks: blocksSnapshot,
    title: page.title,
    published: page.published,
    editor: page.editor,
    created_by: createdBy,
  });
  if (insertErr) throw insertErr;

  const { data: stale, error: staleErr } = await sb
    .from("site_page_revisions")
    .select("id")
    .eq("page_id", page.id)
    .order("revision_number", { ascending: false })
    .range(SITE_PAGE_REVISION_RETENTION, SITE_PAGE_REVISION_RETENTION + 100);
  if (staleErr) throw staleErr;
  const staleIds = (stale ?? []).map((r) => String((r as { id: string }).id));
  if (staleIds.length > 0) {
    const { error: delErr } = await sb.from("site_page_revisions").delete().in("id", staleIds);
    if (delErr) throw delErr;
  }
}

export async function fetchSitePageRevisions(
  pageId: string,
  limit = SITE_PAGE_REVISION_RETENTION,
): Promise<{ revisions: SitePageRevisionRow[]; error?: string }> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return { revisions: [], error: "Supabase not configured" };
  const { data, error } = await sb
    .from("site_page_revisions")
    .select("id,page_id,revision_number,blocks,title,published,editor,created_by,created_at")
    .eq("page_id", pageId)
    .order("revision_number", { ascending: false })
    .limit(limit);
  if (error) {
    if (error.message.includes("site_page_revisions")) {
      return { revisions: [], error: "Version history table not installed. Run db:apply:site-page-revisions." };
    }
    return { revisions: [], error: error.message };
  }
  return { revisions: (data ?? []).map((r) => mapRevisionRow(r as Record<string, unknown>)) };
}

export function useSitePageRevisions(pageId: string | undefined) {
  const [revisions, setRevisions] = useState<SitePageRevisionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!pageId) {
      setRevisions([]);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchSitePageRevisions(pageId);
    setRevisions(result.revisions);
    setError(result.error ?? null);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { revisions, loading, error, refresh };
}

export async function restoreSitePageRevision(
  pageId: string,
  revisionId: string,
): Promise<{ page?: SitePageRow; error?: string }> {
  const sb = getSupabaseBrowserClient();
  const { data: revData, error: revErr } = await sb
    .from("site_page_revisions")
    .select("id,page_id,revision_number,blocks,title,published,editor,created_by,created_at")
    .eq("id", revisionId)
    .eq("page_id", pageId)
    .maybeSingle();
  if (revErr || !revData) {
    return { error: revErr?.message ?? "Revision not found" };
  }
  const revision = mapRevisionRow(revData as Record<string, unknown>);
  const patch: Parameters<typeof updateSitePage>[1] = {
    title: revision.title,
    published: revision.published,
  };
  if (revision.editor === "visual-tree") {
    patch.pageTree = normalizePageDocument(revision.blocks);
  } else if (revision.editor === "canvas") {
    patch.document = normalizeCanvasDocument(revision.blocks);
  } else {
    patch.blocks = normalizeBlocks(revision.blocks);
  }
  const result = await updateSitePage(pageId, patch);
  if (result.error) return { error: result.error };
  const page = await fetchSitePageById(pageId);
  if (!page) return { error: "Page not found after restore" };
  return { page };
}

export async function insertSitePage(input: {
  slug: string;
  title: string;
  locale: string;
  parent_id?: string | null;
  editor?: SitePageEditor;
  blocks?: PageBlock[];
  document?: CanvasDocument;
  pageTree?: PageDocumentV2;
}): Promise<{ id: string } | { error: string }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";
  const loc = input.locale === "bg" ? "bg" : "en";
  const editor = input.editor ?? "blocks";
  const blocksPayload =
    editor === "visual-tree"
      ? (input.pageTree ?? createDefaultPageDocument())
      : editor === "canvas"
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
      published: false,
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
    pageTree: PageDocumentV2;
  }>,
): Promise<{ error?: string; revisionSaved?: boolean }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";

  if (patchHasContentChange(patch)) {
    const current = await fetchSitePageById(id);
    const nextPayload = nextRevisionPayload(patch);
    if (current && nextPayload !== undefined && !blocksPayloadEqual(getPageContentPayload(current), nextPayload)) {
      try {
        await insertSitePageRevisionSnapshot(sb, current, updatedBy);
      } catch (revErr) {
        const msg = revErr instanceof Error ? revErr.message : String(revErr);
        if (!msg.includes("site_page_revisions")) {
          return { error: `Could not save version history: ${msg}` };
        }
      }
    }
  }

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
  if (patch.pageTree !== undefined) payload.blocks = patch.pageTree;
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
