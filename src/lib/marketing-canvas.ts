import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { newElementId, type CanvasDocument, type CanvasElement } from "@/lib/canvas-document";

export function marketingPathFromContentPage(contentPage: string): string {
  const def = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
  return def?.path ?? "/";
}

export function marketingPageFromPath(pathname: string): string | null {
  if (pathname === "/about") return "mission";
  const match = MARKETING_PAGES.find((p) => p.path === pathname);
  if (match?.contentPage) return match.contentPage;
  if (pathname.startsWith("/insights/") && pathname !== "/insights") return "insights";
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

export function createMarketingLayoutDocument(contentPage: string, title: string): CanvasDocument {
  return {
    version: 1,
    editor: "canvas",
    canvas: { width: 1200, height: 2400 },
    elements: [
      {
        id: newElementId(),
        type: "heading",
        content: title,
        style: { fontSize: "28px", fontWeight: "600", color: "hsl(var(--foreground))" },
        position: { x: 40, y: 24, width: 400, height: 40, zIndex: 1 },
      },
      {
        id: `meta-${contentPage}`,
        blockId: `meta-${contentPage}`,
        label: "Page layout",
        type: "text",
        content: "Scan the page to capture blocks, cards, and text regions.",
        style: { fontSize: "14px", color: "hsl(var(--muted-foreground))" },
        position: { x: 40, y: 72, width: 480, height: 48, zIndex: 2 },
      },
    ],
  };
}
