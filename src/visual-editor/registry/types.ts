import type { ReactNode } from "react";
import type { PageNode, PageNodeProps, PageNodeType } from "@/visual-editor/schema/page-node";

export type NodeRenderContext = {
  node: PageNode;
  children?: ReactNode;
  registerRef: (el: HTMLElement | null) => void;
  mode: "edit" | "preview";
  inlineEditingId: string | null;
  onTextChange?: (text: string) => void;
  onEndInlineEdit?: () => void;
};

export type NodeRegistryEntry = {
  type: PageNodeType;
  defaultProps: PageNodeProps;
  paletteLabel: { en: string; bg: string };
  canHaveChildren: boolean;
  render: (ctx: NodeRenderContext) => ReactNode;
};
