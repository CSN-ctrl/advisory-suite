import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CanvasRenderer } from "@/components/page-editor/CanvasRenderer";
import { fetchSitePageBySlug } from "@/hooks/use-site-pages";
import { useLocale } from "@/hooks/use-locale";
import {
  marketingCanvasSlug,
  marketingPathFromContentPage,
} from "@/lib/marketing-canvas";
import type { CanvasDocument } from "@/lib/canvas-document";
import { isCanvasDocument, normalizeCanvasDocument } from "@/lib/canvas-document";

type ViewMode = "loading" | "canvas" | "legacy";

interface MarketingPageShellProps {
  contentPage: string;
  children: ReactNode;
}

export function MarketingPageShell({ contentPage, children }: MarketingPageShellProps) {
  const locale = useLocale();
  const [mode, setMode] = useState<ViewMode>("loading");
  const [document, setDocument] = useState<CanvasDocument | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setMode("loading");
      const slug = marketingCanvasSlug(contentPage, locale);
      const row = await fetchSitePageBySlug(slug, locale);
      if (cancelled) return;
      if (row?.editor === "canvas" && isCanvasDocument(row.document)) {
        const doc = normalizeCanvasDocument(row.document);
        if (doc.elements.length > 0) {
          setDocument(doc);
          setMode("canvas");
          return;
        }
      }
      setDocument(null);
      setMode("legacy");
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [contentPage, locale]);

  if (mode === "loading") {
    return (
      <main className="flex min-h-[40vh] items-center justify-center pt-20">
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (mode === "canvas" && document) {
    const livePath = marketingPathFromContentPage(contentPage);
    return (
      <main className="min-w-0 pt-20 pb-16">
        <div className="overflow-x-auto">
          <CanvasRenderer document={document} scale={1} className="mx-auto max-w-full shadow-lg" />
        </div>
        <p className="sr-only">
          <Link to={livePath}>Continue to page</Link>
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
