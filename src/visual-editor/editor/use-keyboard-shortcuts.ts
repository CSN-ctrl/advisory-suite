import { useEffect } from "react";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { findNode } from "@/visual-editor/lib/tree-ops";

export function useKeyboardShortcuts() {
  const mode = useEditorStore((s) => s.mode);

  useEffect(() => {
    if (mode !== "edit") return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;

      const meta = e.metaKey || e.ctrlKey;
      const state = useEditorStore.getState();

      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        state.undo();
        return;
      }
      if (meta && (e.key === "Z" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        state.redo();
        return;
      }
      if (meta && e.key === "d") {
        e.preventDefault();
        state.duplicateSelected();
        return;
      }
      if (meta && e.key === "c") {
        e.preventDefault();
        state.copySelected();
        return;
      }
      if (meta && e.key === "v") {
        e.preventDefault();
        state.pasteClipboard();
        return;
      }
      if (meta && e.key === "s") {
        e.preventDefault();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (state.selectedIds.length) {
          e.preventDefault();
          state.removeSelected();
        }
        return;
      }
      if (e.key === "Escape") {
        state.clearSelection();
        state.setInlineEditingId(null);
        return;
      }

      const primaryId = state.selectedIds[0];
      if (!primaryId) return;
      const loc = findNode(state.root, primaryId);
      if (!loc?.parent) return;

      const nudge = e.shiftKey ? 8 : 1;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        state.reorderSelected(-1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        state.reorderSelected(1);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const layout = loc.node.props.layout ?? {};
        const width = Number(layout.width ?? 0);
        if (width > 0 && (loc.node.type === "image" || loc.node.type === "container")) {
          e.preventDefault();
          const delta = e.key === "ArrowRight" ? nudge : -nudge;
          state.updateNodeLayout(primaryId, { width: Math.max(40, width + delta) });
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);
}
