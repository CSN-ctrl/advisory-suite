import { useCallback, useEffect, useState } from "react";
import { getDomNode } from "@/visual-editor/store/dom-registry";

export type OverlayRect = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

export function useOverlayRects(nodeIds: string[], canvasRoot: HTMLElement | null) {
  const [rects, setRects] = useState<OverlayRect[]>([]);

  const measure = useCallback(() => {
    const next: OverlayRect[] = [];
    for (const id of nodeIds) {
      const el = getDomNode(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next.push({ id, top: r.top, left: r.left, width: r.width, height: r.height });
    }
    setRects(next);
  }, [nodeIds]);

  useEffect(() => {
    measure();
    if (!canvasRoot) return;

    const ro = new ResizeObserver(measure);
    ro.observe(canvasRoot);
    for (const id of nodeIds) {
      const el = getDomNode(id);
      if (el) ro.observe(el);
    }

    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [canvasRoot, measure, nodeIds]);

  return { rects, remeasure: measure };
}
