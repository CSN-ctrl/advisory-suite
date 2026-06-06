import type { CSSProperties } from "react";
import type { CanvasDocument, CanvasElement, CanvasStyle } from "@/lib/canvas-document";

export type MarketingBlockLayout = {
  order: number;
  hidden: boolean;
  style: CSSProperties;
};

/** Styles from the canvas inspector that apply to the live block wrapper (not overlay geometry). */
const LIVE_BLOCK_STYLE_KEYS: (keyof CanvasStyle)[] = [
  "padding",
  "backgroundColor",
  "borderRadius",
  "border",
  "margin",
];

function isElementHidden(el: CanvasElement): boolean {
  if (el.hidden === true) return true;
  return String(el.style.display ?? "") === "none";
}

function liveStyleFromElement(el: CanvasElement): CSSProperties {
  const style: CSSProperties = {};
  for (const key of LIVE_BLOCK_STYLE_KEYS) {
    const value = el.style[key as keyof CanvasStyle];
    if (value != null && value !== "") {
      (style as Record<string, string>)[key] = String(value);
    }
  }
  return style;
}

/** Build public-site layout config from a blocks-mode marketing canvas document. */
export function buildMarketingBlockLayout(document: CanvasDocument): Map<string, MarketingBlockLayout> {
  const blockElements = document.elements
    .filter((e) => e.blockId)
    .slice()
    .sort((a, b) => {
      const dy = a.position.y - b.position.y;
      if (Math.abs(dy) > 16) return dy;
      return (a.position.zIndex ?? 0) - (b.position.zIndex ?? 0);
    });

  const map = new Map<string, MarketingBlockLayout>();
  blockElements.forEach((el, index) => {
    if (!el.blockId) return;
    map.set(el.blockId, {
      order: index,
      hidden: isElementHidden(el),
      style: liveStyleFromElement(el),
    });
  });
  return map;
}

export function marketingBlocksLayoutIsActive(document: CanvasDocument): boolean {
  return document.layoutMode === "blocks" && document.elements.some((e) => e.blockId);
}
