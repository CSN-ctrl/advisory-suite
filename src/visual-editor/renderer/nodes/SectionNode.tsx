import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";
import { layoutToStyle } from "@/visual-editor/renderer/layout-style";

export function SectionNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { className = "", padding, layout } = ctx.node.props;
  return (
    <section className={cn("w-full", className)} style={{ padding, ...layoutToStyle(layout) }}>
      {ctx.children}
    </section>
  );
}
