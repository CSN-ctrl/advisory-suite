import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { PageNodeType } from "@/visual-editor/schema/page-node";
import type { PaletteDragData } from "@/visual-editor/editor/dnd/VisualEditorDndContext";

interface DraggablePaletteItemProps {
  type: PageNodeType;
  label: string;
  icon?: React.ReactNode;
}

export function DraggablePaletteItem({ type, label, icon }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { kind: "palette", type } satisfies PaletteDragData,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      data-visual-editor-chrome
      className={cn(
        "flex w-full cursor-grab items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white hover:bg-white/10",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
