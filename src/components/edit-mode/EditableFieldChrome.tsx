import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableFieldChromeProps {
  children: ReactNode;
  canEdit: boolean;
  editing: boolean;
  fieldLabel?: string;
  onStartEdit: () => void;
  className?: string;
}

export function EditableFieldChrome({
  children,
  canEdit,
  editing,
  fieldLabel,
  onStartEdit,
  className,
}: EditableFieldChromeProps) {
  if (!canEdit) {
    return <>{children}</>;
  }

  return (
    <div
      data-editable-region="true"
      data-edit-allow="true"
      className={cn(
        "group/editable relative rounded-md transition-all duration-200",
        editing
          ? "ring-2 ring-accent bg-accent/5 shadow-sm"
          : "ring-1 ring-dashed ring-accent/50 hover:ring-accent hover:bg-accent/[0.07] cursor-pointer",
        className,
      )}
      onClick={(event) => {
        if (editing) return;
        const target = event.target as HTMLElement;
        if (target.closest("button, input, textarea, [contenteditable='true']")) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        onStartEdit();
      }}
      onKeyDown={(event) => {
        if (editing) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onStartEdit();
        }
      }}
      role="group"
      tabIndex={0}
      aria-label={fieldLabel ? `Editable field: ${fieldLabel}` : "Editable content"}
    >
      {fieldLabel ? (
        <span
          className={cn(
            "pointer-events-none absolute -top-5 left-0 z-10 max-w-full truncate rounded px-1.5 py-0.5 font-body text-[9px] uppercase tracking-[0.14em]",
            editing ? "bg-accent text-accent-foreground opacity-100" : "bg-foreground/90 text-background opacity-0 group-hover/editable:opacity-100",
          )}
        >
          {fieldLabel}
        </span>
      ) : null}
      <button
        type="button"
        data-edit-allow="true"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onStartEdit();
        }}
        className={cn(
          "absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-background text-accent shadow-sm transition-all",
          editing ? "opacity-100" : "opacity-0 group-hover/editable:opacity-100 focus:opacity-100",
        )}
        aria-label={fieldLabel ? `Open editor for ${fieldLabel}` : "Open editor"}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <div className="relative min-w-0">{children}</div>
    </div>
  );
}
