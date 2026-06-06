import type { ReactNode } from "react";
import { useCanvasWorkspace } from "@/contexts/CanvasWorkspaceContext";
import { usePageCanvasEditorOptional } from "@/contexts/PageCanvasEditorContext";
import { useMarketingBlockLayout } from "@/contexts/MarketingLayoutContext";
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
  const workspace = useCanvasWorkspace();
  const isActive = editor?.isActive ?? workspace;
  const liveLayout = useMarketingBlockLayout(blockId);

  if (liveLayout?.hidden) {
    return null;
  }

  return (
    <div
      data-canvas-block={blockId}
      data-canvas-label={label ?? blockId}
      data-canvas-type={variant === "card" ? "card" : undefined}
      data-canvas-binding={binding ? JSON.stringify(binding) : undefined}
      style={{
        ...liveLayout?.style,
        order: liveLayout?.order,
      }}
      className={cn(
        className,
        isActive && "relative",
        isActive && "editor-canvas-block",
        isActive && variant === "card" && "editor-canvas-block--card",
      )}
    >
      {children}
    </div>
  );
}
