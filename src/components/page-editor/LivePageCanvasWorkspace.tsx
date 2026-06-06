import { useCallback, useEffect, useRef, useState } from "react";
import { Scan } from "lucide-react";
import { toast } from "sonner";
import { CanvasWorkspaceProvider } from "@/contexts/CanvasWorkspaceContext";
import { CanvasElementNode } from "@/components/page-editor/CanvasElementNode";
import { MarketingPagePreview } from "@/components/page-editor/MarketingPagePreview";
import { Button } from "@/components/ui/button";
import type { CanvasDocument, CanvasElement } from "@/lib/canvas-document";
import { mergeScannedWithDocument, scanPageForEditor } from "@/lib/marketing-canvas";
import type { MarketingContentPage } from "@/lib/marketing-canvas-templates";

interface LivePageCanvasWorkspaceProps {
  contentPage: MarketingContentPage;
  locale: string;
  document: CanvasDocument;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDocumentChange: (next: CanvasDocument | ((prev: CanvasDocument) => CanvasDocument)) => void;
}

export function LivePageCanvasWorkspace({
  contentPage,
  locale,
  document,
  selectedId,
  onSelect,
  onDocumentChange,
}: LivePageCanvasWorkspaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(document.canvas.height);
  const isBg = locale === "bg";
  const initialScanRef = useRef(false);

  const updateElement = useCallback(
    (id: string, next: CanvasElement) => {
      onDocumentChange((prev) => ({
        ...prev,
        elements: prev.elements.map((e) => (e.id === id ? next : e)),
      }));
    },
    [onDocumentChange],
  );

  const syncCanvasSize = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const w = Math.max(400, root.scrollWidth);
    const h = Math.max(400, root.scrollHeight);
    setContentHeight(h);
    onDocumentChange((prev) => ({
      ...prev,
      layoutMode: "blocks",
      canvas: { width: w, height: h },
    }));
  }, [onDocumentChange]);

  const runScan = useCallback(
    (opts?: { silent?: boolean }) => {
      const root = rootRef.current;
      if (!root) return;
      const scanned = scanPageForEditor(root, contentPage);
      if (scanned.length === 0) {
        if (!opts?.silent) {
          toast.message(
            isBg
              ? "Няма блокове за сканиране — добавете CanvasBlock или секции в <main>"
              : "No blocks to scan — add CanvasBlock wrappers or <main> sections",
          );
        }
        return;
      }
      onDocumentChange((prev) =>
        mergeScannedWithDocument(scanned, {
          ...prev,
          layoutMode: "blocks",
          canvas: {
            width: Math.max(400, root.scrollWidth),
            height: Math.max(400, root.scrollHeight),
          },
        }),
      );
      setContentHeight(Math.max(400, root.scrollHeight));
      if (!opts?.silent) {
        toast.success(
          isBg ? `${scanned.length} блока на страницата` : `${scanned.length} blocks on page`,
        );
      }
    },
    [contentPage, isBg, onDocumentChange],
  );

  useEffect(() => {
    initialScanRef.current = false;
  }, [contentPage, locale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const timer = window.setTimeout(() => {
      syncCanvasSize();
      if (!initialScanRef.current) {
        initialScanRef.current = true;
        runScan({ silent: true });
      }
    }, 150);

    const ro = new ResizeObserver(() => {
      syncCanvasSize();
    });
    ro.observe(root);

    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [contentPage, locale, runScan, syncCanvasSize]);

  return (
    <CanvasWorkspaceProvider active>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 px-1">
          <Button type="button" variant="outline" size="sm" onClick={() => runScan()}>
            <Scan className="mr-1.5 h-3.5 w-3.5" />
            {isBg ? "Сканирай страницата" : "Scan page"}
          </Button>
          <p className="font-body text-xs text-muted-foreground">
            {isBg
              ? "Плъзнете рамките — ред, скриване и стилове се прилагат на живия сайт. Текст — Edit Mode."
              : "Drag frames — order, hide, and styles apply on the live site. Edit copy with Edit Mode."}
          </p>
        </div>

        <div
          className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-muted/30 p-4"
          onClick={() => onSelect(null)}
        >
          <div
            ref={rootRef}
            className="relative mx-auto w-full max-w-[100vw] bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <MarketingPagePreview contentPage={contentPage} locale={locale} />

            <div
              className="pointer-events-none absolute left-0 top-0 z-20 w-full"
              style={{ height: contentHeight }}
              aria-hidden={false}
            >
              {document.elements.map((element) => (
                <CanvasElementNode
                  key={element.id}
                  element={element}
                  isSelected={selectedId === element.id}
                  isEditing
                  linkedBlock={Boolean(element.blockId)}
                  canvasScale={1}
                  onSelect={() => onSelect(element.id)}
                  onChange={(next) => updateElement(element.id, next)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CanvasWorkspaceProvider>
  );
}
