import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";

export function ImageNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { src = "", alt = "", objectFit = "cover", className = "", layout } = ctx.node.props;
  const style: React.CSSProperties = {};
  if (layout?.width != null) style.width = typeof layout.width === "number" ? `${layout.width}px` : layout.width;
  if (layout?.height != null) style.height = typeof layout.height === "number" ? `${layout.height}px` : layout.height;

  return (
    <img
      src={src}
      alt={alt}
      className={cn("max-w-full", objectFit === "cover" ? "object-cover" : "object-contain", className)}
      style={style}
      loading="lazy"
      draggable={false}
    />
  );
}
