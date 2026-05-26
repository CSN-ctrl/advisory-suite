import { useCallback } from "react";
import type { PageNode } from "@/visual-editor/schema/page-node";
import { getRegistryEntry } from "@/visual-editor/registry/component-registry";
import { EditableShell } from "@/visual-editor/renderer/EditableShell";
import { useEditorStore } from "@/visual-editor/store/editor-store";

interface PageRendererProps {
  root: PageNode;
  mode?: "edit" | "preview";
}

export function PageRenderer({ root, mode: modeProp }: PageRendererProps) {
  const storeMode = useEditorStore((s) => s.mode);
  const inlineEditingId = useEditorStore((s) => s.inlineEditingId);
  const updateNode = useEditorStore((s) => s.updateNode);
  const setInlineEditingId = useEditorStore((s) => s.setInlineEditingId);

  const mode = modeProp ?? storeMode;

  const onTextChange = useCallback(
    (id: string, text: string) => {
      updateNode(id, { text });
    },
    [updateNode],
  );

  const renderNode = (node: PageNode): React.ReactNode => {
    const entry = getRegistryEntry(node.type);
    const childNodes = node.children?.map((child) => renderNode(child));
    const ctx = {
      node,
      children: childNodes,
      registerRef: () => {},
      mode,
      inlineEditingId,
      onTextChange: (text: string) => onTextChange(node.id, text),
      onEndInlineEdit: () => setInlineEditingId(null),
    };

    const inner = entry.render(ctx);

    return (
      <EditableShell key={node.id} nodeId={node.id}>
        {inner}
      </EditableShell>
    );
  };

  return <>{renderNode(root)}</>;
}

/** Standalone renderer for public pages (no zustand). */
export function PublicPageRenderer({ root }: { root: PageNode }) {
  const renderNode = (node: PageNode): React.ReactNode => {
    const entry = getRegistryEntry(node.type);
    const childNodes = node.children?.map((child) => renderNode(child));
    const inner = entry.render({
      node,
      children: childNodes,
      registerRef: () => {},
      mode: "preview",
      inlineEditingId: null,
    });
    return (
      <EditableShell key={node.id} nodeId={node.id}>
        {inner}
      </EditableShell>
    );
  };
  return <>{renderNode(root)}</>;
}
