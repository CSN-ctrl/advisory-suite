import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { VisualEditorShell } from "@/components/page-editor/VisualEditorShell";
import { fetchSitePageById } from "@/hooks/use-site-pages";
import { useLocale } from "@/hooks/use-locale";

const AdminVisualEditor = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const locale = useLocale();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<Awaited<ReturnType<typeof fetchSitePageById>>>(null);

  useEffect(() => {
    const run = async () => {
      const admin = await checkIsSupabaseAdmin();
      if (!admin) {
        navigate("/admin/availability", { replace: true });
        return;
      }
      if (!pageId) {
        navigate("/admin/site", { replace: true });
        return;
      }
      const row = await fetchSitePageById(pageId);
      if (!row) {
        navigate("/admin/site", { replace: true });
        return;
      }
      setPage(row);
      setReady(true);
    };
    void run();
  }, [pageId, navigate]);

  if (!ready || !page) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center pt-20">
        <p className="text-muted-foreground font-body text-sm">Loading editor…</p>
      </main>
    );
  }

  return (
    <main className="pt-16">
      <VisualEditorShell
        pageId={page.id}
        slug={page.slug}
        title={page.title}
        locale={page.locale}
        published={page.published}
        initialDocument={page.document}
      />
    </main>
  );
};

export default AdminVisualEditor;
