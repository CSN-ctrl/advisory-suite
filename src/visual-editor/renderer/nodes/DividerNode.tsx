import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";

export function DividerNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { className = "" } = ctx.node.props;
  return <hr className={cn("w-full border-border", className || "my-4 border-t")} aria-hidden />;
}
