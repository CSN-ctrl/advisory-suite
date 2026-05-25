import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { marketingPathFromContentPage } from "@/lib/marketing-canvas";
import { ensureMarketingCanvasPage } from "@/hooks/use-marketing-canvas-page";
import { VisualEditorShell } from "@/components/page-editor/VisualEditorShell";
import { useLocale } from "@/hooks/use-locale";
import type { SitePageRow } from "@/hooks/use-site-pages";

const AdminMarketingCanvasEditor = () => {
  const { contentPage } = useParams<{ contentPage: string }>();
  const navigate = useNavigate();
  const locale = useLocale();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<SitePageRow | null>(null);

  const def = MARKETING_PAGES.find((p) => p.contentPage === contentPage);
  const displayTitle = locale === "bg" ? def?.labelBg ?? contentPage : def?.labelEn ?? contentPage;
  const livePath = contentPage ? marketingPathFromContentPage(contentPage) : "/";

  useEffect(() => {
    const run = async () => {
      const admin = await checkIsSupabaseAdmin();
      if (!admin) {
        navigate("/admin/pages", { replace: true });
        return;
      }
      if (!contentPage) {
        navigate("/admin/pages", { replace: true });
        return;
      }
      const result = await ensureMarketingCanvasPage(contentPage, locale);
      if ("error" in result) {
        navigate("/admin/pages", { replace: true });
        return;
      }
      setPage(result.row);
      setReady(true);
    };
    void run();
  }, [contentPage, locale, navigate]);

  if (!ready || !page) {
    return (
      <main className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground font-body text-sm">Loading canvas…</p>
      </main>
    );
  }

  return (
    <VisualEditorShell
      fullScreen
      pageId={page.id}
      slug={page.slug}
      title={displayTitle ?? page.title}
      locale={page.locale}
      published={page.published}
      initialDocument={page.document}
      backHref="/admin/pages"
      livePreviewHref={livePath}
      showPublishedToggle={false}
    />
  );
};

export default AdminMarketingCanvasEditor;
