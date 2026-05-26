import { cn } from "@/lib/utils";
import type { NodeRenderContext } from "@/visual-editor/registry/types";

const VARIANT_CLASSES = {
  body: "text-base font-body",
  h1: "text-3xl sm:text-4xl font-serif font-semibold",
  h2: "text-2xl sm:text-3xl font-serif font-semibold",
  h3: "text-xl sm:text-2xl font-serif font-medium",
};

export function TextNodeContent({ ctx }: { ctx: NodeRenderContext }) {
  const { text = "", variant = "body", className = "" } = ctx.node.props;
  const isEditing = ctx.mode === "edit" && ctx.inlineEditingId === ctx.node.id;
  const Tag = variant === "body" ? "p" : variant;

  if (isEditing) {
    return (
      <Tag
        className={cn(VARIANT_CLASSES[variant], className, "outline-none ring-2 ring-accent/50 rounded-sm")}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => ctx.onTextChange?.(e.currentTarget.textContent ?? "")}
        onBlur={() => ctx.onEndInlineEdit?.()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {text}
      </Tag>
    );
  }

  return <Tag className={cn(VARIANT_CLASSES[variant], className)}>{text}</Tag>;
}
