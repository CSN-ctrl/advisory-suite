import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared header for layers / inspector side panels. */
export function EditorPanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="editor-panel-header flex shrink-0 items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
      <div className="min-w-0">
        <h2 className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-white/95">{title}</h2>
        {subtitle ? (
          <p className="mt-1 truncate font-body text-[10px] uppercase tracking-wider text-accent">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function EditorSideDock({
  side,
  children,
  className,
}: {
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-edit-allow="true"
      className={cn(
        "editor-side-dock fixed z-[94] hidden flex-col overflow-hidden md:flex",
        side === "left" ? "left-3" : "right-3",
        className,
      )}
      style={{
        top: "calc(var(--admin-bar-height, 40px) + 0.75rem)",
        bottom: "calc(var(--canvas-toolbar-height, 64px) + 1rem + env(safe-area-inset-bottom, 0px))",
        width: side === "left" ? "15rem" : "18rem",
      }}
    >
      {children}
    </div>
  );
}

export function EditorDockPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "editor-dock-panel flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
