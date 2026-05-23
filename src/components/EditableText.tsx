import { useEffect, useId, useState, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/rich-text/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { htmlPlainTextApprox, isStoredRichHtml, sanitizeRichHtml } from "@/lib/rich-text-html";
import { cn } from "@/lib/utils";

type EditableRenderTag = "span" | "p" | "h1" | "h2" | "h3" | "h4";

interface BaseEditableProps {
  value: string;
  fallbackValue?: string;
  isAdmin: boolean;
  isEditMode: boolean;
  onSave: (nextValue: string) => void | Promise<void>;
  className?: string;
  editorClassName?: string;
  controlsClassName?: string;
  placeholder?: string;
  saveLabel?: string;
  cancelLabel?: string;
  editLabel?: string;
  isSaving?: boolean;
  as?: EditableRenderTag;
}

interface EditableTextProps extends BaseEditableProps {
  multiline?: false;
}

interface EditableRichTextProps extends BaseEditableProps {
  multiline: true;
  rows?: number;
}

function EditableControls({
  editing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  controlsClassName,
  saveLabel,
  cancelLabel,
  editLabel,
}: {
  editing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  controlsClassName?: string;
  saveLabel: string;
  cancelLabel: string;
  editLabel: string;
}) {
  if (!editing) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onEdit}
        data-edit-allow="true"
        className={cn("h-8 px-2 text-xs", controlsClassName)}
        aria-label={editLabel}
      >
        <Pencil className="w-3 h-3" />
        {editLabel}
      </Button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", controlsClassName)}>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        data-edit-allow="true"
        className="h-8 px-2 text-xs"
        aria-label={cancelLabel}
      >
        <X className="w-3 h-3" />
        {cancelLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="gold"
        onClick={onSave}
        disabled={isSaving}
        data-edit-allow="true"
        className="h-8 px-2 text-xs"
        aria-label={saveLabel}
      >
        <Check className="w-3 h-3" />
        {isSaving ? "Saving..." : saveLabel}
      </Button>
    </div>
  );
}

function handleActivateByKeyboard(event: React.KeyboardEvent<HTMLElement>, onActivate: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

function handleActivateByClick(event: React.MouseEvent<HTMLElement>, onActivate: () => void) {
  event.preventDefault();
  event.stopPropagation();
  onActivate();
}

function createDisplayValue(value: string, fallbackValue?: string) {
  const trimmed = value.trim();
  if (trimmed.length > 0) return value;
  return fallbackValue ?? "";
}

function isEffectivelyEmptyContent(value: string): boolean {
  if (isStoredRichHtml(value)) {
    return htmlPlainTextApprox(value).length === 0;
  }
  return value.trim().length === 0;
}

function createRichDisplaySource(value: string, fallbackValue?: string) {
  if (isEffectivelyEmptyContent(value)) {
    return fallbackValue ?? "";
  }
  return value;
}

export function EditableText({
  value,
  fallbackValue,
  isAdmin,
  isEditMode,
  onSave,
  className,
  editorClassName,
  controlsClassName,
  placeholder = "Enter text",
  saveLabel = "Save",
  cancelLabel = "Cancel",
  editLabel = "Edit",
  isSaving = false,
  as = "p",
}: EditableTextProps) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputId = useId();

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  useEffect(() => {
    if (!isEditMode) {
      setEditing(false);
    }
  }, [isEditMode]);

  const canEdit = isAdmin && isEditMode;
  const shouldRenderControls = canEdit;

  const handleSave = async () => {
    try {
      await onSave(draft);
      toast.success("Saved");
      setEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const displayValue = createDisplayValue(value, fallbackValue);
  const Tag = as;

  if (!canEdit || !editing) {
    return (
      <div className="group flex w-full max-w-full flex-col gap-2">
        <Tag
          className={cn(className, shouldRenderControls ? "cursor-text" : undefined)}
          onDoubleClick={shouldRenderControls ? (event) => handleActivateByClick(event, () => setEditing(true)) : undefined}
          onKeyDown={shouldRenderControls ? (event) => handleActivateByKeyboard(event, () => setEditing(true)) : undefined}
          tabIndex={shouldRenderControls ? 0 : undefined}
          role={shouldRenderControls ? "button" : undefined}
          aria-label={shouldRenderControls ? editLabel : undefined}
          title={shouldRenderControls ? "Double-click to edit" : undefined}
        >
          {displayValue}
        </Tag>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        {editLabel}
      </label>
      <Input
        id={inputId}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        data-edit-allow="true"
        className={cn("h-10 text-sm", editorClassName)}
      />
      <EditableControls
        editing={editing}
        isSaving={isSaving}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        controlsClassName={controlsClassName}
        saveLabel={saveLabel}
        cancelLabel={cancelLabel}
        editLabel={editLabel}
      />
    </div>
  );
}

export function EditableRichText({
  value,
  fallbackValue,
  isAdmin,
  isEditMode,
  onSave,
  className,
  editorClassName,
  controlsClassName,
  placeholder = "Enter text",
  saveLabel = "Save",
  cancelLabel = "Cancel",
  editLabel = "Edit",
  isSaving = false,
  rows = 5,
  as = "p",
}: EditableRichTextProps) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);

  const beginEditing = () => {
    setEditSession((s) => s + 1);
    setEditing(true);
  };

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  useEffect(() => {
    if (!isEditMode) {
      setEditing(false);
    }
  }, [isEditMode]);

  const canEdit = isAdmin && isEditMode;
  const shouldRenderControls = canEdit;

  const handleSave = async () => {
    try {
      await onSave(sanitizeRichHtml(draft));
      toast.success("Saved");
      setEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const displaySource = createRichDisplaySource(value, fallbackValue);
  const showSanitizedHtml = isStoredRichHtml(displaySource);
  const sanitizedDisplay = showSanitizedHtml ? sanitizeRichHtml(displaySource) : "";
  const Tag = as;
  const displayParagraphs = displaySource.split("\n");

  const staticHeadingA11y =
    as === "h1"
      ? ({ role: "heading", "aria-level": 1 } as const)
      : as === "h2"
        ? ({ role: "heading", "aria-level": 2 } as const)
        : as === "h3"
          ? ({ role: "heading", "aria-level": 3 } as const)
          : as === "h4"
            ? ({ role: "heading", "aria-level": 4 } as const)
            : ({} as const);

  if (!canEdit || !editing) {
    if (showSanitizedHtml && htmlPlainTextApprox(sanitizedDisplay).length > 0) {
      const interactiveA11y = shouldRenderControls
        ? {
            role: "button" as const,
            "aria-label": editLabel,
            tabIndex: 0 as const,
            title: "Double-click to edit" as const,
          }
        : staticHeadingA11y;

      return (
        <div className="group flex w-full max-w-full flex-col gap-2">
          <div
            {...interactiveA11y}
            className={cn(
              "rich-html-content",
              as === "span" && "rich-html-content--inline",
              className,
              shouldRenderControls ? "cursor-text" : undefined,
            )}
            dangerouslySetInnerHTML={{ __html: sanitizedDisplay }}
            onDoubleClick={shouldRenderControls ? (event) => handleActivateByClick(event, beginEditing) : undefined}
            onKeyDown={shouldRenderControls ? (event) => handleActivateByKeyboard(event, beginEditing) : undefined}
          />
        </div>
      );
    }

    return (
      <div className="group flex w-full max-w-full flex-col gap-2">
        <Tag
          className={cn("whitespace-pre-line", className, shouldRenderControls ? "cursor-text" : undefined)}
          onDoubleClick={shouldRenderControls ? (event) => handleActivateByClick(event, beginEditing) : undefined}
          onKeyDown={shouldRenderControls ? (event) => handleActivateByKeyboard(event, beginEditing) : undefined}
          tabIndex={shouldRenderControls ? 0 : undefined}
          role={shouldRenderControls ? "button" : undefined}
          aria-label={shouldRenderControls ? editLabel : undefined}
          title={shouldRenderControls ? "Double-click to edit" : undefined}
        >
          {displayParagraphs.map((paragraph, index) => (
            <span key={`${paragraph}-${index}`}>
              {paragraph}
              {index < displayParagraphs.length - 1 ? <br /> : null}
            </span>
          ))}
        </Tag>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <span className="sr-only">{editLabel}</span>
      <RichTextEditor
        key={editSession}
        initialValue={draft}
        onChange={setDraft}
        placeholder={placeholder}
        editorClassName={cn("text-sm", editorClassName)}
        minHeightPx={Math.max(140, Math.min(520, rows * 32 + 80))}
      />
      <EditableControls
        editing={editing}
        isSaving={isSaving}
        onEdit={beginEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        controlsClassName={controlsClassName}
        saveLabel={saveLabel}
        cancelLabel={cancelLabel}
        editLabel={editLabel}
      />
    </div>
  );
}

export function withEditableFallback(value: string | undefined, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (value.trim().length === 0) return fallback;
  return value;
}

export interface EditableContentBlock<TValue = string> {
  value: TValue;
  fallbackValue?: string;
  isAdmin: boolean;
  isEditMode: boolean;
  onSave: (nextValue: TValue) => void | Promise<void>;
  render: (value: TValue) => ReactNode;
}
