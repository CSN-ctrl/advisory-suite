import { marketingCanvasSlug, marketingPathFromContentPage } from "@/lib/marketing-canvas";
import { getAllEditorCanvasPages } from "@/lib/marketing-page-labels";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import type { SitePageEditor, SitePageRow } from "@/hooks/use-site-pages";

export type HubEditorKind = "inline" | SitePageEditor;

export type HubPageCategory = "marketing" | "custom" | "layout";

export interface HubPageEntry {
  id: string;
  title: string;
  path: string;
  editorKind: HubEditorKind;
  category: HubPageCategory;
  published: boolean | null;
  sitePageId?: string;
  contentPage?: string;
  editHref: string;
  previewHref: string;
}

export function isLayoutSlug(slug: string): boolean {
  return slug.startsWith("layout-");
}

export function editorKindLabel(kind: HubEditorKind, isBg: boolean): string {
  if (kind === "inline") return isBg ? "Inline" : "Inline";
  if (kind === "blocks") return isBg ? "Блокове" : "Blocks";
  if (kind === "canvas") return isBg ? "Canvas" : "Canvas";
  return isBg ? "Визуален" : "Visual";
}

export function buildMarketingInlineEntries(isBg: boolean): HubPageEntry[] {
  return MARKETING_PAGES.map((page) => ({
    id: page.id,
    title: isBg ? page.labelBg : page.labelEn,
    path: page.path,
    editorKind: "inline" as const,
    category: "marketing" as const,
    published: null,
    contentPage: page.contentPage,
    editHref: page.path,
    previewHref: page.path,
  }));
}

export function buildMarketingLayoutEntries(locale: string, pages: SitePageRow[], isBg: boolean): HubPageEntry[] {
  const loc = locale === "bg" ? "bg" : "en";
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  return getAllEditorCanvasPages().map((entry) => {
    const slug = marketingCanvasSlug(entry.contentPage, loc);
    const row = bySlug.get(slug);
    const label = isBg ? entry.labelBg : entry.labelEn;
    const livePath = marketingPathFromContentPage(entry.contentPage);

    return {
      id: row?.id ?? `layout-${entry.contentPage}-${loc}`,
      title: `${label} (${isBg ? "canvas layout" : "canvas layout"})`,
      path: livePath,
      editorKind: row?.editor ?? "canvas",
      category: "layout" as const,
      published: row?.published ?? false,
      sitePageId: row?.id,
      contentPage: entry.contentPage,
      editHref: `/admin/pages/canvas/${entry.contentPage}`,
      previewHref: livePath,
    };
  });
}

export function buildCustomPageEntries(pages: SitePageRow[]): HubPageEntry[] {
  return pages
    .filter((p) => !isLayoutSlug(p.slug))
    .map((p) => ({
      id: p.id,
      title: p.title,
      path: `/pages/${p.slug}`,
      editorKind: p.editor,
      category: "custom" as const,
      published: p.published,
      sitePageId: p.id,
      editHref:
        p.editor === "visual-tree"
          ? `/admin/visual-builder/${p.id}`
          : p.editor === "canvas"
            ? `/admin/editor/${p.id}`
            : `/admin/site/page/${p.id}`,
      previewHref: p.published ? `/pages/${p.slug}` : `/pages/${p.slug}?draft=1`,
    }));
}

export function buildAllHubEntries(locale: string, pages: SitePageRow[], isBg: boolean): HubPageEntry[] {
  return [
    ...buildMarketingInlineEntries(isBg),
    ...buildMarketingLayoutEntries(locale, pages, isBg),
    ...buildCustomPageEntries(pages),
  ];
}
