import { MARKETING_PAGES } from "@/lib/marketing-pages";
import type { CanvasDocument, CanvasElement } from "@/lib/canvas-document";

const CONTENT_PAGE_PATHS: Record<string, string> = {
  insight_article: "/insights",
  not_found: "/",
};

export function marketingPathFromContentPage(contentPage: string): string {
  if (CONTENT_PAGE_PATHS[contentPage]) return CONTENT_PAGE_PATHS[contentPage];
  const def = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
  return def?.path ?? "/";
}

export function marketingPageFromPath(pathname: string): string | null {
  if (pathname === "/about") return "about";
  const match = MARKETING_PAGES.find((p) => p.path === pathname);
  if (match?.contentPage) return match.contentPage;
  if (pathname.startsWith("/insights/") && pathname !== "/insights") return "insight_article";
  return null;
}

export function isMarketingRoute(pathname: string): boolean {
  return marketingPageFromPath(pathname) !== null;
}

export function marketingCanvasSlug(contentPage: string, locale: string): string {
  const loc = locale === "bg" ? "bg" : "en";
  return `layout-${contentPage}-${loc}`;
}

export function parseCanvasBinding(raw: string | null | undefined) {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as CanvasElement["binding"];
    if (parsed?.page && parsed?.section && parsed?.key) return parsed;
  } catch {
    /* ignore */
  }
  return undefined;
}

/** Fallback: top-level `<section>` elements inside `<main>` when no `data-canvas-block` wrappers exist. */
export function scanPageSections(root: HTMLElement, contentPage: string): CanvasElement[] {
  const rootRect = root.getBoundingClientRect();
  const scrollX = root.scrollLeft;
  const scrollY = root.scrollTop;
  const sections = root.querySelectorAll<HTMLElement>("main section");

  return Array.from(sections).map((el, index) => {
    const blockId =
      el.getAttribute("data-canvas-block") ??
      (el.id?.trim() || `${contentPage}-section-${index}`);
    const label = el.getAttribute("data-canvas-label") ?? el.getAttribute("aria-label") ?? blockId;

    const rect = el.getBoundingClientRect();
    return {
      id: blockId,
      blockId,
      label,
      type: "box",
      content: label,
      style: { borderRadius: "10px" },
      position: {
        x: rect.left - rootRect.left + scrollX,
        y: rect.top - rootRect.top + scrollY,
        width: Math.max(48, rect.width),
        height: Math.max(32, rect.height),
        zIndex: 20 + index,
      },
    } satisfies CanvasElement;
  });
}

export function scanPageForEditor(root: HTMLElement, contentPage: string): CanvasElement[] {
  const blocks = scanPageBlocks(root);
  if (blocks.length > 0) return blocks;
  return scanPageSections(root, contentPage);
}

export function scanPageBlocks(root: HTMLElement): CanvasElement[] {
  const rootRect = root.getBoundingClientRect();
  const scrollX = root.scrollLeft;
  const scrollY = root.scrollTop;
  const nodes = root.querySelectorAll<HTMLElement>("[data-canvas-block]");

  return Array.from(nodes).map((el, index) => {
    const blockId = el.getAttribute("data-canvas-block") ?? `block-${index}`;
    const label = el.getAttribute("data-canvas-label") ?? blockId;
    const binding = parseCanvasBinding(el.getAttribute("data-canvas-binding"));
    const rect = el.getBoundingClientRect();
    const isCard = el.getAttribute("data-canvas-type") === "card";

    return {
      id: blockId,
      blockId,
      label,
      binding,
      type: isCard ? "card" : "box",
      content: label,
      style: {
        borderRadius: "10px",
      },
      position: {
        x: rect.left - rootRect.left + scrollX,
        y: rect.top - rootRect.top + scrollY,
        width: Math.max(48, rect.width),
        height: Math.max(32, rect.height),
        zIndex: 20 + index,
      },
    } satisfies CanvasElement;
  });
}

export function mergeScannedWithDocument(scanned: CanvasElement[], document: CanvasDocument): CanvasDocument {
  const savedByBlock = new Map(
    document.elements.filter((e) => e.blockId).map((e) => [e.blockId!, e]),
  );
  const scannedIds = new Set(scanned.map((s) => s.blockId));

  const mergedBlocks = scanned.map((s) => {
    const saved = savedByBlock.get(s.blockId!);
    if (!saved) return s;
    return {
      ...s,
      id: saved.id,
      style: { ...s.style, ...saved.style },
      position: saved.position,
      content: saved.content || s.content,
      binding: saved.binding ?? s.binding,
      label: saved.label ?? s.label,
    };
  });

  const extra = document.elements.filter((e) => !e.blockId || !scannedIds.has(e.blockId));

  const maxY = mergedBlocks.reduce((m, e) => Math.max(m, e.position.y + e.position.height), 0);

  return {
    ...document,
    canvas: {
      width: document.canvas.width,
      height: Math.max(document.canvas.height, maxY + 120),
    },
    elements: [...mergedBlocks, ...extra],
  };
}

export { createMarketingLayoutDocument, MARKETING_CONTENT_PAGES } from "@/lib/marketing-canvas-templates";
export type { MarketingContentPage } from "@/lib/marketing-canvas-templates";
