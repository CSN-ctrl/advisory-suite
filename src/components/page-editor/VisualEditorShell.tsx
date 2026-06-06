import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Redo2, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";
import {
  createElement,
  createDefaultDocument,
  type CanvasDocument,
  type CanvasElement,
  type CanvasElementType,
} from "@/lib/canvas-document";
import { CanvasElementNode } from "@/components/page-editor/CanvasElementNode";
import { CanvasRenderer } from "@/components/page-editor/CanvasRenderer";
import { InspectorPanel } from "@/components/page-editor/InspectorPanel";
import { LayersPanel } from "@/components/page-editor/LayersPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateSitePage } from "@/hooks/use-site-pages";
import { LivePageCanvasWorkspace } from "@/components/page-editor/LivePageCanvasWorkspace";
import { MarketingPagePreview } from "@/components/page-editor/MarketingPagePreview";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { useEditorNavigationGuard } from "@/hooks/use-editor-navigation-guard";
import type { MarketingContentPage } from "@/lib/marketing-canvas-templates";

interface VisualEditorShellProps {
  pageId: string;
  slug: string;
  title: string;
  locale: string;
  published: boolean;
  initialDocument: CanvasDocument;
  /** When set, editor shows the real marketing page with draggable section overlays. */
  contentPage?: MarketingContentPage;
  /** Full viewport height without site header offset. */
  fullScreen?: boolean;
  backHref?: string;
  backLabel?: string;
  /** Link for “open live” (marketing path or /pages/slug). */
  livePreviewHref?: string;
  showPublishedToggle?: boolean;
}

export function VisualEditorShell({
  pageId,
  slug,
  title,
  locale,
  published: initialPublished,
  initialDocument,
  fullScreen = false,
  backHref = "/admin/pages",
  backLabel,
  livePreviewHref,
  showPublishedToggle = true,
  contentPage,
}: VisualEditorShellProps) {
  const isBg = locale === "bg";
  const wysiwyg = Boolean(contentPage);
  const initial = useMemo(
    () => ({
      ...initialDocument,
      layoutMode: contentPage ? ("blocks" as const) : initialDocument.layoutMode,
    }),
    [initialDocument, contentPage],
  );

  const {
    value: document,
    set: setDocument,
    undo,
    redo,
    canUndo,
    canRedo,
    dirty,
    reset: resetDocument,
  } = useUndoStack(initial);

  const [selectedId, setSelectedId] = useState<string | null>(initialDocument.elements[0]?.id ?? null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(initialPublished);

  useUnsavedChangesGuard(
    dirty || published !== initialPublished,
    isBg ? "Имате незапазени промени." : "You have unsaved changes.",
  );
  useEditorNavigationGuard(
    dirty || published !== initialPublished,
    isBg ? "Имате незапазени промени. Напускане?" : "You have unsaved changes. Leave anyway?",
  );

  const selected = useMemo(
    () => document.elements.find((e) => e.id === selectedId) ?? null,
    [document.elements, selectedId],
  );

  const updateElement = useCallback(
    (id: string, next: CanvasElement) => {
      setDocument((prev) => ({
        ...prev,
        elements: prev.elements.map((e) => (e.id === id ? next : e)),
      }));
    },
    [setDocument],
  );

  const handleSave = async () => {
    setSaving(true);
    const payload: CanvasDocument = wysiwyg ? { ...document, layoutMode: "blocks" } : document;
    const result = await updateSitePage(pageId, { document: payload, published });
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    resetDocument(document);
    toast.success(isBg ? "Запазено" : "Saved");
  };

  const scale = 0.85;

  const previewHref = livePreviewHref ?? `/pages/${slug}`;
  const backText = backLabel ?? (isBg ? "← Pages Hub" : "← Pages Hub");

  return (
    <div className={fullScreen ? "flex h-screen flex-col bg-background" : "flex h-[calc(100vh-4rem)] flex-col bg-background"}>
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-navy px-4 py-2.5 text-white">
        <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
          <Link to={backHref}>{backText}</Link>
        </Button>
        <div className="min-w-0">
          <span className="block max-w-[12rem] truncate font-serif text-sm font-medium">{title}</span>
          {dirty ? (
            <span className="font-body text-[10px] text-accent">{isBg ? "Незапазени промени" : "Unsaved changes"}</span>
          ) : null}
        </div>
        <span className="hidden font-body text-xs text-white/50 truncate sm:inline">{previewHref}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70"
            disabled={!canUndo}
            onClick={undo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70"
            disabled={!canRedo}
            onClick={redo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          {showPublishedToggle ? (
            <div className="flex items-center gap-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} className="data-[state=checked]:bg-accent" />
              <Label htmlFor="published" className="text-xs font-body text-white/80">
                {isBg ? "Публикувана" : "Published"}
              </Label>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Switch id="preview" checked={preview} onCheckedChange={setPreview} className="data-[state=checked]:bg-accent" />
            <Label htmlFor="preview" className="text-xs font-body text-white/80">
              {wysiwyg ? (isBg ? "Без рамки" : "Hide frames") : isBg ? "Преглед" : "Preview"}
            </Label>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10" asChild>
            <a href={previewHref} target="_blank" rel="noreferrer">
              <Eye className="mr-1 h-3.5 w-3.5" />
              {isBg ? "Сайт" : "Live"}
            </a>
          </Button>
          <Button variant="gold" size="sm" onClick={() => void handleSave()} disabled={saving}>
            <Save className="mr-1 h-3.5 w-3.5" />
            {saving ? (isBg ? "Запазване…" : "Saving…") : isBg ? "Запази" : "Save"}
          </Button>
        </div>
      </header>

      {wysiwyg ? (
        <div
          data-visual-editor-chrome
          className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center font-body text-xs text-amber-950 dark:text-amber-100"
        >
          {isBg
            ? "Canvas layout се прилага на живия сайт (ред, скриване, стилове). Текст и изображения — с Edit Mode."
            : "Canvas layout applies on the live site (order, hide, styles). Edit copy and images with Edit Mode."}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {!preview ? (
          <LayersPanel
            locale={locale}
            document={document}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={(elements) => setDocument((prev) => ({ ...prev, elements }))}
            onAdd={(type: CanvasElementType) => {
              const el = createElement(type);
              setDocument((prev) => ({
                ...prev,
                elements: [...prev.elements, el],
              }));
              setSelectedId(el.id);
            }}
            onRemove={(id) => {
              setDocument((prev) => {
                const next = prev.elements.filter((e) => e.id !== id);
                return {
                  ...prev,
                  elements:
                    next.length > 0 ? next : wysiwyg ? [] : createDefaultDocument().elements,
                };
              });
              if (selectedId === id) {
                setSelectedId(null);
              }
            }}
          />
        ) : null}

        <main
          className="min-w-0 flex-1 overflow-auto bg-muted/40 p-4 md:p-6"
          onClick={() => setSelectedId(null)}
        >
          {wysiwyg && contentPage ? (
            preview ? (
              <div className="mx-auto max-w-[100vw] bg-background shadow-lg" onClick={(e) => e.stopPropagation()}>
                <MarketingPagePreview contentPage={contentPage} locale={locale} />
              </div>
            ) : (
              <LivePageCanvasWorkspace
                contentPage={contentPage}
                locale={locale}
                document={document}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDocumentChange={setDocument}
              />
            )
          ) : preview ? (
            <CanvasRenderer document={document} scale={scale} className="mx-auto" />
          ) : (
            <div
              className="relative mx-auto bg-white shadow-lg"
              style={{
                width: document.canvas.width * scale,
                height: document.canvas.height * scale,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative origin-top-left bg-background"
                style={{
                  width: document.canvas.width,
                  height: document.canvas.height,
                  transform: `scale(${scale})`,
                }}
              >
                {document.elements.map((element) => (
                  <CanvasElementNode
                    key={element.id}
                    element={element}
                    isSelected={selectedId === element.id}
                    isEditing={!preview}
                    canvasScale={scale}
                    onSelect={() => setSelectedId(element.id)}
                    onChange={(next) => updateElement(element.id, next)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {!preview ? (
          <InspectorPanel
            locale={locale}
            element={selected}
            canvas={document.canvas}
            onElementChange={(next) => {
              if (selectedId) updateElement(selectedId, next);
            }}
            onCanvasChange={(canvas) => setDocument((prev) => ({ ...prev, canvas }))}
          />
        ) : null}
      </div>
    </div>
  );
}
