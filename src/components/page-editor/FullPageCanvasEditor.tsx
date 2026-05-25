import { useCallback, useRef, type ReactNode } from "react";
import { usePageCanvasEditor } from "@/contexts/PageCanvasEditorContext";
import { CanvasElementNode } from "@/components/page-editor/CanvasElementNode";
import { CanvasStickyToolbar } from "@/components/page-editor/CanvasStickyToolbar";
import { EditorDockPanel, EditorSideDock } from "@/components/page-editor/EditorChrome";
import { InspectorPanel } from "@/components/page-editor/InspectorPanel";
import { LayersPanel } from "@/components/page-editor/LayersPanel";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

export function FullPageCanvasEditor({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const {
    isActive,
    loading,
    document,
    selectedId,
    setSelectedId,
    showInspector,
    showLayers,
    updateElement,
    removeElement,
    reorderElements,
    addElement,
    registerRoot,
    setCanvasSize,
  } = usePageCanvasEditor();

  const rootRef = useRef<HTMLDivElement>(null);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      registerRoot(node);
    },
    [registerRoot],
  );

  if (!isActive) {
    return <>{children}</>;
  }

  const selected = document.elements.find((e) => e.id === selectedId) ?? null;

  return (
    <>
      <div
        ref={setRootRef}
        id="page-canvas-root"
        className={cn(
          "relative",
          "pb-[calc(var(--canvas-toolbar-height,64px)+1.5rem+env(safe-area-inset-bottom,0px))]",
        )}
      >
        {children}

        {!loading ? (
          <>
          <div
            className="editor-canvas-shade pointer-events-none absolute inset-0 z-[55] bg-navy/[0.03]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[60]"
            aria-hidden={false}
            onClick={() => setSelectedId(null)}
          >
            <div className="relative min-h-full w-full" style={{ minHeight: document.canvas.height }}>
              {document.elements.map((element) => {
                const isSelected = selectedId === element.id;
                const isLinkedBlock = Boolean(element.blockId);
                return (
                  <div
                    key={element.id}
                    className={cn(
                      "absolute",
                      isSelected ? "pointer-events-auto" : isLinkedBlock ? "pointer-events-none" : "pointer-events-auto",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CanvasElementNode
                      element={element}
                      isSelected={isSelected}
                      isEditing
                      canvasScale={1}
                      linkedBlock={isLinkedBlock}
                      onSelect={() => setSelectedId(element.id)}
                      onChange={(next) => updateElement(element.id, next)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          </>
        ) : null}
      </div>

      <CanvasStickyToolbar />

      {showLayers ? (
        <EditorSideDock side="left">
          <EditorDockPanel>
            <LayersPanel
              embedded
              locale={locale}
              document={document}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onReorder={reorderElements}
              onAdd={addElement}
              onRemove={removeElement}
            />
          </EditorDockPanel>
        </EditorSideDock>
      ) : null}

      {showInspector ? (
        <EditorSideDock side="right">
          <EditorDockPanel>
            <InspectorPanel
              embedded
              locale={locale}
              element={selected}
              canvas={document.canvas}
              onElementChange={(next) => {
                if (selectedId) updateElement(selectedId, next);
              }}
              onCanvasChange={setCanvasSize}
            />
          </EditorDockPanel>
        </EditorSideDock>
      ) : null}
    </>
  );
}
