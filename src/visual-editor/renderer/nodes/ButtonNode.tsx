import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";

export function ButtonNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { label = "Button", href = "", className = "" } = ctx.node.props;
  const content = <span>{label}</span>;

  if (href && ctx.mode === "preview") {
    const external = href.startsWith("http");
    if (external) {
      return (
        <Button asChild variant="gold" className={cn(className)}>
          <a href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        </Button>
      );
    }
    return (
      <Button asChild variant="gold" className={cn(className)}>
        <Link to={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button type="button" variant="gold" className={cn(className)} tabIndex={ctx.mode === "edit" ? -1 : 0}>
      {content}
    </Button>
  );
}
