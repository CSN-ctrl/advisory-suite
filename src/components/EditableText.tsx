import { useEffect, useId, useState, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    await onSave(draft);
    setEditing(false);
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
        <Tag className={cn(className)}>{displayValue}</Tag>
        {shouldRenderControls ? (
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
        ) : null}
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
    await onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const displayValue = createDisplayValue(value, fallbackValue);
  const Tag = as;
  const displayParagraphs = displayValue.split("\n");

  if (!canEdit || !editing) {
    return (
      <div className="group flex w-full max-w-full flex-col gap-2">
        <Tag className={cn("whitespace-pre-line", className)}>
          {displayParagraphs.map((paragraph, index) => (
            <span key={`${paragraph}-${index}`}>
              {paragraph}
              {index < displayParagraphs.length - 1 ? <br /> : null}
            </span>
          ))}
        </Tag>
        {shouldRenderControls ? (
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
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        {editLabel}
      </label>
      <Textarea
        id={inputId}
        value={draft}
        rows={rows}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className={cn("min-h-[120px] text-sm", editorClassName)}
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
