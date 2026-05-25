import { useId, useRef, useState } from "react";
import { Check, ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditableFieldChrome } from "@/components/edit-mode/EditableFieldChrome";
import { CmsText } from "@/components/edit-mode/CmsText";
import type { EditableFieldBind } from "@/hooks/use-page-editing";
import { resolveMediaSrc } from "@/lib/resolve-media-src";
import { uploadSiteMedia } from "@/lib/site-media";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  defaultSrc: string;
  srcBind: EditableFieldBind;
  altBind: EditableFieldBind;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

export function EditableImage({
  defaultSrc,
  srcBind,
  altBind,
  className,
  imgClassName,
  loading = "lazy",
}: EditableImageProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);

  const resolvedSrc = resolveMediaSrc(srcBind.value, defaultSrc);
  const canEdit = srcBind.isAdmin && srcBind.isEditMode;
  const alt = altBind.value.trim() || altBind.fieldLabel || "Image";

  const openEditor = () => {
    setUrlDraft(srcBind.value.trim() || resolvedSrc);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await srcBind.onSave(urlDraft.trim());
      setEditing(false);
      toast.success("Image saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save image");
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const publicUrl = await uploadSiteMedia(file);
      setUrlDraft(publicUrl);
      toast.success("Image uploaded — click Save to apply");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed. Paste an image URL instead, or apply the site-media storage migration.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (canEdit && editing) {
    return (
      <div
        className={cn("rounded-md border border-accent/40 bg-accent/5 p-3", className)}
        data-edit-allow="true"
      >
        <img src={resolveMediaSrc(urlDraft, defaultSrc)} alt={alt} className={cn("mb-3 max-h-64 w-full object-cover rounded", imgClassName)} />
        <label className="mb-1 block font-body text-[10px] uppercase tracking-wider text-muted-foreground">
          Image URL
        </label>
        <Input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className="mb-2 font-mono text-xs"
          data-edit-allow="true"
          placeholder="https://… or upload below"
        />
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mb-3 w-full"
          disabled={uploading}
          data-edit-allow="true"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-2 h-3.5 w-3.5" />
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        <CmsText as="p" {...altBind} className="text-xs text-muted-foreground" />
        <div className="mt-3 flex justify-end gap-2">
          <Button type="button" size="sm" variant="ghost" data-edit-allow="true" onClick={() => setEditing(false)}>
            <X className="h-3 w-3" />
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="gold"
            disabled={srcBind.isSaving}
            data-edit-allow="true"
            onClick={() => void handleSave()}
          >
            <Check className="h-3 w-3" />
            {srcBind.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  const image = (
    <img
      src={resolvedSrc}
      alt={alt}
      className={imgClassName}
      loading={loading}
    />
  );

  if (!canEdit) {
    return <div className={className}>{image}</div>;
  }

  return (
    <EditableFieldChrome
      canEdit
      editing={false}
      fieldLabel={srcBind.fieldLabel}
      onStartEdit={openEditor}
      className={className}
    >
      <div className="relative">
        {image}
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 font-body text-[9px] uppercase tracking-wider text-white opacity-0 transition-opacity group-hover/editable:opacity-100">
          <ImageIcon className="h-3 w-3" />
          Edit image
        </span>
      </div>
      <div className="mt-2">
        <CmsText as="span" {...altBind} className="text-[10px] text-muted-foreground/80" />
      </div>
    </EditableFieldChrome>
  );
}
