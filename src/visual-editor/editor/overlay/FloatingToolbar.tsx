import { useDraggable } from "@dnd-kit/core";
import { ArrowDown, ArrowUp, Copy, GripVertical, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OverlayRect } from "@/visual-editor/editor/overlay/use-overlay-rects";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { findNode } from "@/visual-editor/lib/tree-ops";
import type { NodeDragData } from "@/visual-editor/editor/dnd/VisualEditorDndContext";

interface FloatingToolbarProps {
  rect: OverlayRect;
}

export function FloatingToolbar({ rect }: FloatingToolbarProps) {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const root = useEditorStore((s) => s.root);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const removeSelected = useEditorStore((s) => s.removeSelected);
  const copySelected = useEditorStore((s) => s.copySelected);
  const reorderSelected = useEditorStore((s) => s.reorderSelected);
  const setInlineEditingId = useEditorStore((s) => s.setInlineEditingId);

  const primaryId = selectedIds[0];
  const node = primaryId ? findNode(root, primaryId)?.node : null;
  const isText = node?.type === "text" || node?.type === "goldDash";
  const canDrag = node && node.type !== "page";

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: primaryId ? `node-drag-${primaryId}` : "node-drag-none",
    disabled: !canDrag || !primaryId,
    data: primaryId
      ? ({ kind: "node", nodeId: primaryId } satisfies NodeDragData)
      : undefined,
  });

  const top = Math.max(8, rect.top - 44);
  const left = rect.left + rect.width / 2;

  return (
    <div
      className="pointer-events-auto fixed z-[10002] flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-border bg-navy px-1 py-1 shadow-lg"
      style={{ top, left, opacity: isDragging ? 0.6 : 1 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {canDrag ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          ref={setNodeRef}
          className="h-7 w-7 cursor-grab text-white hover:bg-white/10 active:cursor-grabbing"
          title="Drag to move"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </Button>
      ) : null}
      {isText ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-white/10"
          onClick={() => primaryId && setInlineEditingId(primaryId)}
          title="Edit text"
        >
          <Type className="h-3.5 w-3.5" />
        </Button>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/10"
        onClick={() => reorderSelected(-1)}
        title="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/10"
        onClick={() => reorderSelected(1)}
        title="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/10"
        onClick={() => copySelected()}
        title="Copy"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/10"
        onClick={() => duplicateSelected()}
        title="Duplicate"
      >
        <Copy className="h-3.5 w-3.5 rotate-90" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:bg-destructive/20"
        onClick={() => removeSelected()}
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
