import type { ReactNode } from "react";
import { CanvasBlock } from "@/components/page-editor/CanvasBlock";
import { useMarketingLayoutOptional } from "@/contexts/MarketingLayoutContext";

interface MarketingAutoSectionProps {
  /** Matches canvas scan id: `{contentPage}-section-{index}` */
  index: number;
  label?: string;
  className?: string;
  children: ReactNode;
}

/** Wraps a marketing section so canvas layout editor can reorder/hide/style it on the live site. */
export function MarketingAutoSection({ index, label, className, children }: MarketingAutoSectionProps) {
  const ctx = useMarketingLayoutOptional();
  const contentPage = ctx?.contentPage ?? "page";
  const blockId = `${contentPage}-section-${index}`;

  return (
    <CanvasBlock blockId={blockId} label={label ?? blockId} className={className}>
      {children}
    </CanvasBlock>
  );
}
