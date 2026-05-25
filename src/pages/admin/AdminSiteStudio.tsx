import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { useEffect } from "react";
import { useLocale } from "@/hooks/use-locale";
import { insertSitePage, useSitePagesList } from "@/hooks/use-site-pages";
import { createDefaultDocument } from "@/lib/canvas-document";

const AdminSiteStudio = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { pages, loading, error, refresh } = useSitePagesList(locale);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const isBg = locale === "bg";

  useEffect(() => {
    void checkIsSupabaseAdmin().then((ok) => {
      if (!ok) navigate("/admin/availability", { replace: true });
    });
  }, [navigate]);

  const handleCreate = async () => {
    const s = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!s || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) {
      toast.error(isBg ? "Невалиден slug (a-z, 0-9, тире)" : "Invalid slug (a-z, 0-9, hyphens)");
      return;
    }
    const result = await insertSitePage({
      slug: s,
      title: title.trim() || s,
      locale,
      document: createDefaultDocument(),
    });
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(isBg ? "Страницата е създадена" : "Page created");
    navigate(`/admin/editor/${result.id}`);
  };

  return (
    <main className="pt-20">
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <Layout className="h-5 w-5 text-accent" />
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body">
              {isBg ? "Студио" : "Site Studio"}
            </p>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            {isBg ? "Визуален редактор" : "Visual page editor"}
          </h1>
          <p className="text-muted-foreground font-body mb-8 max-w-2xl">
            {isBg
              ? "Създавайте страници с drag & drop, JSON схема и инспектор — без raw HTML."
              : "Build pages with drag & drop, JSON schema storage, and a right-hand inspector — no raw HTML."}
          </p>

          <div className="rounded-md border border-border bg-card p-6 mb-10">
            <h2 className="font-body text-sm font-bold uppercase tracking-wider mb-4">
              {isBg ? "Нова страница" : "New page"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-page" />
              </div>
              <div className="grid gap-2">
                <Label>{isBg ? "Заглавие" : "Title"}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Page" />
              </div>
            </div>
            <Button className="mt-4" variant="gold" onClick={() => void handleCreate()}>
              <Plus className="mr-2 h-4 w-4" />
              {isBg ? "Създай и редактирай" : "Create & edit"}
            </Button>
          </div>

          {error ? (
            <p className="text-destructive text-sm font-body mb-4">
              {error}
              {error.includes("site_pages")
                ? ` — ${isBg ? "Приложете миграцията site_pages в Supabase." : "Apply the site_pages migration in Supabase."}`
                : null}
            </p>
          ) : null}

          <h2 className="font-body text-sm font-bold uppercase tracking-wider mb-3">
            {isBg ? "Страници" : "Pages"}
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">{isBg ? "Зареждане…" : "Loading…"}</p>
          ) : (
            <ul className="space-y-2">
              {pages.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded border border-border bg-background px-4 py-3"
                >
                  <div>
                    <p className="font-body font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">/pages/{p.slug}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/editor/${p.id}`}>
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      {isBg ? "Редактирай" : "Edit"}
                    </Link>
                  </Button>
                </li>
              ))}
              {pages.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body">
                  {isBg ? "Няма страници още." : "No pages yet."}
                </p>
              ) : null}
            </ul>
          )}
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => void refresh()}>
            {isBg ? "Опресни" : "Refresh"}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default AdminSiteStudio;
