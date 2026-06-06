import { useEffect, type RefObject } from "react";
import { getNodeIdFromElement } from "@/visual-editor/store/dom-registry";
import { useEditorStore } from "@/visual-editor/store/editor-store";

interface EditorInteractionGuardProps {
  canvasRef: RefObject<HTMLElement | null>;
}

export function EditorInteractionGuard({ canvasRef }: EditorInteractionGuardProps) {
  const mode = useEditorStore((s) => s.mode);
  const select = useEditorStore((s) => s.select);
  const setHoveredId = useEditorStore((s) => s.setHoveredId);
  const setInlineEditingId = useEditorStore((s) => s.setInlineEditingId);
  const inlineEditingId = useEditorStore((s) => s.inlineEditingId);

  useEffect(() => {
    if (mode !== "edit") return;
    const root = canvasRef.current;
    if (!root) return;

    const blockInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || target.closest("[contenteditable='true']")) return;
      const interactive = target.closest("a, button, input, textarea, select, form");
      if (interactive && root.contains(interactive)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!root.contains(target)) return;
      if (target.closest("[data-visual-editor-chrome]")) return;
      if (target.isContentEditable) return;

      const id = getNodeIdFromElement(target);
      if (id) {
        e.preventDefault();
        e.stopPropagation();
        select(id, e.shiftKey);
      } else {
        select(null);
      }
    };

    const onDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!root.contains(target)) return;
      const id = getNodeIdFromElement(target);
      if (!id) return;
      const loc = useEditorStore.getState().root;
      const find = (node: typeof loc): string | null => {
        if (node.id === id && (node.type === "text" || node.type === "goldDash")) return id;
        for (const c of node.children ?? []) {
          const f = find(c);
          if (f) return f;
        }
        return null;
      };
      if (find(loc)) {
        e.preventDefault();
        setInlineEditingId(id);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!root.contains(e.target as Node)) {
        setHoveredId(null);
        return;
      }
      const id = getNodeIdFromElement(e.target as HTMLElement);
      setHoveredId(id);
    };

    root.addEventListener("click", onClick, true);
    root.addEventListener("dblclick", onDblClick, true);
    root.addEventListener("mousedown", blockInteractive, true);
    root.addEventListener("submit", blockInteractive, true);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("dblclick", onDblClick, true);
      root.removeEventListener("mousedown", blockInteractive, true);
      root.removeEventListener("submit", blockInteractive, true);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef, mode, select, setHoveredId, setInlineEditingId, inlineEditingId]);

  return null;
}
