import type { ComponentType } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getLocalizedInsights } from "@/data/insights";
import type { Locale } from "@/hooks/use-locale";
import type { MarketingContentPage } from "@/lib/marketing-canvas-templates";
import Index from "@/pages/Index";
import Advisory from "@/pages/Advisory";
import About from "@/pages/About";
import Mission from "@/pages/Mission";
import Insights from "@/pages/Insights";
import InsightArticle from "@/pages/InsightArticle";
import Applications from "@/pages/Applications";
import WhoBenefits from "@/pages/WhoBenefits";
import Apply from "@/pages/Apply";
import NotFound from "@/pages/NotFound";

const PAGE_COMPONENTS: Record<MarketingContentPage, ComponentType> = {
  home: Index,
  about: About,
  mission: Mission,
  advisory: Advisory,
  applications: Applications,
  who_benefits: WhoBenefits,
  insights: Insights,
  apply: Apply,
  insight_article: InsightArticle,
  not_found: NotFound,
};

interface MarketingPagePreviewProps {
  contentPage: MarketingContentPage;
  locale: string;
}

/** Renders the real marketing page inside the admin canvas editor (no saved canvas takeover). */
export function MarketingPagePreview({ contentPage, locale }: MarketingPagePreviewProps) {
  const Page = PAGE_COMPONENTS[contentPage] ?? NotFound;

  if (contentPage === "insight_article") {
    const insights = getLocalizedInsights(locale as Locale);
    const slug = insights[0]?.slug ?? "preview";
    return (
      <MemoryRouter initialEntries={[`/insights/${slug}`]}>
        <Routes>
          <Route path="/insights/:slug" element={<Page />} />
        </Routes>
      </MemoryRouter>
    );
  }

  return <Page />;
}
