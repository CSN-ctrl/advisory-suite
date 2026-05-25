import { newElementId, type CanvasDocument, type CanvasElement } from "@/lib/canvas-document";

function el(
  partial: Omit<CanvasElement, "id"> & { id?: string },
): CanvasElement {
  return {
    id: partial.id ?? newElementId(),
    type: partial.type,
    content: partial.content,
    style: partial.style ?? {},
    position: partial.position,
    blockId: partial.blockId,
    label: partial.label,
    binding: partial.binding,
  };
}

function stackSection(
  contentPage: string,
  index: number,
  label: string,
  y: number,
  height: number,
): CanvasElement {
  return el({
    blockId: `${contentPage}-section-${index}`,
    label,
    type: "box",
    content: label,
    style: {
      backgroundColor: "hsl(var(--secondary) / 0.5)",
      borderRadius: "12px",
      border: "1px solid hsl(var(--border))",
    },
    position: { x: 48, y, width: 1104, height, zIndex: 10 + index },
  });
}

const templateBuilders: Record<string, (title: string, contentPage: string) => CanvasElement[]> = {
  home: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "48px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 64, width: 700, height: 64, zIndex: 1 },
    }),
    el({
      blockId: `${cp}-hero`,
      label: "Hero",
      type: "text",
      content: "Hero slider — edit or replace in canvas.",
      style: { fontSize: "16px", color: "hsl(var(--muted-foreground))" },
      position: { x: 80, y: 160, width: 520, height: 48, zIndex: 2 },
    }),
    stackSection(cp, 1, "Approach", 280, 320),
    stackSection(cp, 2, "Services", 640, 400),
    stackSection(cp, 3, "Insights", 1080, 280),
    stackSection(cp, 4, "Newsletter", 1400, 200),
  ],
  mission: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 600, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Intro", 160, 280),
    stackSection(cp, 2, "Positioning", 480, 240),
    stackSection(cp, 3, "Process", 760, 320),
  ],
  advisory: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 600, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Services intro", 160, 200),
    stackSection(cp, 2, "Service cards", 400, 480),
  ],
  applications: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 640, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Applications content", 160, 520),
  ],
  who_benefits: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 640, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Audience sections", 160, 560),
  ],
  insights: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 500, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Article list", 160, 640),
  ],
  apply: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "42px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 500, height: 56, zIndex: 1 },
    }),
    stackSection(cp, 1, "Booking / apply form", 160, 480),
  ],
  insight_article: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "36px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 56, width: 800, height: 48, zIndex: 1 },
    }),
    stackSection(cp, 1, "Article body", 140, 720),
  ],
  not_found: (title, cp) => [
    el({
      type: "heading",
      content: title,
      style: { fontSize: "32px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 80, y: 120, width: 500, height: 48, zIndex: 1 },
    }),
    el({
      type: "button",
      content: "Back home",
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "hsl(var(--accent-foreground))",
        backgroundColor: "hsl(var(--accent))",
        textAlign: "center",
        padding: "12px 24px",
        borderRadius: "6px",
      },
      position: { x: 80, y: 200, width: 160, height: 48, zIndex: 2 },
    }),
  ],
};

export const MARKETING_CONTENT_PAGES = [
  "home",
  "mission",
  "advisory",
  "applications",
  "who_benefits",
  "insights",
  "apply",
  "insight_article",
  "not_found",
] as const;

export type MarketingContentPage = (typeof MARKETING_CONTENT_PAGES)[number];

export function createMarketingLayoutDocument(contentPage: string, title: string): CanvasDocument {
  const builder = templateBuilders[contentPage] ?? templateBuilders.home;
  const elements = builder(title, contentPage);
  const maxY = elements.reduce((m, e) => Math.max(m, e.position.y + e.position.height), 0);

  return {
    version: 1,
    editor: "canvas",
    layoutMode: "blocks",
    canvas: { width: 1200, height: Math.max(1600, maxY + 120) },
    elements,
  };
}

/** Empty blocks layout — filled by scanning the live page in the canvas editor. */
export function createEmptyBlocksLayoutDocument(): CanvasDocument {
  return {
    version: 1,
    editor: "canvas",
    layoutMode: "blocks",
    canvas: { width: 1200, height: 800 },
    elements: [],
  };
}
