import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";
import { layoutToStyle } from "@/visual-editor/renderer/layout-style";

export function ContainerNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { className = "", gap = "1rem", padding, layout, flexDirection = "column" } = ctx.node.props;
  return (
    <div
      className={cn(
        "flex rounded-lg border border-border bg-card/50",
        flexDirection === "row" ? "flex-row flex-wrap items-start" : "flex-col",
        className,
      )}
      style={{ gap, padding, ...layoutToStyle(layout) }}
    >
      {ctx.children}
    </div>
  );
}
