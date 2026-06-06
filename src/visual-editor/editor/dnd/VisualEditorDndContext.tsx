import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { collectDescendantIds, findNode } from "@/visual-editor/lib/tree-ops";
import { NODE_TYPE_LABELS, type PageNodeType } from "@/visual-editor/schema/page-node";

export type PaletteDragData = { kind: "palette"; type: PageNodeType };
export type DropZoneData = { kind: "dropzone"; parentId: string; index: number };
export type NodeDragData = { kind: "node"; nodeId: string };

interface VisualEditorDndContextProps {
  children: ReactNode;
  locale?: string;
}

export function VisualEditorDndContext({ children, locale = "en" }: VisualEditorDndContextProps) {
  const insertNode = useEditorStore((s) => s.insertNode);
  const moveNode = useEditorStore((s) => s.moveNode);
  const root = useEditorStore((s) => s.root);
  const [activePalette, setActivePalette] = useState<PageNodeType | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current;
    if (data?.kind === "palette") {
      setActivePalette(data.type as PageNodeType);
      return;
    }
    if (data?.kind === "node") {
      setActiveNodeId(data.nodeId as string);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActivePalette(null);
    setActiveNodeId(null);
    const { active, over } = e;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current as DropZoneData | undefined;

    if (!overData || overData.kind !== "dropzone") return;

    if (activeData?.kind === "palette") {
      insertNode(overData.parentId, activeData.type as PageNodeType, overData.index);
      return;
    }

    if (activeData?.kind === "node") {
      const nodeId = activeData.nodeId as string;
      if (nodeId === overData.parentId) return;
      const loc = findNode(root, nodeId);
      if (!loc?.parent) return;
      if (collectDescendantIds(loc.node).includes(overData.parentId)) return;

      let index = overData.index;
      if (loc.parent.id === overData.parentId && loc.index < index) {
        index -= 1;
      }
      moveNode(nodeId, overData.parentId, index);
    }
  };

  const paletteLabel = activePalette
    ? locale === "bg"
      ? NODE_TYPE_LABELS[activePalette].bg
      : NODE_TYPE_LABELS[activePalette].en
    : "";

  const nodeLabel = activeNodeId
    ? (() => {
        const n = findNode(root, activeNodeId)?.node;
        if (!n) return "";
        return locale === "bg" ? NODE_TYPE_LABELS[n.type].bg : NODE_TYPE_LABELS[n.type].en;
      })()
    : "";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activePalette ? (
          <div className="rounded-md border border-accent bg-navy px-3 py-2 text-xs text-white shadow-lg">
            {paletteLabel}
          </div>
        ) : activeNodeId ? (
          <div className="rounded-md border border-accent bg-navy/95 px-3 py-2 text-xs text-white shadow-lg">
            {nodeLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function isContainerType(type: PageNodeType): boolean {
  return type === "page" || type === "section" || type === "container";
}
