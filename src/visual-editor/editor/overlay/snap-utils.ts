import type { OverlayRect } from "@/visual-editor/editor/overlay/use-overlay-rects";

export type SnapGuide = { orientation: "h" | "v"; position: number };

export function snapValue(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
}

export function computeSnapGuides(
  moving: OverlayRect,
  others: OverlayRect[],
  threshold = 6,
): { guides: SnapGuide[]; snapX: number | null; snapY: number | null } {
  const guides: SnapGuide[] = [];
  let snapX: number | null = null;
  let snapY: number | null = null;

  const edges = {
    left: moving.left,
    right: moving.left + moving.width,
    hCenter: moving.left + moving.width / 2,
    top: moving.top,
    bottom: moving.top + moving.height,
    vCenter: moving.top + moving.height / 2,
  };

  for (const o of others) {
    if (o.id === moving.id) continue;
    const oEdges = {
      left: o.left,
      right: o.left + o.width,
      hCenter: o.left + o.width / 2,
      top: o.top,
      bottom: o.top + o.height,
      vCenter: o.top + o.height / 2,
    };

    const xPairs: [number, number, "v"][] = [
      [edges.left, oEdges.left, "v"],
      [edges.left, oEdges.right, "v"],
      [edges.right, oEdges.left, "v"],
      [edges.right, oEdges.right, "v"],
      [edges.hCenter, oEdges.hCenter, "v"],
    ];
    for (const [a, b, orient] of xPairs) {
      if (Math.abs(a - b) <= threshold) {
        guides.push({ orientation: orient, position: b });
        snapX = b - (a - moving.left);
      }
    }

    const yPairs: [number, number, "h"][] = [
      [edges.top, oEdges.top, "h"],
      [edges.top, oEdges.bottom, "h"],
      [edges.bottom, oEdges.top, "h"],
      [edges.bottom, oEdges.bottom, "h"],
      [edges.vCenter, oEdges.vCenter, "h"],
    ];
    for (const [a, b, orient] of yPairs) {
      if (Math.abs(a - b) <= threshold) {
        guides.push({ orientation: orient, position: b });
        snapY = b - (a - moving.top);
      }
    }
  }

  return { guides, snapX, snapY };
}
