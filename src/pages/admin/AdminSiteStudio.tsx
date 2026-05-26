import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileEdit, Layout, LayoutGrid, Lock, LogOut, Plus, Trash2, ExternalLink } from "lucide-react";
import { createDefaultDocument } from "@/lib/canvas-document";
import { createDefaultPageDocument } from "@/visual-editor/schema/page-node";
import type { SitePageEditor } from "@/hooks/use-site-pages";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { deleteSitePage, insertSitePage, useSitePagesList, type SitePageRow } from "@/hooks/use-site-pages";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function SitePageTree({
  roots,
  byParent,
  depth,
  onDelete,
}: {
  roots: SitePageRow[];
  byParent: Map<string | null, SitePageRow[]>;
  depth: number;
  onDelete: (id: string) => void;
}) {
  return (
    <ul className={depth === 0 ? "space-y-2" : "ml-3 mt-1 space-y-2 border-l border-border pl-3 sm:ml-4 sm:pl-3"}>
      {roots.map((p) => {
        const kids = byParent.get(p.id) ?? [];
        return (
          <li key={p.id}>
            <div className="flex flex-col gap-2 rounded-md border border-border/60 bg-muted/20 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-body text-sm font-medium text-foreground">{p.title}</span>
                  {!p.published ? (
                    <span className="text-[10px] uppercase tracking-wider text-amber-600">draft</span>
                  ) : null}
                  {p.editor === "canvas" ? (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">canvas</span>
                  ) : null}
                  {p.editor === "visual-tree" ? (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">visual</span>
                  ) : null}
                </div>
                <code className="block max-w-full break-all rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  /{p.slug}
                </code>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="min-h-10 touch-manipulation text-xs sm:min-h-8">
                  <Link
                    to={
                      p.editor === "visual-tree"
                        ? `/admin/visual-builder/${p.id}`
                        : p.editor === "canvas"
                          ? `/admin/editor/${p.id}`
                          : `/admin/site/page/${p.id}`
                    }
                  >
                    {p.editor === "visual-tree" ? (
                      <LayoutGrid className="mr-1 h-3 w-3" />
                    ) : p.editor === "canvas" ? (
                      <Layout className="mr-1 h-3 w-3" />
                    ) : (
                      <FileEdit className="mr-1 h-3 w-3" />
                    )}
                    {p.editor === "visual-tree" ? "Visual" : p.editor === "canvas" ? "Canvas" : "Builder"}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="min-h-10 touch-manipulation text-xs sm:min-h-8" disabled={!p.published}>
                  <a href={`/pages/${p.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 touch-manipulation text-destructive hover:text-destructive sm:min-h-8"
                  onClick={() => void onDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4 sm:h-3 sm:w-3" />
                </Button>
              </div>
            </div>
            {kids.length > 0 ? (
              <SitePageTree roots={kids} byParent={byParent} depth={depth + 1} onDelete={onDelete} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

const AdminSiteStudio = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAdminAuthenticated, setAdminAuthenticated, isAuthCheckComplete } = useAdmin();
  const { pages, loading, error, refresh } = useSitePagesList(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newParent, setNewParent] = useState<string>("__none__");
  const [newEditor, setNewEditor] = useState<SitePageEditor>("blocks");

  const t =
    locale === "bg"
      ? {
          checking: "Проверка…",
          loginTitle: "Вход като администратор",
          emailPh: "Имейл",
          passPh: "Парола",
          enter: "Вход",
          badPassword: "Грешна парола.",
          notAuthorized: "Нямате админ права.",
          authFail: "Неуспешен вход.",
          welcome: "Добре дошли.",
          signOut: "Изход",
          marketing: "Страници на сайта (редакция в сайта)",
          marketingHint: "Включете „Режим редакция“ в хедъра и редактирайте директно на всяка страница.",
          custom: "Персонализирани страници (без код)",
          customHint: "Създайте нова страница, после добавяйте блокове в конструктора.",
          newPage: "Нова страница",
          titleLb: "Заглавие",
          slugLb: "Адрес (латиница)",
          parentLb: "Под страница на",
          noneParent: "— няма —",
          create: "Създай",
          cancel: "Отказ",
          slugAuto: "Попълва се от заглавието; може да редактирате.",
          access: "Сайт Студио",
          editorLb: "Тип редактор",
          editorBlocks: "Блокове (TipTap)",
          editorCanvas: "Платно (drag & drop)",
          editorVisual: "Визуален DOM редактор",
        }
      : {
          checking: "Checking…",
          loginTitle: "Sign in as admin",
          emailPh: "Email",
          passPh: "Password",
          enter: "Sign in",
          badPassword: "Incorrect password.",
          notAuthorized: "Not authorized for admin.",
          authFail: "Sign-in failed.",
          welcome: "Welcome.",
          signOut: "Sign out",
          marketing: "Marketing pages (edit on the live site)",
          marketingHint: 'Turn on "Edit Mode" in the header, then edit copy directly on each route.',
          custom: "Custom pages (no code)",
          customHint: "Create a page, then stack blocks in the visual builder.",
          newPage: "New page",
          titleLb: "Title",
          slugLb: "URL slug (lowercase)",
          parentLb: "Nest under",
          noneParent: "— none —",
          create: "Create",
          cancel: "Cancel",
          slugAuto: "Filled from title; you can adjust before saving.",
          access: "Site Studio",
          editorLb: "Editor type",
          editorBlocks: "Blocks (TipTap)",
          editorCanvas: "Canvas (drag & drop)",
          editorVisual: "Visual DOM builder",
        };

  const byParent = useMemo(() => {
    const m = new Map<string | null, SitePageRow[]>();
    for (const p of pages) {
      const k = p.parent_id;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(p);
    }
    for (const arr of m.values()) {
      arr.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
    }
    return m;
  }, [pages]);

  const roots = byParent.get(null) ?? [];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client = getSupabaseBrowserClient();
      const { error: signError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signError) {
        toast.error(signError.message || t.badPassword);
        return;
      }
      const ok = await checkIsSupabaseAdmin();
      if (!ok) {
        await client.auth.signOut();
        toast.error(t.notAuthorized);
        return;
      }
      setAdminAuthenticated(true);
      toast.success(t.welcome);
    } catch {
      toast.error(t.authFail);
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm(locale === "bg" ? "Изтриване на страницата?" : "Delete this page?")) return;
      const { error: delErr } = await deleteSitePage(id);
      if (delErr) {
        toast.error(delErr);
        return;
      }
      toast.success(locale === "bg" ? "Изтрито" : "Deleted");
      void refresh();
    },
    [locale, refresh],
  );

  const openNewDialog = () => {
    setNewTitle("");
    setNewSlug("");
    setNewParent("__none__");
    setNewEditor("blocks");
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    const title = newTitle.trim();
    const slug = newSlug.trim().toLowerCase() || slugifyTitle(title);
    if (!title || !slug) {
      toast.error(locale === "bg" ? "Попълнете заглавие и адрес." : "Enter title and slug.");
      return;
    }
    const res = await insertSitePage({
      slug,
      title,
      locale,
      parent_id: newParent === "__none__" ? null : newParent,
      editor: newEditor,
      document: newEditor === "canvas" ? createDefaultDocument() : undefined,
      pageTree: newEditor === "visual-tree" ? createDefaultPageDocument() : undefined,
    });
    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    toast.success(locale === "bg" ? "Страницата е създадена" : "Page created");
    setDialogOpen(false);
    void refresh();
    navigate(
      newEditor === "visual-tree"
        ? `/admin/visual-builder/${res.id}`
        : newEditor === "canvas"
          ? `/admin/editor/${res.id}`
          : `/admin/site/page/${res.id}`,
    );
  };

  useEffect(() => {
    if (dialogOpen && newTitle && !newSlug) {
      setNewSlug(slugifyTitle(newTitle));
    }
  }, [dialogOpen, newTitle, newSlug]);

  if (!isAuthCheckComplete) {
    return (
      <main className="pt-20">
        <div className="container max-w-4xl py-16">
          <p className="text-sm text-muted-foreground font-body">{t.checking}</p>
        </div>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <main className="pt-20">
        <section className="py-12 sm:py-16">
          <div className="container max-w-sm">
            <div className="mb-8 flex items-center gap-3">
              <Lock className="h-5 w-5 text-accent" />
              <h1 className="font-serif text-2xl text-foreground">{t.loginTitle}</h1>
            </div>
            <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
              <Input type="email" autoComplete="username" placeholder={t.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input
                type="password"
                autoComplete="current-password"
                placeholder={t.passPh}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="gold" className="w-full">
                {t.enter}
              </Button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <LayoutGrid className="mt-1 h-6 w-6 text-accent" />
                <div>
                  <p className="mb-1 font-body text-xs uppercase tracking-[0.3em] text-accent/70">{t.access}</p>
                  <h1 className="font-serif text-3xl text-foreground md:text-4xl">
                    <span className="text-gold-gradient">{t.custom}</span>
                  </h1>
                  <p className="mt-2 max-w-xl font-body text-sm text-muted-foreground">{t.customHint}</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                <Button type="button" variant="gold" size="sm" className="min-h-11 w-full touch-manipulation gap-2 sm:min-h-9 sm:w-auto" onClick={openNewDialog}>
                  <Plus className="h-4 w-4" />
                  {t.newPage}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11 w-full touch-manipulation gap-2 sm:min-h-9 sm:w-auto"
                  onClick={() => void getSupabaseBrowserClient().auth.signOut().then(() => setAdminAuthenticated(false))}
                >
                  <LogOut className="h-4 w-4" />
                  {t.signOut}
                </Button>
              </div>
            </div>

            {error ? (
              <p className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}{" "}
                {locale === "bg"
                  ? "Приложете миграцията site_pages в Supabase, ако таблицата липсва."
                  : "Apply the `site_pages` migration in Supabase if this table is missing."}
              </p>
            ) : null}

            <div className="mb-10 rounded-md border border-border bg-card p-4 sm:p-5">
              <p className="mb-1 font-body text-xs uppercase tracking-[0.2em] text-accent/60">{t.marketing}</p>
              <p className="mb-4 text-sm text-muted-foreground">{t.marketingHint}</p>
              <ul className="space-y-3">
                {MARKETING_PAGES.map((m) => (
                  <li key={m.id} className="flex flex-col gap-1 border-b border-border/40 pb-3 font-body text-sm last:border-0 last:pb-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-0">
                    <Link className="min-w-0 shrink-0 text-foreground underline-offset-4 hover:text-accent hover:underline" to={m.path}>
                      {locale === "bg" ? m.labelBg : m.labelEn}
                    </Link>
                    <span className="break-all text-xs text-muted-foreground sm:text-sm">{m.path}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-accent/60">{t.custom}</p>
                {loading ? <span className="text-xs text-muted-foreground">…</span> : null}
              </div>
              {roots.length === 0 && !loading ? (
                <p className="text-sm text-muted-foreground">{locale === "bg" ? "Няма персонализирани страници." : "No custom pages yet."}</p>
              ) : (
                <SitePageTree roots={roots} byParent={byParent} depth={0} onDelete={handleDelete} />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto overflow-x-hidden p-4 sm:max-h-[90dvh] sm:p-6" data-edit-allow="true">
          <DialogHeader>
            <DialogTitle className="pr-6 text-left">{t.newPage}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="np-title">{t.titleLb}</Label>
              <Input id="np-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-slug">{t.slugLb}</Label>
              <Input id="np-slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="my-page" />
              <p className="text-xs text-muted-foreground">{t.slugAuto}</p>
            </div>
            <div className="grid gap-2">
              <Label>{t.editorLb}</Label>
              <Select value={newEditor} onValueChange={(v) => setNewEditor(v as SitePageEditor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocks">{t.editorBlocks}</SelectItem>
                  <SelectItem value="canvas">{t.editorCanvas}</SelectItem>
                  <SelectItem value="visual-tree">{t.editorVisual}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t.parentLb}</Label>
              <Select value={newParent} onValueChange={setNewParent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t.noneParent}</SelectItem>
                  {pages.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} ({p.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0">
            <Button type="button" variant="ghost" className="min-h-11 w-full touch-manipulation sm:min-h-9 sm:w-auto" onClick={() => setDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="button" variant="gold" className="min-h-11 w-full touch-manipulation sm:min-h-9 sm:w-auto" onClick={() => void handleCreate()}>
              {t.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminSiteStudio;
