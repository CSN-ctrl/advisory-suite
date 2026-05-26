import type { NodeLayout } from "@/visual-editor/schema/page-node";

export function layoutToStyle(layout?: NodeLayout): React.CSSProperties {
  if (!layout) return {};
  const style: React.CSSProperties = {};
  if (layout.width != null) style.width = typeof layout.width === "number" ? `${layout.width}px` : layout.width;
  if (layout.height != null) style.height = typeof layout.height === "number" ? `${layout.height}px` : layout.height;
  if (layout.minHeight != null) {
    style.minHeight = typeof layout.minHeight === "number" ? `${layout.minHeight}px` : layout.minHeight;
  }
  if (layout.alignSelf) style.alignSelf = layout.alignSelf;
  return style;
}
