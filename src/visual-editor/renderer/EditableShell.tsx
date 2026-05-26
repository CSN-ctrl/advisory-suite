import type { ReactNode } from "react";
import { registerDomNode } from "@/visual-editor/store/dom-registry";
import { cn } from "@/lib/utils";

interface EditableShellProps {
  nodeId: string;
  className?: string;
  children: ReactNode;
}

/** Adds data-node-id and DOM registration only — no selection UI. */
export function EditableShell({ nodeId, className, children }: EditableShellProps) {
  return (
    <div
      data-node-id={nodeId}
      data-visual-editor-node
      ref={(el) => registerDomNode(nodeId, el)}
      className={cn("relative", className)}
    >
      {children}
    </div>
  );
}
