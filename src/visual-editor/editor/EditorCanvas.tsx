import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PageRenderer } from "@/visual-editor/renderer/PageRenderer";
import { EditorOverlayLayer } from "@/visual-editor/editor/overlay/EditorOverlayLayer";
import { EditorInteractionGuard } from "@/visual-editor/editor/EditorInteractionGuard";
import { useEditorStore, VIEWPORT_WIDTHS } from "@/visual-editor/store/editor-store";
import { findDefaultDropParent } from "@/visual-editor/lib/tree-ops";
import type { DropZoneData } from "@/visual-editor/editor/dnd/VisualEditorDndContext";
import { cn } from "@/lib/utils";

function CanvasDropTarget({ locale }: { locale: string }) {
  const isBg = locale === "bg";
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
        "pointer-events-auto absolute inset-x-6 bottom-6 z-10 rounded-lg border border-dashed border-transparent py-6 text-center text-xs text-muted-foreground transition-colors",
        isOver && "border-accent bg-accent/10 text-accent",
      )}
    >
      {isBg ? "Пуснете компонент тук" : "Drop component here"}
    </div>
  );
}

interface EditorCanvasProps {
  locale?: string;
}

export function EditorCanvas({ locale = "en" }: EditorCanvasProps) {
  const mode = useEditorStore((s) => s.mode);
  const viewport = useEditorStore((s) => s.viewport);
  const root = useEditorStore((s) => s.root);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLElement | null>(null);

  const width = VIEWPORT_WIDTHS[viewport];
  const isBg = locale === "bg";

  return (
    <div className="relative min-h-0 flex-1 overflow-auto bg-muted/40 p-6">
      <div className="mb-2 text-center font-body text-[10px] uppercase tracking-wider text-muted-foreground">
        {viewport} · {width}px
      </div>
      <div className="mx-auto transition-[width] duration-200" style={{ width }}>
        <div
          ref={(el) => {
            canvasRef.current = el;
            setCanvasEl(el);
          }}
          className={cn(
            "relative min-h-[520px] overflow-hidden rounded-lg border border-border bg-background shadow-xl ring-1 ring-black/5",
            mode === "edit" && "visual-editor-canvas",
          )}
          data-visual-editor-canvas
        >
          <PageRenderer root={root} mode={mode} />
          {mode === "edit" ? <CanvasDropTarget locale={locale} /> : null}
        </div>
      </div>
      {mode === "edit" ? (
        <p className="mt-3 text-center font-body text-[11px] text-muted-foreground">
          {isBg
            ? "Двоен клик за текст · ⌘Z отмяна · ⌘S запазване · Delete"
            : "Double-click text · ⌘Z undo · ⌘S save · Delete"}
        </p>
      ) : null}
      {mode === "edit" ? (
        <>
          <EditorInteractionGuard canvasRef={canvasRef} />
          <EditorOverlayLayer canvasRoot={canvasEl} />
        </>
      ) : null}
    </div>
  );
}
