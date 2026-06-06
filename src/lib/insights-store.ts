import type { Insight } from "@/data/insights";
import { getSupabaseBrowserClient, tryGetSupabaseBrowserClient } from "@/integrations/supabase/client";

export interface InsightRow {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  article_date: string;
  meta_description: string;
  sort_order: number;
  published: boolean;
  updated_at: string;
}

function mapRow(row: InsightRow): Insight {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.article_date,
    content: row.content,
    metaDescription: row.meta_description,
  };
}

export async function fetchInsightsFromDb(locale: string): Promise<Insight[]> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return [];

  const loc = locale === "bg" ? "bg" : "en";
  const { data, error } = await sb
    .from("insight_articles")
    .select("id,slug,locale,title,excerpt,content,article_date,meta_description,sort_order,published,updated_at")
    .eq("locale", loc)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) return [];
  return (data as InsightRow[]).map(mapRow);
}

export async function fetchInsightBySlugFromDb(slug: string, locale: string): Promise<Insight | null> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return null;

  const loc = locale === "bg" ? "bg" : "en";
  const { data, error } = await sb
    .from("insight_articles")
    .select("id,slug,locale,title,excerpt,content,article_date,meta_description,sort_order,published,updated_at")
    .eq("slug", slug)
    .eq("locale", loc)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as InsightRow);
}

export async function fetchAllInsightsAdmin(): Promise<InsightRow[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("insight_articles")
    .select("id,slug,locale,title,excerpt,content,article_date,meta_description,sort_order,published,updated_at")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as InsightRow[];
}

export async function upsertInsightAdmin(input: {
  id?: string;
  slug: string;
  locale: "en" | "bg";
  title: string;
  excerpt: string;
  content: string;
  article_date: string;
  meta_description: string;
  sort_order: number;
  published: boolean;
}): Promise<{ id: string } | { error: string }> {
  const sb = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const updatedBy = user?.email?.trim().slice(0, 128) || "admin";

  const payload = {
    slug: input.slug.trim().toLowerCase(),
    locale: input.locale,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    article_date: input.article_date,
    meta_description: input.meta_description,
    sort_order: input.sort_order,
    published: input.published,
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await sb.from("insight_articles").update(payload).eq("id", input.id);
    if (error) return { error: error.message };
    return { id: input.id };
  }

  const { data, error } = await sb.from("insight_articles").insert(payload).select("id").single();
  if (error) return { error: error.message };
  return { id: String((data as { id: string }).id) };
}

export async function deleteInsightAdmin(id: string): Promise<{ error?: string }> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("insight_articles").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
