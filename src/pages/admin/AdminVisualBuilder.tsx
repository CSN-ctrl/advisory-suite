import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import {
  fetchSitePageById,
  updateSitePage,
  type SitePageRow,
} from "@/hooks/use-site-pages";
import { normalizePageDocument } from "@/visual-editor/schema/page-node";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { VisualEditorApp } from "@/visual-editor/editor/VisualEditorApp";
import { clearDomRegistry } from "@/visual-editor/store/dom-registry";

const AdminVisualBuilder = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<SitePageRow | null>(null);
  const loadDocument = useEditorStore((s) => s.loadDocument);

  useEffect(() => {
    const run = async () => {
      const admin = await checkIsSupabaseAdmin();
      if (!admin) {
        navigate("/admin/pages", { replace: true });
        return;
      }
      if (!pageId) {
        navigate("/admin/pages", { replace: true });
        return;
      }
      const row = await fetchSitePageById(pageId);
      if (!row || row.editor !== "visual-tree") {
        navigate("/admin/pages", { replace: true });
        return;
      }
      setPage(row);
      loadDocument(row.pageTree, {
        pageId: row.id,
        title: row.title,
        published: row.published,
      });
      setReady(true);
    };
    void run();
    return () => {
      clearDomRegistry();
    };
  }, [pageId, navigate, loadDocument]);

  if (!ready || !page) {
    return (
      <main className="flex h-screen items-center justify-center bg-background">
        <p className="font-body text-sm text-muted-foreground">Loading visual builder…</p>
      </main>
    );
  }

  return (
    <VisualEditorApp
      locale={page.locale}
      backHref="/admin/pages"
      livePreviewHref={`/pages/${page.slug}${page.published ? "" : "?draft=1"}`}
      onSave={async () => {
        const doc = useEditorStore.getState().getDocument();
        const published = useEditorStore.getState().published;
        return updateSitePage(page.id, { pageTree: doc, published });
      }}
    />
  );
};

export default AdminVisualBuilder;
