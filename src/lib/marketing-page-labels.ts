import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { MARKETING_CONTENT_PAGES, type MarketingContentPage } from "@/lib/marketing-canvas-templates";

const EXTRA_LABELS: Record<string, { en: string; bg: string; path: string }> = {
  insight_article: { en: "Insight article (template)", bg: "Статия (шаблон)", path: "/insights" },
  not_found: { en: "404 page", bg: "404 страница", path: "/" },
};

export type EditorPageEntry = {
  contentPage: MarketingContentPage;
  labelEn: string;
  labelBg: string;
  path: string;
};

export function getAllEditorCanvasPages(): EditorPageEntry[] {
  return MARKETING_CONTENT_PAGES.map((contentPage) => {
    const fromMarketing = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
    const extra = EXTRA_LABELS[contentPage];
    return {
      contentPage,
      labelEn: fromMarketing?.labelEn ?? extra?.en ?? contentPage,
      labelBg: fromMarketing?.labelBg ?? extra?.bg ?? contentPage,
      path: fromMarketing?.path ?? extra?.path ?? "/",
    };
  });
}
