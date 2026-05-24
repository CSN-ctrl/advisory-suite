import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (page === undefined) {
    return (
      <main className="pt-24 pb-20">
        <div className="container max-w-3xl">
          <p className="text-sm text-muted-foreground font-body">Loading…</p>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="pt-24 pb-20">
        <div className="container max-w-3xl text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Page not found</h1>
          <p className="text-muted-foreground font-body mb-8">This address is not a published custom page.</p>
          <Button asChild variant="gold">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent/70 font-body mb-3">Page</p>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-10">{page.title}</h1>
          <BlockRenderer blocks={page.blocks} />
        </motion.div>
      </div>
    </main>
  );
};

export default DynamicSitePage;
