import { EditableRichText, EditableText } from "@/components/EditableText";
import type { EditableFieldBind } from "@/hooks/use-page-editing";

type TextTag = "span" | "p" | "h1" | "h2" | "h3" | "h4";

interface CmsTextProps extends EditableFieldBind {
  as?: TextTag;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

/** Renders inline CMS text with edit chrome when admin edit mode is on. */
export function CmsText({ multiline, as = "span", className, rows, ...bind }: CmsTextProps) {
  if (multiline) {
    return (
      <EditableRichText
        multiline
        as={as === "span" ? "p" : as}
        rows={rows}
        className={className}
        {...bind}
      />
    );
  }
  return <EditableText as={as} className={className} {...bind} />;
}
