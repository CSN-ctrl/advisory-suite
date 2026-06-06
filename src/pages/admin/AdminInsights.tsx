import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminGate } from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import {
  deleteInsightAdmin,
  fetchAllInsightsAdmin,
  upsertInsightAdmin,
  type InsightRow,
} from "@/lib/insights-store";
import { useAdmin } from "@/contexts/AdminContext";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const AdminInsights = () => {
  const { setAdminAuthenticated } = useAdmin();
  const [rows, setRows] = useState<InsightRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    id: "",
    slug: "",
    locale: "en" as "en" | "bg",
    title: "",
    excerpt: "",
    content: "",
    article_date: "",
    meta_description: "",
    sort_order: 0,
    published: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllInsightsAdmin();
      setRows(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const row = rows.find((r) => r.id === selectedId);
    if (!row) return;
    setDraft({
      id: row.id,
      slug: row.slug,
      locale: row.locale as "en" | "bg",
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      article_date: row.article_date,
      meta_description: row.meta_description,
      sort_order: row.sort_order,
      published: row.published,
    });
  }, [selectedId, rows]);

  const handleNew = () => {
    setSelectedId(null);
    setDraft({
      id: "",
      slug: "",
      locale: "en",
      title: "",
      excerpt: "",
      content: "",
      article_date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      meta_description: "",
      sort_order: rows.length,
      published: false,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const slug = draft.slug.trim() || slugify(draft.title);
    const result = await upsertInsightAdmin({
      id: draft.id || undefined,
      slug,
      locale: draft.locale,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.content,
      article_date: draft.article_date,
      meta_description: draft.meta_description,
      sort_order: draft.sort_order,
      published: draft.published,
    });
    setSaving(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved");
    await load();
    setSelectedId(result.id);
  };

  const handleDelete = async () => {
    if (!draft.id) return;
    if (!window.confirm("Delete this article?")) return;
    const result = await deleteInsightAdmin(draft.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Deleted");
    setSelectedId(null);
    await load();
  };

  return (
    <AdminGate loginTitle="Sign in as admin" backHref="/admin" backLabel="← Admin" fullScreen>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-navy px-4 py-3 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <h1 className="font-serif text-xl">Insights articles</h1>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => void getSupabaseBrowserClient().auth.signOut().then(() => setAdminAuthenticated(false))}
            >
              <LogOut className="mr-1 h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </header>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleNew}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              New article
            </Button>
            {loading ? (
              <p className="text-sm text-muted-foreground">…</p>
            ) : (
              <ul className="space-y-1">
                {rows.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(row.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                        selectedId === row.id ? "bg-accent/15" : "hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {row.title}
                      <span className="block text-[10px] uppercase text-muted-foreground">{row.locale}{!row.published ? " · draft" : ""}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="my-article" />
                </div>
                <div className="grid gap-2">
                  <Label>Locale</Label>
                  <select
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={draft.locale}
                    onChange={(e) => setDraft({ ...draft, locale: e.target.value as "en" | "bg" })}
                  >
                    <option value="en">English</option>
                    <option value="bg">Bulgarian</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Date label</Label>
                  <Input value={draft.article_date} onChange={(e) => setDraft({ ...draft, article_date: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Excerpt</Label>
                <Textarea rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Content (paragraphs separated by blank lines; **bold** supported)</Label>
                <Textarea rows={12} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Meta description</Label>
                <Textarea rows={2} value={draft.meta_description} onChange={(e) => setDraft({ ...draft, meta_description: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
                <Label>Published</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="gold" disabled={saving} onClick={() => void handleSave()}>
                  <Save className="mr-1 h-4 w-4" />
                  {saving ? "…" : "Save"}
                </Button>
                {draft.slug ? (
                  <Button type="button" variant="outline" asChild>
                    <Link to={`/insights/${draft.slug.trim().toLowerCase() || slugify(draft.title)}`} target="_blank" rel="noreferrer">
                      Preview
                    </Link>
                  </Button>
                ) : null}
                {draft.id ? (
                  <Button type="button" variant="ghost" className="text-destructive" onClick={() => void handleDelete()}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminGate>
  );
};

export default AdminInsights;
