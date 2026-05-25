import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CanvasRenderer } from "@/components/page-editor/CanvasRenderer";
import { BlockRenderer } from "@/components/site-page/BlockRenderer";
import { fetchSitePageBySlug, type SitePageRow } from "@/hooks/use-site-pages";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";

const DynamicSitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const [page, setPage] = useState<SitePageRow | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!slug) {
        setPage(null);
        return;
      }
      const row = await fetchSitePageBySlug(slug, locale);
      if (!cancelled) {
        setPage(row);
        if (row) {
          window.document.title = `${row.title} — DestinyQ`;
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (page === undefined) {
    return (
      <main className="min-w-0 pt-24 pb-16 sm:pb-20">
        <div className="container max-w-3xl min-w-0">
          <p className="text-sm text-muted-foreground font-body">Loading…</p>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="min-w-0 pt-24 pb-16 sm:pb-20">
        <div className="container max-w-3xl min-w-0 text-center">
          <h1 className="mb-4 font-serif text-2xl text-foreground sm:text-3xl">Page not found</h1>
          <p className="mb-8 font-body text-sm text-muted-foreground sm:text-base">
            This address is not a published custom page.
          </p>
          <Button asChild variant="gold" className="min-h-11 touch-manipulation">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (page.editor === "canvas") {
    return (
      <main className="min-w-0 pt-24 pb-16 sm:pb-20">
        <div className="container py-4">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.15em] text-accent font-body font-bold hover:text-accent/80"
          >
            ← Home
          </Link>
          <h1 className="sr-only font-serif text-3xl text-foreground mt-6">{page.title}</h1>
        </div>
        <div className="overflow-x-auto px-4">
          <CanvasRenderer document={page.document} scale={1} className="mx-auto max-w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 pt-24 pb-16 sm:pb-20">
      <div className="container max-w-3xl min-w-0">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-accent/70">Page</p>
          <h1 className="mb-8 break-words font-serif text-2xl text-foreground sm:mb-10 sm:text-3xl md:text-4xl">
            {page.title}
          </h1>
          <BlockRenderer blocks={page.blocks} />
        </motion.div>
      </div>
    </main>
  );
};

export default DynamicSitePage;
