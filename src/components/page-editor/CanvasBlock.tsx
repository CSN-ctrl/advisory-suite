import type { ReactNode } from "react";
import { usePageCanvasEditorOptional } from "@/contexts/PageCanvasEditorContext";
import { cn } from "@/lib/utils";

interface CanvasBlockProps {
  blockId: string;
  label?: string;
  /** Mark as card (service/insight cards). */
  variant?: "section" | "card";
  binding?: { page: string; section: string; key: string };
  className?: string;
  children: ReactNode;
}

export function CanvasBlock({ blockId, label, variant = "section", binding, className, children }: CanvasBlockProps) {
  const editor = usePageCanvasEditorOptional();
  const isActive = editor?.isActive ?? false;

  return (
    <div
      data-canvas-block={blockId}
      data-canvas-label={label ?? blockId}
      data-canvas-type={variant === "card" ? "card" : undefined}
      data-canvas-binding={binding ? JSON.stringify(binding) : undefined}
      className={cn(
        className,
        isActive && "relative",
        isActive && variant === "card" && "ring-0",
      )}
    >
      {children}
    </div>
  );
}
