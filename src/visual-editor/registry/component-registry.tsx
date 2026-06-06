import { canHaveChildren, NODE_TYPE_LABELS, type PageNodeType } from "@/visual-editor/schema/page-node";
import type { NodeRegistryEntry } from "@/visual-editor/registry/types";
import { TextNodeContent } from "@/visual-editor/renderer/nodes/TextNode";
import { ButtonNodeContent } from "@/visual-editor/renderer/nodes/ButtonNode";
import { ImageNodeContent } from "@/visual-editor/renderer/nodes/ImageNode";
import { ContainerNodeContent } from "@/visual-editor/renderer/nodes/ContainerNode";
import { SectionNodeContent } from "@/visual-editor/renderer/nodes/SectionNode";
import { DividerNodeContent } from "@/visual-editor/renderer/nodes/DividerNode";
import { SpacerNodeContent } from "@/visual-editor/renderer/nodes/SpacerNode";

const entries: Record<PageNodeType, NodeRegistryEntry> = {
  page: {
    type: "page",
    defaultProps: { className: "min-h-screen bg-background" },
    paletteLabel: NODE_TYPE_LABELS.page,
    canHaveChildren: true,
    render: (ctx) => (
      <div className={ctx.node.props.className as string} style={{ minHeight: "100%" }}>
        {ctx.children}
      </div>
    ),
  },
  section: {
    type: "section",
    defaultProps: { className: "container py-12 flex flex-col gap-6" },
    paletteLabel: NODE_TYPE_LABELS.section,
    canHaveChildren: true,
    render: (ctx) => <SectionNodeContent ctx={ctx} />,
  },
  container: {
    type: "container",
    defaultProps: { className: "flex flex-col gap-4 p-4", gap: "1rem" },
    paletteLabel: NODE_TYPE_LABELS.container,
    canHaveChildren: true,
    render: (ctx) => <ContainerNodeContent ctx={ctx} />,
  },
  text: {
    type: "text",
    defaultProps: { text: "Text", variant: "body", className: "font-body" },
    paletteLabel: NODE_TYPE_LABELS.text,
    canHaveChildren: false,
    render: (ctx) => <TextNodeContent ctx={ctx} />,
  },
  button: {
    type: "button",
    defaultProps: { label: "Button", href: "" },
    paletteLabel: NODE_TYPE_LABELS.button,
    canHaveChildren: false,
    render: (ctx) => <ButtonNodeContent ctx={ctx} />,
  },
  image: {
    type: "image",
    defaultProps: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      alt: "Image",
      objectFit: "cover",
    },
    paletteLabel: NODE_TYPE_LABELS.image,
    canHaveChildren: false,
    render: (ctx) => <ImageNodeContent ctx={ctx} />,
  },
  divider: {
    type: "divider",
    defaultProps: { className: "my-6 border-t border-border" },
    paletteLabel: NODE_TYPE_LABELS.divider,
    canHaveChildren: false,
    render: (ctx) => <DividerNodeContent ctx={ctx} />,
  },
  spacer: {
    type: "spacer",
    defaultProps: { height: "2rem", className: "" },
    paletteLabel: NODE_TYPE_LABELS.spacer,
    canHaveChildren: false,
    render: (ctx) => <SpacerNodeContent ctx={ctx} />,
  },
};

export function getRegistryEntry(type: PageNodeType): NodeRegistryEntry {
  return entries[type];
}

export function getAllRegistryEntries(): NodeRegistryEntry[] {
  return Object.values(entries);
}

export { canHaveChildren };
