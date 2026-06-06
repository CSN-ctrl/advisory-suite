import { useCallback, useEffect, useState } from "react";
import { getLocalizedInsights, type Insight } from "@/data/insights";
import { fetchInsightBySlugFromDb, fetchInsightsFromDb } from "@/lib/insights-store";

export function useInsights(locale: string) {
  const [insights, setInsights] = useState<Insight[]>(() =>
    getLocalizedInsights(locale === "bg" ? "bg" : "en"),
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fromDb = await fetchInsightsFromDb(locale);
      setInsights(fromDb.length > 0 ? fromDb : getLocalizedInsights(locale === "bg" ? "bg" : "en"));
    } catch {
      setInsights(getLocalizedInsights(locale === "bg" ? "bg" : "en"));
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { insights, loading, refresh };
}

export function useInsightArticle(slug: string | undefined, locale: string) {
  const [article, setArticle] = useState<Insight | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!slug) {
        setArticle(null);
        return;
      }
      try {
        const fromDb = await fetchInsightBySlugFromDb(slug, locale);
        if (cancelled) return;
        if (fromDb) {
          setArticle(fromDb);
          return;
        }
        const fallback = getLocalizedInsights(locale === "bg" ? "bg" : "en").find((i) => i.slug === slug) ?? null;
        setArticle(fallback);
      } catch {
        if (!cancelled) setArticle(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  return article;
}
