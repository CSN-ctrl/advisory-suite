import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/rich-text/RichTextEditor";
import { BlockRenderer } from "@/components/site-page/BlockRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { BLOCK_TYPE_LABELS, createDefaultBlocks, newBlockId, type PageBlock } from "@/lib/site-page-blocks";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { fetchSitePageById, updateSitePageBlocks, type SitePageRow } from "@/hooks/use-site-pages";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

function parseHeadingLevel(v: string): HeadingLevel {
  const n = Number(v);
  return ([1, 2, 3, 4, 5, 6] as const).includes(n as HeadingLevel) ? (n as HeadingLevel) : 2;
}

function moveBlock(blocks: PageBlock[], index: number, dir: -1 | 1): PageBlock[] {
  const next = index + dir;
  if (next < 0 || next >= blocks.length) return blocks;
  const copy = [...blocks];
  const tmp = copy[index];
  copy[index] = copy[next]!;
  copy[next] = tmp!;
  return copy;
}

function BlockEditorCard({
  block,
  locale,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  block: PageBlock;
  locale: string;
  onChange: (next: PageBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  const lb = (type: PageBlock["type"]) => (locale === "bg" ? BLOCK_TYPE_LABELS[type].bg : BLOCK_TYPE_LABELS[type].en);

  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{lb(block.type)}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onMoveUp} disabled={disableUp} aria-label="Move up">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onMoveDown} disabled={disableDown} aria-label="Move down">
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={onRemove} aria-label="Remove block">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {block.type === "heading" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="grid gap-2">
              <Label>Text</Label>
              <Input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select value={String(block.level)} onValueChange={(v) => onChange({ ...block, level: parseHeadingLevel(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      H{n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-xs text-muted-foreground">Preview</p>
            <BlockRenderer blocks={[block]} />
          </div>
        </>
      ) : null}

      {block.type === "richText" ? (
        <RichTextEditor
          key={block.id}
          initialValue={block.html}
          onChange={(html) => onChange({ ...block, html })}
          placeholder="Write content…"
          minHeightPx={200}
        />
      ) : null}

      {block.type === "image" ? (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Image URL (https)</Label>
            <Input value={block.src} onChange={(e) => onChange({ ...block, src: e.target.value })} placeholder="https://…" />
          </div>
          <div className="grid gap-2">
            <Label>Alt text</Label>
            <Input value={block.alt ?? ""} onChange={(e) => onChange({ ...block, alt: e.target.value || undefined })} />
          </div>
        </div>
      ) : null}

      {block.type === "spacer" ? (
        <div className="grid max-w-xs gap-2">
          <Label>Height (px)</Label>
          <Input
            type="number"
            min={8}
            max={400}
            value={block.heightPx}
            onChange={(e) => onChange({ ...block, heightPx: Math.min(400, Math.max(8, Number(e.target.value) || 24)) })}
          />
        </div>
      ) : null}

      {block.type === "divider" ? <p className="text-sm text-muted-foreground">Horizontal rule (no settings)</p> : null}
    </div>
  );
}

const AdminPageBuilder = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const locale = useLocale();
  const { isAdminAuthenticated, isAuthCheckComplete, setAdminAuthenticated } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<SitePageRow | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);
  const [blocks, setBlocks] = useState<PageBlock[]>(createDefaultBlocks());
  const [saving, setSaving] = useState(false);
  const [addType, setAddType] = useState<PageBlock["type"]>("richText");

  const t =
    locale === "bg"
      ? {
          checking: "Проверка…",
          login: "Влезте като администратор от Сайт Студио.",
          loadFail: "Страницата не е намерена.",
          saved: "Записано.",
          saveErr: "Грешка при запис.",
          titleLb: "Заглавие",
          slugLb: "Адрес (slug)",
          publishedLb: "Публикувана",
          preview: "Преглед",
          addBlock: "Добави блок",
          add: "Добави",
          save: "Запази",
          back: "Назад към дървото",
        }
      : {
          checking: "Checking…",
          login: "Sign in as admin from Site Studio.",
          loadFail: "Page not found.",
          saved: "Saved.",
          saveErr: "Save failed.",
          titleLb: "Title",
          slugLb: "URL slug",
          publishedLb: "Published",
          preview: "Preview",
          addBlock: "Add block",
          add: "Add",
          save: "Save",
          back: "Back to tree",
        };

  const load = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    const data = await fetchSitePageById(pageId);
    if (!data) {
      setRow(null);
      setLoading(false);
      return;
    }
    setRow(data);
    setTitle(data.title);
    setSlug(data.slug);
    setPublished(data.published);
    setBlocks(data.blocks);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isAuthCheckComplete) return;
    if (!isAdminAuthenticated) {
      const run = async () => {
        const ok = await checkIsSupabaseAdmin();
        if (!ok) {
          navigate("/admin/site", { replace: true });
        } else {
          setAdminAuthenticated(true);
        }
      };
      void run();
    }
  }, [isAdminAuthenticated, isAuthCheckComplete, navigate, setAdminAuthenticated]);

  const handleSave = async () => {
    if (!pageId || !row) return;
    setSaving(true);
    const { error } = await updateSitePageBlocks(pageId, {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      published,
      blocks,
    });
    setSaving(false);
    if (error) {
      toast.error(`${t.saveErr} ${error}`);
      return;
    }
    toast.success(t.saved);
    void load();
  };

  const addBlock = () => {
    const id = newBlockId();
    let b: PageBlock;
    switch (addType) {
      case "heading":
        b = { id, type: "heading", level: 2, text: "New heading" };
        break;
      case "image":
        b = { id, type: "image", src: "https://", alt: "" };
        break;
      case "spacer":
        b = { id, type: "spacer", heightPx: 32 };
        break;
      case "divider":
        b = { id, type: "divider" };
        break;
      default:
        b = { id, type: "richText", html: "<p></p>" };
    }
    setBlocks((prev) => [...prev, b]);
  };

  if (!isAuthCheckComplete || !isAdminAuthenticated) {
    return (
      <main className="pt-20">
        <div className="container max-w-3xl py-16">
          <p className="text-sm text-muted-foreground">{t.checking}</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="pt-20">
        <div className="container max-w-3xl py-16">
          <p className="text-sm text-muted-foreground">{t.checking}</p>
        </div>
      </main>
    );
  }

  if (!row) {
    return (
      <main className="pt-20">
        <div className="container max-w-3xl py-16">
          <p className="mb-4 text-muted-foreground">{t.loadFail}</p>
          <Button asChild variant="outline">
            <Link to="/admin/site">{t.back}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-24">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/site">{t.back}</Link>
            </Button>
            <Button type="button" variant="gold" className="gap-2" disabled={saving} onClick={() => void handleSave()}>
              <Save className="h-4 w-4" />
              {saving ? "…" : t.save}
            </Button>
          </div>

          <div className="mb-8 grid gap-4 rounded-md border border-border bg-card p-5">
            <div className="grid gap-2">
              <Label htmlFor="pg-title">{t.titleLb}</Label>
              <Input id="pg-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pg-slug">{t.slugLb}</Label>
              <Input id="pg-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Live URL: <code className="rounded bg-muted px-1">/pages/{slug || "…"}</code>
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
              <span className="text-sm">{t.publishedLb}</span>
              <Switch checked={published} onCheckedChange={setPublished} data-edit-allow="true" />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-end gap-2">
            <div className="grid gap-2">
              <Label>{t.addBlock}</Label>
              <Select value={addType} onValueChange={(v) => setAddType(v as PageBlock["type"])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BLOCK_TYPE_LABELS) as PageBlock["type"][]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {locale === "bg" ? BLOCK_TYPE_LABELS[type].bg : BLOCK_TYPE_LABELS[type].en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={addBlock}>
              <Plus className="h-4 w-4" />
              {t.add}
            </Button>
          </div>

          <div className="space-y-6">
            {blocks.map((block, i) => (
              <BlockEditorCard
                key={block.id}
                block={block}
                locale={locale}
                onChange={(next) => setBlocks((prev) => prev.map((b) => (b.id === block.id ? next : b)))}
                onRemove={() => setBlocks((prev) => prev.filter((b) => b.id !== block.id))}
                onMoveUp={() => setBlocks((prev) => moveBlock(prev, i, -1))}
                onMoveDown={() => setBlocks((prev) => moveBlock(prev, i, 1))}
                disableUp={i === 0}
                disableDown={i === blocks.length - 1}
              />
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.preview}</p>
            <div className="rounded-md border border-dashed border-border bg-secondary/20 p-6">
              <h2 className="mb-6 font-serif text-2xl text-foreground">{title}</h2>
              <BlockRenderer blocks={blocks} />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AdminPageBuilder;
