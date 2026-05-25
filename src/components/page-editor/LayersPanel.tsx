import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { CanvasDocument, CanvasElement, CanvasElementType } from "@/lib/canvas-document";
import { ELEMENT_LABELS } from "@/lib/canvas-document";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LayersPanelProps {
  locale: string;
  document: CanvasDocument;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (elements: CanvasElement[]) => void;
  onAdd: (type: CanvasElementType) => void;
  onRemove: (id: string) => void;
}

function SortableLayer({
  element,
  label,
  isSelected,
  onSelect,
  onRemove,
}: {
  element: CanvasElement;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 rounded border px-2 py-1.5 text-xs font-body",
        isSelected ? "border-accent bg-accent/10" : "border-border bg-background",
        isDragging && "opacity-60 shadow-md",
      )}
    >
      <button type="button" className="cursor-grab touch-none p-0.5 text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button type="button" className="flex-1 truncate text-left" onClick={onSelect}>
        {label}
      </button>
      <button type="button" className="p-0.5 text-destructive" onClick={onRemove} aria-label="Remove">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function LayersPanel({
  locale,
  document: doc,
  selectedId,
  onSelect,
  onReorder,
  onAdd,
  onRemove,
}: LayersPanelProps) {
  const isBg = locale === "bg";
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = doc.elements.findIndex((e) => e.id === active.id);
    const newIndex = doc.elements.findIndex((e) => e.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const moved = arrayMove(doc.elements, oldIndex, newIndex).map((el, i) => ({
      ...el,
      position: { ...el.position, zIndex: i + 1 },
    }));
    onReorder(moved);
  };

  const types: CanvasElementType[] = ["text", "heading", "image", "button", "box"];

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-3 py-3">
        <h2 className="font-body text-xs font-bold uppercase tracking-wider">
          {isBg ? "Елементи" : "Elements"}
        </h2>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {types.map((type) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 flex-1 px-1 text-[10px]"
            onClick={() => onAdd(type)}
          >
            {isBg ? ELEMENT_LABELS[type].bg : ELEMENT_LABELS[type].en}
          </Button>
        ))}
      </div>
      <ScrollArea className="flex-1 p-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={doc.elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {[...doc.elements].reverse().map((el) => (
                <SortableLayer
                  key={el.id}
                  element={el}
                  label={isBg ? ELEMENT_LABELS[el.type].bg : ELEMENT_LABELS[el.type].en}
                  isSelected={selectedId === el.id}
                  onSelect={() => onSelect(el.id)}
                  onRemove={() => onRemove(el.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </aside>
  );
}

// silence unused createElement import if only used via parent - actually onAdd uses parent handler
