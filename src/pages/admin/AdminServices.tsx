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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import {
  deleteServiceAdmin,
  fetchAllServicesAdmin,
  upsertServiceAdmin,
  type ServiceRow,
  type ServiceTranslationRow,
} from "@/lib/services-store";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";

type EditableService = ServiceRow & { translations: Record<string, ServiceTranslationRow> };

function emptyTranslation(): Omit<ServiceTranslationRow, "service_id" | "locale"> {
  return {
    title: "",
    items: [],
    who_for: "",
    included: "",
    format: "",
    timeline: "",
    cta_label: "",
  };
}

function itemsToText(items: string[]): string {
  return items.join("\n");
}

function textToItems(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const AdminServices = () => {
  const locale = useLocale();
  const isBg = locale === "bg";
  const { setAdminAuthenticated } = useAdmin();
  const [services, setServices] = useState<EditableService[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<{
    id: string;
    sort_order: number;
    price_amount: string;
    price_display: string;
    is_apply: boolean;
    is_active: boolean;
    bookable: boolean;
    en: ReturnType<typeof emptyTranslation> & { itemsText: string };
    bg: ReturnType<typeof emptyTranslation> & { itemsText: string };
  } | null>(null);

  const t = isBg
    ? {
        title: "Каталог услуги",
        subtitle: "Цени, bookable/apply и преводи без redeploy.",
        back: "← Pages Hub",
        signOut: "Изход",
        newService: "Нова услуга",
        save: "Запази",
        delete: "Изтрий",
        loginTitle: "Вход като администратор",
        id: "ID (slug)",
        sort: "Ред",
        priceAmount: "Цена (число)",
        priceDisplay: "Цена (текст)",
        isApply: "Apply форма (без booking)",
        bookable: "Bookable",
        active: "Активна",
        en: "English",
        bg: "Български",
        titleLb: "Заглавие",
        itemsLb: "Точки (един ред = един item)",
        whoFor: "За кого",
        included: "Включва",
        format: "Формат",
        timeline: "Timeline",
        cta: "CTA label",
        empty: "Няма услуги. Seed-нете с npm run seed:services.",
      }
    : {
        title: "Services catalog",
        subtitle: "Manage prices, bookable/apply flags, and localized copy without redeploying.",
        back: "← Pages Hub",
        signOut: "Sign out",
        newService: "New service",
        save: "Save",
        delete: "Delete",
        loginTitle: "Sign in as admin",
        id: "ID (slug)",
        sort: "Sort order",
        priceAmount: "Price (number)",
        priceDisplay: "Price (display text)",
        isApply: "Apply form (no booking)",
        bookable: "Bookable",
        active: "Active",
        en: "English",
        bg: "Bulgarian",
        titleLb: "Title",
        itemsLb: "Bullet items (one per line)",
        whoFor: "Who for",
        included: "Included",
        format: "Format",
        timeline: "Timeline",
        cta: "CTA label",
        empty: "No services yet. Run npm run seed:services after applying the migration.",
      };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchAllServicesAdmin();
      setServices(rows);
      setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = services.find((s) => s.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      return;
    }
    const en = selected.translations.en ?? emptyTranslation();
    const bg = selected.translations.bg ?? emptyTranslation();
    setDraft({
      id: selected.id,
      sort_order: selected.sort_order,
      price_amount: selected.price_amount?.toString() ?? "",
      price_display: selected.price_display ?? "",
      is_apply: selected.is_apply,
      is_active: selected.is_active,
      bookable: selected.bookable,
      en: { ...en, itemsText: itemsToText(en.items) },
      bg: { ...bg, itemsText: itemsToText(bg.items) },
    });
  }, [selected]);

  const handleNew = () => {
    const id = `service-${Date.now()}`;
    setSelectedId(id);
    setDraft({
      id,
      sort_order: services.length,
      price_amount: "",
      price_display: "",
      is_apply: false,
      is_active: true,
      bookable: true,
      en: { ...emptyTranslation(), itemsText: "" },
      bg: { ...emptyTranslation(), itemsText: "" },
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const priceAmount = draft.price_amount.trim() ? Number(draft.price_amount) : null;
    const result = await upsertServiceAdmin({
      id: draft.id,
      sort_order: draft.sort_order,
      price_amount: Number.isFinite(priceAmount) ? priceAmount : null,
      price_display: draft.price_display.trim() || null,
      is_apply: draft.is_apply,
      is_active: draft.is_active,
      bookable: draft.bookable,
      translations: {
        en: {
          title: draft.en.title,
          items: textToItems(draft.en.itemsText),
          who_for: draft.en.who_for,
          included: draft.en.included,
          format: draft.en.format,
          timeline: draft.en.timeline,
          cta_label: draft.en.cta_label,
        },
        bg: {
          title: draft.bg.title,
          items: textToItems(draft.bg.itemsText),
          who_for: draft.bg.who_for,
          included: draft.bg.included,
          format: draft.bg.format,
          timeline: draft.bg.timeline,
          cta_label: draft.bg.cta_label,
        },
      },
    });
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isBg ? "Запазено" : "Saved");
    await load();
    setSelectedId(draft.id);
  };

  const handleDelete = async () => {
    if (!draft) return;
    if (!window.confirm(isBg ? "Изтриване на услугата?" : "Delete this service?")) return;
    const result = await deleteServiceAdmin(draft.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isBg ? "Изтрито" : "Deleted");
    setSelectedId(null);
    await load();
  };

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
    } catch {
      /* ignore */
    }
    setAdminAuthenticated(false);
  };

  const updateLocaleField = (loc: "en" | "bg", field: keyof (typeof draft)["en"], value: string) => {
    if (!draft) return;
    setDraft({ ...draft, [loc]: { ...draft[loc], [field]: value } });
  };

  return (
    <AdminGate loginTitle={t.loginTitle} backHref="/admin/pages" backLabel={t.back} fullScreen>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-navy px-4 py-3 text-white sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif text-xl sm:text-2xl">{t.title}</h1>
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

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            <p className="font-body text-sm text-muted-foreground">{t.subtitle}</p>
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleNew}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              {t.newService}
            </Button>
            {loading ? (
              <p className="text-sm text-muted-foreground">…</p>
            ) : services.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <ul className="space-y-1">
                {services.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-body transition-colors ${
                        selectedId === s.id ? "bg-accent/15 text-foreground" : "hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {s.translations.en?.title || s.id}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            {!draft ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t.id}</Label>
                    <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.sort}</Label>
                    <Input
                      type="number"
                      value={draft.sort_order}
                      onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.priceAmount}</Label>
                    <Input value={draft.price_amount} onChange={(e) => setDraft({ ...draft, price_amount: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.priceDisplay}</Label>
                    <Input value={draft.price_display} onChange={(e) => setDraft({ ...draft, price_display: e.target.value })} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={draft.is_apply} onCheckedChange={(v) => setDraft({ ...draft, is_apply: v })} />
                    <Label>{t.isApply}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={draft.bookable} onCheckedChange={(v) => setDraft({ ...draft, bookable: v })} />
                    <Label>{t.bookable}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
                    <Label>{t.active}</Label>
                  </div>
                </div>

                <Tabs defaultValue="en">
                  <TabsList>
                    <TabsTrigger value="en">{t.en}</TabsTrigger>
                    <TabsTrigger value="bg">{t.bg}</TabsTrigger>
                  </TabsList>
                  {(["en", "bg"] as const).map((loc) => (
                    <TabsContent key={loc} value={loc} className="grid gap-4 pt-4">
                      <div className="grid gap-2">
                        <Label>{t.titleLb}</Label>
                        <Input value={draft[loc].title} onChange={(e) => updateLocaleField(loc, "title", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.itemsLb}</Label>
                        <Textarea
                          rows={5}
                          value={draft[loc].itemsText}
                          onChange={(e) => updateLocaleField(loc, "itemsText", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.whoFor}</Label>
                        <Textarea rows={2} value={draft[loc].who_for} onChange={(e) => updateLocaleField(loc, "who_for", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.included}</Label>
                        <Textarea rows={2} value={draft[loc].included} onChange={(e) => updateLocaleField(loc, "included", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.format}</Label>
                        <Textarea rows={2} value={draft[loc].format} onChange={(e) => updateLocaleField(loc, "format", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.timeline}</Label>
                        <Input value={draft[loc].timeline} onChange={(e) => updateLocaleField(loc, "timeline", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.cta}</Label>
                        <Input
                          value={draft[loc].cta_label ?? ""}
                          onChange={(e) => updateLocaleField(loc, "cta_label", e.target.value)}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="gold" disabled={saving} onClick={() => void handleSave()}>
                    <Save className="mr-1 h-4 w-4" />
                    {saving ? "…" : t.save}
                  </Button>
                  <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => void handleDelete()}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    {t.delete}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminGate>
  );
};

export default AdminServices;
