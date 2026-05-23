import { useEffect, useId, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableFieldChrome } from "@/components/edit-mode/EditableFieldChrome";
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
  fieldLabel?: string;
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
  isSaving,
  onSave,
  onCancel,
  controlsClassName,
  saveLabel,
  cancelLabel,
}: {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  controlsClassName?: string;
  saveLabel: string;
  cancelLabel: string;
}) {
  return (
    <div className={cn("mt-2 flex items-center justify-end gap-2", controlsClassName)} data-edit-allow="true">
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

function createDisplayValue(value: string, fallbackValue?: string) {
  const trimmed = value.trim();
  if (trimmed.length > 0) return value;
  return fallbackValue ?? "";
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
  fieldLabel,
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

  if (canEdit && editing) {
    return (
      <EditableFieldChrome
        canEdit={canEdit}
        editing={editing}
        fieldLabel={fieldLabel}
        onStartEdit={() => setEditing(true)}
        className="p-2"
      >
        <label htmlFor={inputId} className="sr-only">
          {fieldLabel ?? "Edit text"}
        </label>
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          data-edit-allow="true"
          className={cn("h-10 border-accent/30 bg-background text-sm focus-visible:ring-accent", editorClassName)}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              handleCancel();
            }
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSave();
            }
          }}
        />
        <EditableControls
          isSaving={isSaving}
          onSave={() => void handleSave()}
          onCancel={handleCancel}
          controlsClassName={controlsClassName}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
        />
      </EditableFieldChrome>
    );
  }

  return (
    <EditableFieldChrome
      canEdit={canEdit}
      editing={false}
      fieldLabel={fieldLabel}
      onStartEdit={() => setEditing(true)}
      className={canEdit ? "px-1 py-0.5" : undefined}
    >
      <Tag className={className}>{displayValue}</Tag>
    </EditableFieldChrome>
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
  fieldLabel,
  isSaving = false,
  rows = 5,
  as = "p",
}: EditableRichTextProps) {
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
  const displayParagraphs = displayValue.split("\n");

  if (canEdit && editing) {
    return (
      <EditableFieldChrome
        canEdit={canEdit}
        editing={editing}
        fieldLabel={fieldLabel}
        onStartEdit={() => setEditing(true)}
        className="p-2"
      >
        <label htmlFor={inputId} className="sr-only">
          {fieldLabel ?? "Edit text"}
        </label>
        <Textarea
          id={inputId}
          value={draft}
          rows={rows}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          data-edit-allow="true"
          className={cn("min-h-[120px] border-accent/30 bg-background text-sm focus-visible:ring-accent", editorClassName)}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              handleCancel();
            }
          }}
        />
        <EditableControls
          isSaving={isSaving}
          onSave={() => void handleSave()}
          onCancel={handleCancel}
          controlsClassName={controlsClassName}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
        />
      </EditableFieldChrome>
    );
  }

  return (
    <EditableFieldChrome
      canEdit={canEdit}
      editing={false}
      fieldLabel={fieldLabel}
      onStartEdit={() => setEditing(true)}
      className={canEdit ? "px-1 py-0.5" : undefined}
    >
      <Tag className={cn("whitespace-pre-line", className)}>
        {displayParagraphs.map((paragraph, index) => (
          <span key={`${paragraph}-${index}`}>
            {paragraph}
            {index < displayParagraphs.length - 1 ? <br /> : null}
          </span>
        ))}
      </Tag>
    </EditableFieldChrome>
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
