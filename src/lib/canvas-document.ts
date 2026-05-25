/** Visual page builder document stored in `site_pages.blocks` (JSON, not raw HTML). */

export type CanvasStyle = {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  padding?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
  display?: "block" | "flex";
  flexDirection?: "row" | "column";
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  lineHeight?: string;
};

export type CanvasPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
};

export type CanvasContentBinding = {
  page: string;
  section: string;
  key: string;
};

export type CanvasElementType = "text" | "heading" | "image" | "button" | "box" | "card";

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  content: string;
  style: CanvasStyle;
  position: CanvasPosition;
  /** Stable id matching `data-canvas-block` on the live page. */
  blockId?: string;
  label?: string;
  binding?: CanvasContentBinding;
};

/** `blocks` = WYSIWYG over React page; `canvas` = full JSON canvas on the public site. */
export type CanvasLayoutMode = "blocks" | "canvas";

export type CanvasDocument = {
  version: 1;
  editor: "canvas";
  layoutMode?: CanvasLayoutMode;
  canvas: { width: number; height: number };
  elements: CanvasElement[];
};

/** Public site renders saved JSON canvas (not the legacy React page). */
export function documentUsesCanvasRenderer(doc: CanvasDocument): boolean {
  if (doc.layoutMode === "blocks") return false;
  if (doc.layoutMode === "canvas") return true;
  if (doc.elements.length === 0) return false;
  return doc.elements.some((e) => !e.blockId);
}

export function newElementId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `el_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const DEFAULT_CANVAS_SIZE = { width: 1200, height: 1600 };

export function createDefaultDocument(): CanvasDocument {
  const id = newElementId();
  return {
    version: 1,
    editor: "canvas",
    canvas: { ...DEFAULT_CANVAS_SIZE },
    elements: [
      {
        id,
        type: "heading",
        content: "Page title",
        style: {
          fontSize: "42px",
          fontWeight: "600",
          color: "hsl(var(--foreground))",
          textAlign: "left",
        },
        position: { x: 80, y: 80, width: 600, height: 56, zIndex: 1 },
      },
      {
        id: newElementId(),
        type: "text",
        content: "Click to edit. Drag to move. Use the inspector to change styles.",
        style: {
          fontSize: "18px",
          color: "hsl(var(--muted-foreground))",
          lineHeight: "1.6",
        },
        position: { x: 80, y: 160, width: 520, height: 120, zIndex: 2 },
      },
    ],
  };
}

export function isCanvasDocument(raw: unknown): raw is CanvasDocument {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return r.version === 1 && r.editor === "canvas" && Array.isArray(r.elements);
}

export function normalizeCanvasDocument(raw: unknown): CanvasDocument {
  if (isCanvasDocument(raw)) {
    return {
      ...raw,
      layoutMode: raw.layoutMode,
      canvas: {
        width: Math.max(400, raw.canvas?.width ?? DEFAULT_CANVAS_SIZE.width),
        height: Math.max(400, raw.canvas?.height ?? DEFAULT_CANVAS_SIZE.height),
      },
      elements: raw.elements.map(normalizeElement),
    };
  }
  return createDefaultDocument();
}

function normalizeElement(el: CanvasElement): CanvasElement {
  const pos = el.position ?? { x: 0, y: 0, width: 200, height: 48 };
  return {
    id: el.id || newElementId(),
    type: el.type ?? "text",
    content: typeof el.content === "string" ? el.content : "",
    blockId: typeof el.blockId === "string" ? el.blockId : undefined,
    label: typeof el.label === "string" ? el.label : undefined,
    binding: el.binding,
    style: { ...el.style },
    position: {
      x: Number(pos.x) || 0,
      y: Number(pos.y) || 0,
      width: Math.max(40, Number(pos.width) || 200),
      height: Math.max(24, Number(pos.height) || 48),
      zIndex: pos.zIndex ?? 1,
    },
  };
}

export function createElement(type: CanvasElementType): CanvasElement {
  const defaults: Record<CanvasElementType, Partial<CanvasElement>> = {
    text: {
      content: "New text",
      style: { fontSize: "16px", color: "hsl(var(--foreground))" },
      position: { x: 100, y: 100, width: 280, height: 64, zIndex: 10 },
    },
    heading: {
      content: "Heading",
      style: { fontSize: "32px", fontWeight: "600", color: "hsl(var(--foreground))" },
      position: { x: 100, y: 100, width: 400, height: 48, zIndex: 10 },
    },
    image: {
      content: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      style: { borderRadius: "8px" },
      position: { x: 100, y: 100, width: 320, height: 200, zIndex: 10 },
    },
    button: {
      content: "Learn more",
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "hsl(var(--accent-foreground))",
        backgroundColor: "hsl(var(--accent))",
        textAlign: "center",
        padding: "12px 24px",
        borderRadius: "6px",
      },
      position: { x: 100, y: 100, width: 160, height: 48, zIndex: 10 },
    },
    box: {
      content: "",
      style: {
        backgroundColor: "hsl(var(--secondary))",
        borderRadius: "8px",
        border: "1px solid hsl(var(--border))",
      },
      position: { x: 100, y: 100, width: 300, height: 160, zIndex: 10 },
    },
    card: {
      content: "Card",
      style: {
        backgroundColor: "hsl(var(--card))",
        borderRadius: "8px",
        border: "1px solid hsl(var(--border))",
      },
      position: { x: 100, y: 100, width: 280, height: 200, zIndex: 10 },
    },
  };
  const base = defaults[type];
  return {
    id: newElementId(),
    type,
    content: base.content ?? "",
    style: base.style ?? {},
    position: base.position as CanvasPosition,
  };
}

export const ELEMENT_LABELS: Record<CanvasElementType, { en: string; bg: string }> = {
  text: { en: "Text", bg: "Текст" },
  heading: { en: "Heading", bg: "Заглавие" },
  image: { en: "Image", bg: "Изображение" },
  button: { en: "Button", bg: "Бутон" },
  box: { en: "Box", bg: "Кутия" },
  card: { en: "Card", bg: "Карта" },
};

export function styleToCss(style: CanvasStyle): Record<string, string | number | undefined> {
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    backgroundColor: style.backgroundColor,
    textAlign: style.textAlign,
    padding: style.padding,
    borderRadius: style.borderRadius,
    border: style.border,
    width: style.width ?? "100%",
    height: style.height ?? "100%",
    display: style.display,
    flexDirection: style.flexDirection,
    gap: style.gap,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    lineHeight: style.lineHeight,
    boxSizing: "border-box",
  };
}

export function styleToInline(style: CanvasStyle): Record<string, string | number | undefined> {
  return styleToCss(style);
}
