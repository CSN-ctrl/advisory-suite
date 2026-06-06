export const SITE_PAGE_REVISION_RETENTION = 50;

export type SitePageRevisionEditor = "blocks" | "canvas" | "visual-tree";

export interface SitePageRevisionRow {
  id: string;
  page_id: string;
  revision_number: number;
  blocks: unknown;
  title: string;
  published: boolean;
  editor: SitePageRevisionEditor;
  created_by: string | null;
  created_at: string;
}

/** True when patch includes a content payload that should trigger a snapshot. */
export function patchHasContentChange(patch: {
  blocks?: unknown;
  document?: unknown;
  pageTree?: unknown;
}): boolean {
  return patch.blocks !== undefined || patch.document !== undefined || patch.pageTree !== undefined;
}

/** Compare two JSON payloads for equality (stable stringify). */
export function blocksPayloadEqual(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

export function nextRevisionPayload(
  patch: {
    blocks?: unknown;
    document?: unknown;
    pageTree?: unknown;
  },
): unknown | undefined {
  if (patch.pageTree !== undefined) return patch.pageTree;
  if (patch.document !== undefined) return patch.document;
  if (patch.blocks !== undefined) return patch.blocks;
  return undefined;
}
