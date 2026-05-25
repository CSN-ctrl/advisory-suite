import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CanvasRenderer } from "@/components/page-editor/CanvasRenderer";
import { fetchSitePageBySlug } from "@/hooks/use-site-pages";
import { useLocale } from "@/hooks/use-locale";
import { createDefaultDocument } from "@/lib/canvas-document";

const DynamicSitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [canvasDoc, setCanvasDoc] = useState(createDefaultDocument());

  useEffect(() => {
    if (!slug) return;
    void fetchSitePageBySlug(slug, locale).then((row) => {
      if (row) {
        setPageTitle(row.title);
        setCanvasDoc(row.document);
        window.document.title = `${row.title} — DestinyQ`;
      }
      setLoading(false);
    });
  }, [slug, locale]);

  if (loading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center pt-20">
        <p className="text-muted-foreground font-body text-sm">Loading…</p>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-16">
      <div className="container py-8">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.15em] text-accent font-body font-bold hover:text-accent/80"
        >
          ← Home
        </Link>
        <h1 className="font-serif text-3xl text-foreground mt-6 mb-8 sr-only">{pageTitle}</h1>
      </div>
      <div className="overflow-x-auto px-4">
        <CanvasRenderer document={canvasDoc} scale={1} className="mx-auto max-w-full" />
      </div>
    </main>
  );
};

export default DynamicSitePage;
