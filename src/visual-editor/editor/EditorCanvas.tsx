import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PageRenderer } from "@/visual-editor/renderer/PageRenderer";
import { EditorOverlayLayer } from "@/visual-editor/editor/overlay/EditorOverlayLayer";
import { EditorInteractionGuard } from "@/visual-editor/editor/EditorInteractionGuard";
import { useEditorStore, VIEWPORT_WIDTHS } from "@/visual-editor/store/editor-store";
import { findDefaultDropParent } from "@/visual-editor/lib/tree-ops";
import type { DropZoneData } from "@/visual-editor/editor/dnd/VisualEditorDndContext";
import { cn } from "@/lib/utils";

function CanvasDropTarget() {
  const dropParent = useEditorStore((s) => {
    const pid = findDefaultDropParent(s.root);
    const p = s.root.children?.find((c) => c.id === pid) ?? s.root.children?.[0];
    return { parentId: pid, index: p?.children?.length ?? 0 };
  });
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-main-drop",
    data: {
      kind: "dropzone",
      parentId: dropParent.parentId,
      index: dropParent.index,
    } satisfies DropZoneData,
  });

  return (
    <div
      ref={setNodeRef}
      data-visual-editor-chrome
      className={cn(
        "pointer-events-auto absolute inset-x-4 bottom-4 z-10 rounded-md border border-dashed border-transparent py-8 text-center text-xs text-muted-foreground",
        isOver && "border-accent bg-accent/10 text-accent",
      )}
    >
      Drop components here
    </div>
  );
}

export function EditorCanvas() {
  const mode = useEditorStore((s) => s.mode);
  const viewport = useEditorStore((s) => s.viewport);
  const root = useEditorStore((s) => s.root);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLElement | null>(null);

  const width = VIEWPORT_WIDTHS[viewport];

  return (
    <div className="relative min-h-0 flex-1 overflow-auto bg-muted/40 p-6">
      <div
        className="mx-auto transition-[width] duration-200"
        style={{ width: mode === "preview" ? width : width }}
      >
        <div
          ref={(el) => {
            canvasRef.current = el;
            setCanvasEl(el);
          }}
          className={cn(
            "relative min-h-[480px] overflow-hidden rounded-lg border border-border bg-background shadow-lg",
            mode === "edit" && "visual-editor-canvas",
          )}
          data-visual-editor-canvas
        >
          <PageRenderer root={root} mode={mode} />
          {mode === "edit" ? <CanvasDropTarget /> : null}
        </div>
      </div>
      {mode === "edit" ? (
        <>
          <EditorInteractionGuard canvasRef={canvasRef} />
          <EditorOverlayLayer canvasRoot={canvasEl} />
        </>
      ) : null}
    </div>
  );
}
