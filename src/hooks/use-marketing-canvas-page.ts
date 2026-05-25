import { useCallback, useEffect, useState } from "react";
import {
  marketingCanvasSlug,
  marketingPageFromPath,
} from "@/lib/marketing-canvas";
import { createMarketingLayoutDocument } from "@/lib/marketing-canvas-templates";
import { getAllEditorCanvasPages } from "@/lib/marketing-page-labels";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import {
  fetchSitePageById,
  fetchSitePageBySlug,
  insertSitePage,
  updateSitePage,
  type SitePageRow,
} from "@/hooks/use-site-pages";
import type { CanvasDocument } from "@/lib/canvas-document";

export async function ensureMarketingCanvasPage(
  contentPage: string,
  locale: string,
): Promise<{ row: SitePageRow } | { error: string }> {
  const slug = marketingCanvasSlug(contentPage, locale);
  let existing = await fetchSitePageBySlug(slug, locale);
  if (!existing) {
    const def = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
    const title = locale === "bg" ? def?.labelBg ?? contentPage : def?.labelEn ?? contentPage;
    const created = await insertSitePage({
      slug,
      title: `${title} layout`,
      locale,
      editor: "canvas",
      document: createMarketingLayoutDocument(contentPage, title),
    });
    if ("error" in created) {
      return { error: created.error };
    }
    existing = await fetchSitePageById(created.id);
  }
  if (!existing) {
    return { error: "Page layout not found" };
  }
  return { row: existing };
}

/** Creates canvas layout rows for every marketing content page (idempotent). */
export async function ensureAllMarketingCanvasPages(locale: string): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;
  for (const entry of getAllEditorCanvasPages()) {
    const slug = marketingCanvasSlug(entry.contentPage, locale);
    const existing = await fetchSitePageBySlug(slug, locale);
    if (existing) continue;
    const title = locale === "bg" ? entry.labelBg : entry.labelEn;
    const result = await insertSitePage({
      slug,
      title: `${title} layout`,
      locale,
      editor: "canvas",
      document: createMarketingLayoutDocument(entry.contentPage, title),
    });
    if ("error" in result) {
      errors.push(`${entry.contentPage}: ${result.error}`);
    } else {
      created += 1;
    }
  }
  return { created, errors };
}

export function useMarketingCanvasPage(pathname: string, locale: string) {
  const contentPage = marketingPageFromPath(pathname);
  const [row, setRow] = useState<SitePageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!contentPage) {
      setRow(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const slug = marketingCanvasSlug(contentPage, locale);
    try {
      let existing = await fetchSitePageBySlug(slug, locale);
      if (!existing) {
        const def = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
        const title = locale === "bg" ? def?.labelBg ?? contentPage : def?.labelEn ?? contentPage;
        const created = await insertSitePage({
          slug,
          title: `${title} layout`,
          locale,
          editor: "canvas",
          document: createMarketingLayoutDocument(contentPage, title),
        });
        if ("error" in created) {
          setError(created.error);
          setRow(null);
          return;
        }
        existing = await fetchSitePageById(created.id);
      }
      setRow(existing);
    } catch {
      setError("Failed to load page layout");
      setRow(null);
    } finally {
      setLoading(false);
    }
  }, [contentPage, locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveDocument = useCallback(
    async (document: CanvasDocument) => {
      if (!row) return { error: "No layout page" };
      const result = await updateSitePage(row.id, { document });
      if (!result.error) {
        setRow((prev) => (prev ? { ...prev, document } : prev));
      }
      return result;
    },
    [row],
  );

  return { contentPage, row, loading, error, refresh, saveDocument };
}
