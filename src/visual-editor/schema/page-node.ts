/** Tree-based page document for the visual DOM editor (stored in site_pages.blocks). */

export const PAGE_NODE_TYPES = [
  "page",
  "section",
  "container",
  "text",
  "button",
  "image",
  "divider",
  "spacer",
  "goldDash",
  "serviceRow",
  "ctaStrip",
] as const;
export type PageNodeType = (typeof PAGE_NODE_TYPES)[number];

export type NodeLayout = {
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  padding?: string;
  alignSelf?: "start" | "center" | "end" | "stretch";
};

export type PageNodeProps = {
  text?: string;
  variant?: "body" | "h1" | "h2" | "h3";
  href?: string;
  label?: string;
  src?: string;
  alt?: string;
  objectFit?: "cover" | "contain";
  height?: string | number;
  flexDirection?: "row" | "column";
  /** serviceRow */
  title?: string;
  description?: string;
  /** ctaStrip */
  buttonLabel?: string;
  className?: string;
  gap?: string;
  padding?: string;
  layout?: NodeLayout;
  [key: string]: unknown;
};

export type PageNode = {
  id: string;
  type: PageNodeType;
  props: PageNodeProps;
  children?: PageNode[];
};

export type PageDocumentV2 = {
  version: 2;
  editor: "visual-tree";
  root: PageNode;
  meta?: {
    title?: string;
    description?: string;
  };
};

export function newNodeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isPageDocumentV2(raw: unknown): raw is PageDocumentV2 {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return r.version === 2 && r.editor === "visual-tree" && r.root != null && typeof r.root === "object";
}

function normalizeNode(raw: unknown): PageNode | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const type = PAGE_NODE_TYPES.find((t) => t === r.type);
  if (!type) return null;
  const id = typeof r.id === "string" && r.id ? r.id : newNodeId();
  const props = r.props && typeof r.props === "object" ? { ...(r.props as PageNodeProps) } : {};
  const children = Array.isArray(r.children)
    ? r.children.map(normalizeNode).filter((n): n is PageNode => n != null)
    : undefined;
  return { id, type, props, children: children?.length ? children : undefined };
}

export function normalizePageDocument(raw: unknown): PageDocumentV2 {
  if (isPageDocumentV2(raw)) {
    const root = normalizeNode(raw.root);
    if (root) {
      const r = raw as PageDocumentV2;
      return {
        version: 2,
        editor: "visual-tree",
        root,
        meta: r.meta && typeof r.meta === "object" ? { ...r.meta } : undefined,
      };
    }
  }
  return createDefaultPageDocument();
}

export function createDefaultPageDocument(): PageDocumentV2 {
  const sectionId = newNodeId();
  return {
    version: 2,
    editor: "visual-tree",
    root: {
      id: newNodeId(),
      type: "page",
      props: { className: "min-h-screen bg-background" },
      children: [
        {
          id: sectionId,
          type: "section",
          props: {
            className: "container py-16 flex flex-col gap-8",
            padding: "4rem 1rem",
          },
          children: [
            {
              id: newNodeId(),
              type: "text",
              props: {
                text: "Welcome to your page",
                variant: "h1",
                className: "font-serif text-foreground",
              },
            },
            {
              id: newNodeId(),
              type: "text",
              props: {
                text: "Click to select elements. Drag components from the sidebar. Double-click text to edit inline.",
                variant: "body",
                className: "font-body text-muted-foreground max-w-xl",
              },
            },
            {
              id: newNodeId(),
              type: "button",
              props: {
                label: "Get started",
                href: "/",
                className: "",
              },
            },
          ],
        },
      ],
    },
  };
}

export function createNode(type: PageNodeType): PageNode {
  const id = newNodeId();
  switch (type) {
    case "page":
      return { id, type, props: { className: "min-h-screen bg-background" }, children: [] };
    case "section":
      return {
        id,
        type,
        props: { className: "container py-12 flex flex-col gap-6", padding: "3rem 1rem" },
        children: [],
      };
    case "container":
      return {
        id,
        type,
        props: { className: "flex flex-col gap-4 p-4 rounded-lg border border-border", gap: "1rem" },
        children: [],
      };
    case "text":
      return {
        id,
        type,
        props: { text: "New text", variant: "body", className: "font-body text-foreground" },
      };
    case "button":
      return { id, type, props: { label: "Button", href: "", className: "" } };
    case "image":
      return {
        id,
        type,
        props: {
          src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
          alt: "Image",
          objectFit: "cover",
          className: "rounded-lg w-full max-h-80 object-cover",
        },
      };
    case "divider":
      return { id, type, props: { className: "my-6 border-t border-border" } };
    case "spacer":
      return { id, type, props: { height: "2rem", className: "" } };
    case "goldDash":
      return {
        id,
        type,
        props: { text: "Key point with gold dash styling.", className: "" },
      };
    case "serviceRow":
      return {
        id,
        type,
        props: {
          title: "Service name",
          description: "Short description of the service.",
          href: "/advisory",
        },
      };
    case "ctaStrip":
      return {
        id,
        type,
        props: {
          title: "Ready to take the next step?",
          buttonLabel: "Get started",
          href: "/apply",
        },
      };
    default:
      return { id, type: "text", props: { text: "Text" } };
  }
}

export const PALETTE_NODE_TYPES: PageNodeType[] = [
  "section",
  "container",
  "text",
  "button",
  "image",
  "divider",
  "spacer",
  "goldDash",
  "serviceRow",
  "ctaStrip",
];

export const NODE_TYPE_LABELS: Record<PageNodeType, { en: string; bg: string }> = {
  page: { en: "Page", bg: "Страница" },
  section: { en: "Section", bg: "Секция" },
  container: { en: "Container", bg: "Контейнер" },
  text: { en: "Text", bg: "Текст" },
  button: { en: "Button", bg: "Бутон" },
  image: { en: "Image", bg: "Изображение" },
  divider: { en: "Divider", bg: "Разделител" },
  spacer: { en: "Spacer", bg: "Разстояние" },
  goldDash: { en: "Gold dash", bg: "Gold dash" },
  serviceRow: { en: "Service row", bg: "Ред услуга" },
  ctaStrip: { en: "CTA strip", bg: "CTA лента" },
};

export function canHaveChildren(type: PageNodeType): boolean {
  return type === "page" || type === "section" || type === "container";
}
