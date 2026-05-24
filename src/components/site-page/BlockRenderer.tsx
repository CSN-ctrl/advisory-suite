import type { PageBlock } from "@/lib/site-page-blocks";
import { sanitizeRichHtml } from "@/lib/rich-text-html";
import { cn } from "@/lib/utils";

export function BlockRenderer({ blocks, className }: { blocks: PageBlock[]; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockItem({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") || "h2";
      return (
        <Tag className="font-serif text-foreground tracking-tight">
          {block.text}
        </Tag>
      );
    }
    case "richText":
      return (
        <div
          className="rich-html-content max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(block.html) }}
        />
      );
    case "image":
      return (
        <figure className="mx-auto max-w-4xl">
          <img
            src={block.src}
            alt={block.alt ?? ""}
            className="max-h-[min(560px,80vh)] w-auto max-w-full rounded-md border border-border object-contain"
            loading="lazy"
          />
          {block.alt ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.alt}</figcaption>
          ) : null}
        </figure>
      );
    case "spacer":
      return <div aria-hidden className="w-full" style={{ height: block.heightPx }} />;
    case "divider":
      return <hr className="border-border" />;
    default:
      return null;
  }
}
