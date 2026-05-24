import type { PageBlock } from "@/lib/site-page-blocks";
import { sanitizeRichHtml } from "@/lib/rich-text-html";
import { cn } from "@/lib/utils";

const HEADING_CLASSES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-2xl font-semibold sm:text-3xl md:text-4xl",
  2: "text-xl font-semibold sm:text-2xl md:text-3xl",
  3: "text-lg font-semibold sm:text-xl md:text-2xl",
  4: "text-base font-semibold sm:text-lg md:text-xl",
  5: "text-sm font-semibold sm:text-base md:text-lg",
  6: "text-sm font-medium sm:text-base",
};

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
        <Tag className={cn("font-serif text-foreground tracking-tight break-words", HEADING_CLASSES[block.level])}>
          {block.text}
        </Tag>
      );
    }
    case "richText":
      return (
        <div
          className="rich-html-content max-w-none min-w-0 overflow-x-auto break-words text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(block.html) }}
        />
      );
    case "image":
      return (
        <figure className="mx-auto max-w-4xl min-w-0">
          <img
            src={block.src}
            alt={block.alt ?? ""}
            className="max-h-[min(560px,70vh)] w-full max-w-full rounded-md border border-border object-contain sm:max-h-[min(560px,80vh)] sm:w-auto"
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
