import { GoldDashItem } from "@/components/GoldDashItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";
import { Link } from "react-router-dom";

export function GoldDashNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { text = "" } = ctx.node.props;
  const isEditing = ctx.mode === "edit" && ctx.inlineEditingId === ctx.node.id;

  if (isEditing) {
    return (
      <GoldDashItem>
        <span
          className="outline-none ring-2 ring-accent/50 rounded-sm block"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => ctx.onTextChange?.(e.currentTarget.textContent ?? "")}
          onBlur={() => ctx.onEndInlineEdit?.()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {text}
        </span>
      </GoldDashItem>
    );
  }

  return (
    <GoldDashItem>
      <span>{text}</span>
    </GoldDashItem>
  );
}

export function ServiceRowNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { title = "Service", description = "", href = "/advisory" } = ctx.node.props;
  const external = String(href).startsWith("http");

  const inner = (
    <div className="group flex flex-col gap-2 border-b border-border py-6 transition hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{title}</h3>
        {description ? <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <span className="font-body text-xs uppercase tracking-wider text-accent">→</span>
    </div>
  );

  if (ctx.mode === "preview") {
    if (external) {
      return (
        <a href={String(href)} target="_blank" rel="noreferrer" className="block no-underline">
          {inner}
        </a>
      );
    }
    return (
      <Link to={String(href)} className="block no-underline">
        {inner}
      </Link>
    );
  }

  return inner;
}

export function CtaStripNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { title = "", buttonLabel = "Get started", href = "/apply" } = ctx.node.props;
  const external = String(href).startsWith("http");

  const btn = (
    <Button variant="gold" tabIndex={ctx.mode === "edit" ? -1 : 0}>
      {buttonLabel}
    </Button>
  );

  return (
    <section className={cn("w-full bg-navy py-12 md:py-16")}>
      <div className="container flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        {title ? <h2 className="font-serif text-2xl text-white md:text-3xl">{title}</h2> : null}
        {ctx.mode === "preview" ? (
          external ? (
            <a href={String(href)} target="_blank" rel="noreferrer">
              {btn}
            </a>
          ) : (
            <Link to={String(href)}>{btn}</Link>
          )
        ) : (
          btn
        )}
      </div>
    </section>
  );
}
