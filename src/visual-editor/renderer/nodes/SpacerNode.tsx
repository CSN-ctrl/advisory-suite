import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";

export function SpacerNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { className = "", height = "2rem" } = ctx.node.props;
  return (
    <div
      aria-hidden
      className={cn("w-full", className, ctx.mode === "edit" && "rounded-sm border border-dashed border-border/60 bg-muted/20")}
      style={{ height: String(height) }}
    />
  );
}
