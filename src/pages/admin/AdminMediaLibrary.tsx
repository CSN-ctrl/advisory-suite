import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, ImageIcon, LogOut, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminGate } from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { deleteSiteMedia, listSiteMedia, uploadSiteMedia, type SiteMediaItem } from "@/lib/site-media";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";

const AdminMediaLibrary = () => {
  const locale = useLocale();
  const isBg = locale === "bg";
  const { setAdminAuthenticated } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SiteMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const t = isBg
    ? {
        title: "Медийна библиотека",
        subtitle: "Споделени изображения за inline, canvas и visual редактори.",
        upload: "Качи",
        copy: "Копирай URL",
        delete: "Изтрий",
        back: "← Pages Hub",
        signOut: "Изход",
        empty: "Няма качени файлове.",
        copied: "URL копиран.",
        loginTitle: "Вход като администратор",
      }
    : {
        title: "Media library",
        subtitle: "Shared images for inline, canvas, and visual editors.",
        upload: "Upload",
        copy: "Copy URL",
        delete: "Delete",
        back: "← Pages Hub",
        signOut: "Sign out",
        empty: "No uploaded files yet.",
        copied: "URL copied.",
        loginTitle: "Sign in as admin",
      };

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
    void refresh();
  }, [refresh]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadSiteMedia(file);
      toast.success(isBg ? "Качено" : "Uploaded");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.copied);
    } catch {
      toast.error("Could not copy URL");
    }
  };

  const handleDelete = async (path: string) => {
    if (!window.confirm(isBg ? "Изтриване на файла?" : "Delete this file?")) return;
    try {
      await deleteSiteMedia(path);
      toast.success(isBg ? "Изтрито" : "Deleted");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
    } catch {
      /* ignore */
    }
    setAdminAuthenticated(false);
  };

  return (
    <AdminGate loginTitle={t.loginTitle} backHref="/admin/pages" backLabel={t.back} fullScreen>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-navy px-4 py-3 text-white sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              <h1 className="font-serif text-xl sm:text-2xl">{t.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/admin/pages">{t.back}</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="mr-1 h-3.5 w-3.5" />
                {t.signOut}
              </Button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="mb-6 font-body text-sm text-muted-foreground">{t.subtitle}</p>

          <div className="mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="gold" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-1 h-4 w-4" />
              {uploading ? "…" : t.upload}
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.empty}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.path} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="aspect-video bg-muted/30">
                    <img src={item.publicUrl} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate font-mono text-xs text-muted-foreground">{item.name}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy(item.publicUrl)}>
                        <Copy className="mr-1 h-3 w-3" />
                        {t.copy}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(item.path)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {t.delete}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AdminGate>
  );
};

export default AdminMediaLibrary;
