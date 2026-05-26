import { useEffect } from "react";
import { useEditorStore } from "@/visual-editor/store/editor-store";

export function useKeyboardShortcuts() {
  const mode = useEditorStore((s) => s.mode);

  useEffect(() => {
    if (mode !== "edit") return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable) return;

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
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);
}
