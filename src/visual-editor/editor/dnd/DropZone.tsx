import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { DropZoneData } from "@/visual-editor/editor/dnd/VisualEditorDndContext";

interface DropZoneProps {
  parentId: string;
  index: number;
  className?: string;
  vertical?: boolean;
}

export function DropZone({ parentId, index, className, vertical = true }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${parentId}-${index}`,
    data: { kind: "dropzone", parentId, index } satisfies DropZoneData,
  });

  return (
    <div
      ref={setNodeRef}
      data-visual-editor-chrome
      className={cn(
        "transition-colors",
        vertical ? "min-h-[6px] w-full" : "min-w-[6px] h-full",
        isOver && "bg-accent/30 min-h-[12px]",
        className,
      )}
    />
  );
}
