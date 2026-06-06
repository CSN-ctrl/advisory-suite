import { getSupabaseBrowserClient, tryGetSupabaseBrowserClient } from "@/integrations/supabase/client";
import type { Service } from "@/data/services";

export interface ServiceRow {
  id: string;
  sort_order: number;
  price_amount: number | null;
  price_display: string | null;
  is_apply: boolean;
  is_active: boolean;
  bookable: boolean;
  updated_at: string;
}

export interface ServiceTranslationRow {
  service_id: string;
  locale: string;
  title: string;
  items: string[];
  who_for: string;
  included: string;
  format: string;
  timeline: string;
  cta_label: string | null;
}

function mapToService(row: ServiceRow, tr: ServiceTranslationRow): Service {
  const price =
    tr.locale === "en" || row.price_display
      ? row.price_display ?? (row.price_amount != null ? `${row.price_amount} €` : undefined)
      : row.price_display ?? (row.price_amount != null ? `${row.price_amount} €` : undefined);

  return {
    id: row.id,
    title: tr.title,
    price,
    items: tr.items ?? [],
    whoFor: tr.who_for,
    included: tr.included,
    format: tr.format,
    timeline: tr.timeline,
    ctaLabel: tr.cta_label ?? undefined,
    isApply: row.is_apply,
    bookable: row.bookable,
  };
}

export async function fetchServicesFromDb(locale: string): Promise<Service[]> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return [];

  const loc = locale === "bg" ? "bg" : "en";
  const { data: services, error: svcErr } = await sb
    .from("services")
    .select("id,sort_order,price_amount,price_display,is_apply,is_active,bookable,updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (svcErr || !services?.length) return [];

  const ids = services.map((s) => (s as ServiceRow).id);
  const { data: translations, error: trErr } = await sb
    .from("service_translations")
    .select("service_id,locale,title,items,who_for,included,format,timeline,cta_label")
    .in("service_id", ids)
    .eq("locale", loc);

  if (trErr) return [];

  const trByService = new Map(
    (translations ?? []).map((t) => [(t as ServiceTranslationRow).service_id, t as ServiceTranslationRow]),
  );

  const enFallback = loc === "bg"
    ? await sb
        .from("service_translations")
        .select("service_id,locale,title,items,who_for,included,format,timeline,cta_label")
        .in("service_id", ids)
        .eq("locale", "en")
    : null;

  const enByService = new Map(
    (enFallback?.data ?? []).map((t) => [(t as ServiceTranslationRow).service_id, t as ServiceTranslationRow]),
  );

  return (services as ServiceRow[])
    .map((row) => {
      const tr = trByService.get(row.id) ?? enByService.get(row.id);
      if (!tr) return null;
      return mapToService(row, tr);
    })
    .filter((s): s is Service => s != null);
}

export async function fetchAllServicesAdmin(): Promise<
  Array<ServiceRow & { translations: Record<string, ServiceTranslationRow> }>
> {
  const sb = getSupabaseBrowserClient();
  const { data: services, error: svcErr } = await sb
    .from("services")
    .select("id,sort_order,price_amount,price_display,is_apply,is_active,bookable,updated_at")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (svcErr) throw new Error(svcErr.message);

  const ids = (services ?? []).map((s) => (s as ServiceRow).id);
  if (ids.length === 0) return [];

  const { data: translations, error: trErr } = await sb
    .from("service_translations")
    .select("service_id,locale,title,items,who_for,included,format,timeline,cta_label")
    .in("service_id", ids);

  if (trErr) throw new Error(trErr.message);

  const byService = new Map<string, Record<string, ServiceTranslationRow>>();
  for (const raw of translations ?? []) {
    const tr = raw as ServiceTranslationRow;
    if (!byService.has(tr.service_id)) byService.set(tr.service_id, {});
    byService.get(tr.service_id)![tr.locale] = tr;
  }

  return (services as ServiceRow[]).map((row) => ({
    ...row,
    translations: byService.get(row.id) ?? {},
  }));
}

export async function upsertServiceAdmin(input: {
  id: string;
  sort_order: number;
  price_amount: number | null;
  price_display: string | null;
  is_apply: boolean;
  is_active: boolean;
  bookable: boolean;
  translations: Record<"en" | "bg", Omit<ServiceTranslationRow, "service_id" | "locale">>;
}): Promise<{ error?: string }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";

  const { error: svcErr } = await sb.from("services").upsert(
    {
      id: input.id.trim().toLowerCase(),
      sort_order: input.sort_order,
      price_amount: input.price_amount,
      price_display: input.price_display,
      is_apply: input.is_apply,
      is_active: input.is_active,
      bookable: input.bookable,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (svcErr) return { error: svcErr.message };

  const translationRows = (["en", "bg"] as const).map((locale) => ({
    service_id: input.id.trim().toLowerCase(),
    locale,
    ...input.translations[locale],
  }));

  const { error: trErr } = await sb
    .from("service_translations")
    .upsert(translationRows, { onConflict: "service_id,locale" });

  if (trErr) return { error: trErr.message };
  return {};
}

export async function deleteServiceAdmin(id: string): Promise<{ error?: string }> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
