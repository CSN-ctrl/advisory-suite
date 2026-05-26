import { useEditorStore } from "@/visual-editor/store/editor-store";
import { canHaveChildren, type PageNode } from "@/visual-editor/schema/page-node";
import { DropZone } from "@/visual-editor/editor/dnd/DropZone";

/** Renders drop zones between children of a container node (edit mode only). */
export function NodeDropZones({ node }: { node: PageNode }) {
  const mode = useEditorStore((s) => s.mode);
  if (mode !== "edit" || !canHaveChildren(node.type)) return null;

  const count = node.children?.length ?? 0;
  const zones: React.ReactNode[] = [];
  for (let i = 0; i <= count; i++) {
    zones.push(<DropZone key={`${node.id}-${i}`} parentId={node.id} index={i} />);
  }
  return <div className="flex flex-col gap-0">{zones}</div>;
}
