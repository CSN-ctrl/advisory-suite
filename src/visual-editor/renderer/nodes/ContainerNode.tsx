import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";
import { layoutToStyle } from "@/visual-editor/renderer/layout-style";

export function ContainerNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { className = "", gap = "1rem", padding, layout } = ctx.node.props;
  return (
    <div
      className={cn("flex flex-col rounded-lg border border-border bg-card/50", className)}
      style={{ gap, padding, ...layoutToStyle(layout) }}
    >
      {ctx.children}
    </div>
  );
}
