import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CanvasRenderer } from "@/components/page-editor/CanvasRenderer";
import { MarketingLayoutProvider } from "@/contexts/MarketingLayoutContext";
import { fetchSitePageBySlug } from "@/hooks/use-site-pages";
import { useLocale } from "@/hooks/use-locale";
import { useAdmin } from "@/contexts/AdminContext";
import { marketingCanvasSlug } from "@/lib/marketing-canvas";
import type { CanvasDocument } from "@/lib/canvas-document";
import {
  buildMarketingBlockLayout,
  marketingBlocksLayoutIsActive,
} from "@/lib/marketing-block-layout";
import {
  documentUsesCanvasRenderer,
  isCanvasDocument,
  normalizeCanvasDocument,
} from "@/lib/canvas-document";

type ViewMode = "loading" | "canvas" | "blocks-layout" | "legacy";

interface MarketingPageShellProps {
  contentPage: string;
  children: ReactNode;
}

export function MarketingPageShell({ contentPage, children }: MarketingPageShellProps) {
  const locale = useLocale();
  const { isAdminAuthenticated } = useAdmin();
  const [mode, setMode] = useState<ViewMode>("loading");
  const [document, setDocument] = useState<CanvasDocument | null>(null);

  const blockLayout = useMemo(
    () => (document ? buildMarketingBlockLayout(document) : new Map()),
    [document],
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setMode("loading");
      try {
        const slug = marketingCanvasSlug(contentPage, locale);
        const row = await fetchSitePageBySlug(slug, locale);
        if (cancelled) return;

        const canUse =
          row?.editor === "canvas" &&
          isCanvasDocument(row.document) &&
          (row.published || isAdminAuthenticated);

        if (canUse) {
          const doc = normalizeCanvasDocument(row.document);
          if (doc.elements.length > 0 && marketingBlocksLayoutIsActive(doc)) {
            setDocument(doc);
            setMode("blocks-layout");
            return;
          }
          // Full canvas JSON replaces the React page — admin preview only on marketing routes.
          if (
            doc.elements.length > 0 &&
            documentUsesCanvasRenderer(doc) &&
            isAdminAuthenticated
          ) {
            setDocument(doc);
            setMode("canvas");
            return;
          }
        }
      } catch {
        /* missing Supabase env or network — show normal React page */
      }
      if (cancelled) return;
      setDocument(null);
      setMode("legacy");
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [contentPage, locale, isAdminAuthenticated]);

  if (mode === "loading") {
    return <>{children}</>;
  }

  if (mode === "canvas" && document) {
    return (
      <main className="min-w-0 pt-20 pb-16">
        <div className="overflow-x-auto">
          <CanvasRenderer document={document} scale={1} className="mx-auto max-w-full shadow-lg" />
        </div>
      </main>
    );
  }

  if (mode === "blocks-layout" && document) {
    return (
      <MarketingLayoutProvider contentPage={contentPage} layout={blockLayout} active>
        {children}
      </MarketingLayoutProvider>
    );
  }

  return <>{children}</>;
}
