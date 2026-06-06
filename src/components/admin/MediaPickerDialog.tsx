import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listSiteMedia, uploadSiteMedia, type SiteMediaItem } from "@/lib/site-media";
import { cn } from "@/lib/utils";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  locale?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  locale = "en",
}: MediaPickerDialogProps) {
  const isBg = locale === "bg";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SiteMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listSiteMedia());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadSiteMedia(file);
      toast.success(isBg ? "Качено" : "Uploaded");
      await refresh();
      onSelect(url);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const t = isBg
    ? {
        title: "Изберете изображение",
        upload: "Качи ново",
        empty: "Няма качени файлове.",
        loading: "Зареждане…",
      }
    : {
        title: "Choose image",
        upload: "Upload new",
        empty: "No uploaded files yet.",
        loading: "Loading…",
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {uploading ? "…" : t.upload}
          </Button>
        </div>

        <ScrollArea className="h-[360px] rounded-md border border-border">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">{t.loading}</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-10 text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-40" />
              <p className="text-sm">{t.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className={cn(
                    "group overflow-hidden rounded-md border border-border bg-muted/30 text-left transition hover:border-accent hover:ring-2 hover:ring-accent/30",
                  )}
                  onClick={() => {
                    onSelect(item.publicUrl);
                    onOpenChange(false);
                  }}
                >
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={item.publicUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <p className="truncate px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
                    {item.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
