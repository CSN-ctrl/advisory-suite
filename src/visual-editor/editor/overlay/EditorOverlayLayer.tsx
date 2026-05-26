import { createPortal } from "react-dom";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { useOverlayRects } from "@/visual-editor/editor/overlay/use-overlay-rects";
import { FloatingToolbar } from "@/visual-editor/editor/overlay/FloatingToolbar";
import { ResizeHandles } from "@/visual-editor/editor/overlay/ResizeHandles";
import { cn } from "@/lib/utils";

interface EditorOverlayLayerProps {
  canvasRoot: HTMLElement | null;
  snapGuides?: { orientation: "h" | "v"; position: number }[];
}

export function EditorOverlayLayer({ canvasRoot, snapGuides = [] }: EditorOverlayLayerProps) {
  const mode = useEditorStore((s) => s.mode);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);

  const trackIds = [...new Set([...selectedIds, ...(hoveredId ? [hoveredId] : [])])];
  const { rects } = useOverlayRects(trackIds, canvasRoot);

  if (mode !== "edit" || typeof document === "undefined") return null;

  const selectedRects = rects.filter((r) => selectedIds.includes(r.id));
  const hoverRect = hoveredId && !selectedIds.includes(hoveredId) ? rects.find((r) => r.id === hoveredId) : null;
  const primary = selectedRects[0];

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden={false}>
      {hoverRect ? (
        <div
          className="pointer-events-none absolute border border-dashed border-accent/50 bg-accent/5"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      ) : null}

      {selectedRects.map((r) => (
        <div
          key={r.id}
          className={cn(
            "pointer-events-none absolute border-2 border-accent shadow-[0_0_0_1px_hsl(var(--background))]",
          )}
          style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
        />
      ))}

      {snapGuides.map((g, i) =>
        g.orientation === "v" ? (
          <div
            key={`v-${i}`}
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-accent"
            style={{ left: g.position, height: "100vh" }}
          />
        ) : (
          <div
            key={`h-${i}`}
            className="pointer-events-none absolute left-0 right-0 h-px bg-accent"
            style={{ top: g.position, width: "100vw" }}
          />
        ),
      )}

      {primary && selectedIds.length === 1 ? (
        <>
          <ResizeHandles rect={primary} nodeId={primary.id} />
          <FloatingToolbar rect={primary} />
        </>
      ) : null}
    </div>,
    document.body,
  );
}
