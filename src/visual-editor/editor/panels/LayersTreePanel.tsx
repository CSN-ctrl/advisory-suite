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
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { findNode, updateNodeInTree } from "@/visual-editor/lib/tree-ops";
import { NODE_TYPE_LABELS, type PageNode } from "@/visual-editor/schema/page-node";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function flattenNodes(node: PageNode, depth = 0, out: { node: PageNode; depth: number }[] = []) {
  if (node.type !== "page") {
    out.push({ node, depth });
  }
  for (const child of node.children ?? []) {
    flattenNodes(child, depth + 1, out);
  }
  return out;
}

function SortableLayerRow({
  node,
  depth,
  locale,
  isSelected,
  onSelect,
}: {
  node: PageNode;
  depth: number;
  locale: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  });
  const label = locale === "bg" ? NODE_TYPE_LABELS[node.type].bg : NODE_TYPE_LABELS[node.type].en;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, paddingLeft: depth * 12 }}
      className={cn(
        "flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
        isSelected ? "border-accent bg-accent/10" : "border-border bg-background",
        isDragging && "opacity-60",
      )}
    >
      <button type="button" className="cursor-grab touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </button>
      <button type="button" className="flex-1 truncate text-left" onClick={onSelect}>
        {label}
      </button>
    </div>
  );
}

interface LayersTreePanelProps {
  locale: string;
}

export function LayersTreePanel({ locale }: LayersTreePanelProps) {
  const isBg = locale === "bg";
  const root = useEditorStore((s) => s.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const select = useEditorStore((s) => s.select);
  const setRoot = useEditorStore((s) => s.setRoot);

  const flat = flattenNodes(root);
  const ids = flat.map((f) => f.node.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const activeLoc = findNode(root, activeId);
    const overLoc = findNode(root, overId);
    if (!activeLoc?.parent || !overLoc?.parent) return;
    if (activeLoc.parent.id !== overLoc.parent.id) return;
    const parent = activeLoc.parent;
    const children = parent.children ?? [];
    const oldIndex = children.findIndex((c) => c.id === activeId);
    const newIndex = children.findIndex((c) => c.id === overId);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(children, oldIndex, newIndex);
    const nextRoot = updateNodeInTree(root, parent.id, (p) => ({
      ...p,
      children: reordered,
    }));
    setRoot(nextRoot);
  };

  return (
    <aside
      data-visual-editor-chrome
      className="flex w-48 shrink-0 flex-col border-r border-border bg-card"
    >
      <div className="border-b border-border px-3 py-2">
        <h2 className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Слоеве" : "Layers"}
        </h2>
      </div>
      <ScrollArea className="flex-1 p-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1">
              {flat.map(({ node, depth }) => (
                <SortableLayerRow
                  key={node.id}
                  node={node}
                  depth={depth}
                  locale={locale}
                  isSelected={selectedIds.includes(node.id)}
                  onSelect={() => select(node.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </aside>
  );
}
