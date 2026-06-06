import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  ImageIcon,
  Layout,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminGate } from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { createDefaultDocument } from "@/lib/canvas-document";
import { ensureAllMarketingCanvasPages } from "@/hooks/use-marketing-canvas-page";
import {
  buildAllHubEntries,
  editorKindLabel,
  type HubPageEntry,
} from "@/lib/pages-hub";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import {
  deleteSitePage,
  insertSitePage,
  updateSitePage,
  useSitePagesList,
  type SitePageEditor,
} from "@/hooks/use-site-pages";
import { createDefaultPageDocument } from "@/visual-editor/schema/page-node";
import {
  createPageFromTemplate,
  PAGE_TEMPLATE_OPTIONS,
  type PageTemplateId,
} from "@/visual-editor/lib/page-templates";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function PageRow({
  entry,
  isBg,
  onTogglePublish,
  onDelete,
  t,
}: {
  entry: HubPageEntry;
  isBg: boolean;
  onTogglePublish: (entry: HubPageEntry, next: boolean) => void;
  onDelete?: (id: string) => void;
  t: Record<string, string>;
}) {
  const canPublish = entry.sitePageId != null && entry.category !== "marketing";

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-body text-sm font-medium text-foreground">{entry.title}</p>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {editorKindLabel(entry.editorKind, isBg)}
          </Badge>
          {entry.published === false ? (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {t.draft}
            </Badge>
          ) : entry.published === true ? (
            <Badge className="bg-emerald-600/90 text-[10px] uppercase tracking-wider hover:bg-emerald-600/90">
              {t.published}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {t.liveInline}
            </Badge>
          )}
        </div>
        <code className="mt-1 block break-all font-mono text-[11px] text-muted-foreground">{entry.path}</code>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canPublish ? (
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1">
            <Switch
              checked={entry.published === true}
              onCheckedChange={(checked) => onTogglePublish(entry, checked)}
              aria-label={t.publishToggle}
            />
            <span className="text-xs text-muted-foreground">{t.publishToggle}</span>
          </div>
        ) : null}

        {entry.editorKind === "inline" ? (
          <Button variant="gold" size="sm" asChild>
            <Link to={entry.editHref}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              {t.editInline}
            </Link>
          </Button>
        ) : (
          <Button variant="gold" size="sm" asChild>
            <Link to={entry.editHref}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              {t.edit}
            </Link>
          </Button>
        )}

        <Button variant="outline" size="sm" asChild>
          <a href={entry.previewHref} target="_blank" rel="noreferrer">
            <Eye className="mr-1 h-3.5 w-3.5" />
            {entry.published === false ? t.previewDraft : t.preview}
          </a>
        </Button>

        {entry.category === "custom" && onDelete && entry.sitePageId ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(entry.sitePageId!)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
    </li>
  );
}

const AdminPageEditorDashboard = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setAdminAuthenticated } = useAdmin();
  const { pages, loading, error, refresh } = useSitePagesList(locale);
  const [initBusy, setInitBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newParent, setNewParent] = useState("__none__");
  const [newEditor, setNewEditor] = useState<SitePageEditor>("visual-tree");
  const [newTemplate, setNewTemplate] = useState<PageTemplateId>("blank");

  const isBg = locale === "bg";
  const tab = searchParams.get("tab") ?? "all";

  const t = isBg
    ? {
        title: "Pages Hub",
        subtitle: "Един център за inline, canvas и visual редактори — с draft, preview и publish.",
        all: "Всички",
        marketing: "Маркетинг",
        layouts: "Canvas layouts",
        custom: "Персонализирани",
        media: "Медия",
        services: "Услуги",
        signOut: "Изход",
        backAdmin: "← Админ",
        initAll: "Създай canvas layouts",
        initDone: "Готово: {n} нови layouts.",
        initNone: "Всички layouts вече съществуват.",
        newPage: "Нова страница",
        titleLb: "Заглавие",
        slugLb: "Адрес",
        parentLb: "Под страница",
        noneParent: "— няма —",
        editorLb: "Редактор",
        editorBlocks: "Блокове",
        editorCanvas: "Canvas",
        editorVisual: "Visual DOM",
        templateLb: "Шаблон",
        layoutHint: "Canvas layout управлява ред, видимост и стилове на секциите на живия сайт. Текст и изображения — с Edit Mode.",
        create: "Създай",
        cancel: "Отказ",
        slugAuto: "Попълва се от заглавието.",
        draft: "Draft",
        published: "Published",
        liveInline: "Live (inline)",
        publishToggle: "Publish",
        editInline: "Редактирай на сайта",
        edit: "Редактирай",
        preview: "Preview",
        previewDraft: "Preview draft",
        inlineHint: "Inline страниците се редактират на живия сайт с Edit Mode в хедъра.",
        emptyCustom: "Няма персонализирани страници.",
        loginTitle: "Вход като администратор",
      }
    : {
        title: "Pages Hub",
        subtitle: "One hub for inline, canvas, and visual editors — with draft, preview, and publish.",
        all: "All",
        marketing: "Marketing",
        layouts: "Canvas layouts",
        custom: "Custom",
        media: "Media",
        services: "Services",
        signOut: "Sign out",
        backAdmin: "← Admin",
        initAll: "Create canvas layouts",
        initDone: "Done: {n} new layouts.",
        initNone: "All layouts already exist.",
        newPage: "New page",
        titleLb: "Title",
        slugLb: "Slug",
        parentLb: "Nest under",
        noneParent: "— none —",
        editorLb: "Editor",
        editorBlocks: "Blocks",
        editorCanvas: "Canvas",
        editorVisual: "Visual DOM",
        templateLb: "Template",
        layoutHint: "Canvas layout controls section order, visibility, and wrapper styles on the live site. Edit copy with Edit Mode.",
        create: "Create",
        cancel: "Cancel",
        slugAuto: "Filled from title; adjust if needed.",
        draft: "Draft",
        published: "Published",
        liveInline: "Live (inline)",
        publishToggle: "Publish",
        editInline: "Edit on site",
        edit: "Edit",
        preview: "Preview",
        previewDraft: "Preview draft",
        inlineHint: "Inline pages are edited on the live site using Edit Mode in the header.",
        emptyCustom: "No custom pages yet.",
        loginTitle: "Sign in as admin",
      };

  const allEntries = useMemo(() => buildAllHubEntries(locale, pages, isBg), [locale, pages, isBg]);

  const filtered = useMemo(() => {
    if (tab === "marketing") return allEntries.filter((e) => e.category === "marketing");
    if (tab === "layouts") return allEntries.filter((e) => e.category === "layout");
    if (tab === "custom") return allEntries.filter((e) => e.category === "custom");
    return allEntries;
  }, [allEntries, tab]);

  useEffect(() => {
    void checkIsSupabaseAdmin().then((ok) => {
      if (!ok) setAdminAuthenticated(false);
    });
  }, [setAdminAuthenticated]);

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
    } catch {
      /* ignore */
    }
    setAdminAuthenticated(false);
  };

  const handleInitAll = async () => {
    setInitBusy(true);
    const { created, errors } = await ensureAllMarketingCanvasPages(locale);
    setInitBusy(false);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    if (created === 0) toast.message(t.initNone);
    else toast.success(t.initDone.replace("{n}", String(created)));
    void refresh();
  };

  const handleTogglePublish = async (entry: HubPageEntry, next: boolean) => {
    if (!entry.sitePageId) return;
    const result = await updateSitePage(entry.sitePageId, { published: next });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(next ? (isBg ? "Публикувано" : "Published") : isBg ? "Чернова" : "Saved as draft");
    void refresh();
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm(isBg ? "Изтриване на страницата?" : "Delete this page?")) return;
      const { error: delErr } = await deleteSitePage(id);
      if (delErr) {
        toast.error(delErr);
        return;
      }
      toast.success(isBg ? "Изтрито" : "Deleted");
      void refresh();
    },
    [isBg, refresh],
  );

  const openNewDialog = () => {
    setNewTitle("");
    setNewSlug("");
    setNewParent("__none__");
    setNewEditor("visual-tree");
    setNewTemplate("blank");
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    const title = newTitle.trim();
    const slug = newSlug.trim().toLowerCase() || slugifyTitle(title);
    if (!title || !slug) {
      toast.error(isBg ? "Попълнете заглавие и адрес." : "Enter title and slug.");
      return;
    }
    const res = await insertSitePage({
      slug,
      title,
      locale,
      parent_id: newParent === "__none__" ? null : newParent,
      editor: newEditor,
      document: newEditor === "canvas" ? createDefaultDocument() : undefined,
      pageTree: newEditor === "visual-tree" ? createPageFromTemplate(newTemplate, locale) : undefined,
    });
    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    toast.success(isBg ? "Страницата е създадена като draft" : "Page created as draft");
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

  const setTab = (value: string) => {
    setSearchParams(value === "all" ? {} : { tab: value });
  };

  const customPages = pages.filter((p) => !p.slug.startsWith("layout-"));

  return (
    <AdminGate loginTitle={t.loginTitle} backHref="/admin" backLabel={t.backAdmin} fullScreen>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-navy px-4 py-3 text-white sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent">DestinyQ</p>
              <h1 className="font-serif text-xl sm:text-2xl">{t.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/admin">{t.backAdmin}</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/admin/media">
                  <ImageIcon className="mr-1 h-3.5 w-3.5" />
                  {t.media}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/admin/services">{t.services}</Link>
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

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-6 max-w-3xl font-body text-sm text-muted-foreground">{t.subtitle}</p>

            {error ? (
              <p className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="mb-6 flex flex-wrap gap-2">
              <Button type="button" variant="gold" size="sm" onClick={openNewDialog}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                {t.newPage}
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={initBusy} onClick={() => void handleInitAll()}>
                <Layout className="mr-1 h-3.5 w-3.5" />
                {initBusy ? "…" : t.initAll}
              </Button>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
                <TabsTrigger value="all">{t.all}</TabsTrigger>
                <TabsTrigger value="marketing">{t.marketing}</TabsTrigger>
                <TabsTrigger value="layouts">{t.layouts}</TabsTrigger>
                <TabsTrigger value="custom">{t.custom}</TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-0">
                {tab === "layouts" ? (
                  <p className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-muted-foreground">
                    {t.layoutHint}
                  </p>
                ) : null}

                {tab === "marketing" ? (
                  <p className="mb-4 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                    {t.inlineHint}
                  </p>
                ) : null}

                {loading ? (
                  <p className="text-sm text-muted-foreground font-body">…</p>
                ) : filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">{t.emptyCustom}</p>
                ) : (
                  <ul className="grid gap-3">
                    {filtered.map((entry) => (
                      <PageRow
                        key={entry.id}
                        entry={entry}
                        isBg={isBg}
                        onTogglePublish={(e, next) => void handleTogglePublish(e, next)}
                        onDelete={entry.category === "custom" ? handleDelete : undefined}
                        t={t}
                      />
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.newPage}</DialogTitle>
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
              {newEditor === "visual-tree" ? (
                <div className="grid gap-2">
                  <Label>{t.templateLb}</Label>
                  <Select value={newTemplate} onValueChange={(v) => setNewTemplate(v as PageTemplateId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_TEMPLATE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {isBg ? opt.bg : opt.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PAGE_TEMPLATE_OPTIONS.find((o) => o.id === newTemplate)?.[isBg ? "descriptionBg" : "descriptionEn"]}
                  </p>
                </div>
              ) : null}
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
                    {customPages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} ({p.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button type="button" variant="gold" onClick={() => void handleCreate()}>
                {t.create}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </AdminGate>
  );
};

export default AdminPageEditorDashboard;
