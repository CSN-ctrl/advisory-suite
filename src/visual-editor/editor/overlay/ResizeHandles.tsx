import { useRef } from "react";
import type { OverlayRect } from "@/visual-editor/editor/overlay/use-overlay-rects";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { snapValue } from "@/visual-editor/editor/overlay/snap-utils";

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type Handle = (typeof HANDLES)[number];

interface ResizeHandlesProps {
  rect: OverlayRect;
  nodeId: string;
}

export function ResizeHandles({ rect, nodeId }: ResizeHandlesProps) {
  const updateNodeLayout = useEditorStore((s) => s.updateNodeLayout);
  const gridSize = useEditorStore((s) => s.gridSize);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);
  const dragRef = useRef<{
    handle: Handle;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { handle, startX, startY, startW, startH } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let w = startW;
    let h = startH;
    if (handle.includes("e")) w = startW + dx;
    if (handle.includes("w")) w = startW - dx;
    if (handle.includes("s")) h = startH + dy;
    if (handle.includes("n")) h = startH - dy;
    w = Math.max(40, snapValue(w, gridSize, snapEnabled));
    h = Math.max(24, snapValue(h, gridSize, snapEnabled));
    updateNodeLayout(nodeId, { width: Math.round(w), height: Math.round(h) });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const pos: Record<Handle, string> = {
    nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
    n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
    ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
    e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
    se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
    s: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
    sw: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
    w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
  };

  const handleAt = (h: Handle): { top: number; left: number } => {
    const t = rect.top;
    const l = rect.left;
    const w = rect.width;
    const hgt = rect.height;
    switch (h) {
      case "nw":
        return { top: t, left: l };
      case "n":
        return { top: t, left: l + w / 2 };
      case "ne":
        return { top: t, left: l + w };
      case "e":
        return { top: t + hgt / 2, left: l + w };
      case "se":
        return { top: t + hgt, left: l + w };
      case "s":
        return { top: t + hgt, left: l + w / 2 };
      case "sw":
        return { top: t + hgt, left: l };
      case "w":
        return { top: t + hgt / 2, left: l };
      default:
        return { top: t, left: l };
    }
  };

  return (
    <>
      {HANDLES.map((h) => {
        const { top, left } = handleAt(h);
        return (
          <div
            key={h}
            className={`pointer-events-auto fixed z-[10001] h-2.5 w-2.5 rounded-sm border border-accent bg-background ${pos[h]}`}
            style={{ top, left }}
            onPointerDown={onPointerDown(h)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        );
      })}
    </>
  );
}
