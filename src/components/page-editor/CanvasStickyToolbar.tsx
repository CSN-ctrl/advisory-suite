import {
  Layers,
  PanelRight,
  RefreshCw,
  Save,
  Type,
  Square,
  ImageIcon,
  MousePointer2,
} from "lucide-react";
import { usePageCanvasEditor } from "@/contexts/PageCanvasEditorContext";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DockButton({
  active,
  onClick,
  title,
  children,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "editor-dock-btn flex h-10 w-10 items-center justify-center rounded-lg transition-all",
        active
          ? "bg-accent text-accent-foreground shadow-md"
          : "text-white/75 hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function CanvasStickyToolbar() {
  const locale = useLocale();
  const isBg = locale === "bg";
  const {
    loading,
    selectedId,
    setSelectedId,
    showInspector,
    showLayers,
    setShowInspector,
    setShowLayers,
    addElement,
    rescanPage,
    save,
  } = usePageCanvasEditor();

  return (
    <div
      data-edit-allow="true"
      className="editor-floating-dock pointer-events-none fixed inset-x-0 z-[96] flex justify-center px-3"
      style={{
        bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="editor-dock-shell pointer-events-auto flex max-w-[100vw] items-center gap-1 rounded-2xl border border-white/10 bg-navy/95 p-1.5 shadow-2xl backdrop-blur-xl sm:gap-1.5 sm:p-2">
        <DockButton
          active={!selectedId}
          onClick={() => setSelectedId(null)}
          title={isBg ? "Избор" : "Select"}
        >
          <MousePointer2 className="h-4 w-4" />
        </DockButton>

        <span className="mx-0.5 hidden h-6 w-px bg-white/15 sm:block" />

        <DockButton onClick={() => addElement("text")} title={isBg ? "Текст" : "Text"}>
          <Type className="h-4 w-4" />
        </DockButton>
        <DockButton onClick={() => addElement("box")} title={isBg ? "Блок" : "Box"}>
          <Square className="h-4 w-4" />
        </DockButton>
        <DockButton onClick={() => addElement("image")} title={isBg ? "Снимка" : "Image"}>
          <ImageIcon className="h-4 w-4" />
        </DockButton>

        <span className="mx-0.5 hidden h-6 w-px bg-white/15 sm:block" />

        <DockButton onClick={rescanPage} title={isBg ? "Сканирай страницата" : "Scan page blocks"}>
          <RefreshCw className="h-4 w-4" />
        </DockButton>
        <DockButton
          active={showLayers}
          onClick={() => setShowLayers(!showLayers)}
          title={isBg ? "Слоеве" : "Layers"}
          className="hidden sm:flex"
        >
          <Layers className="h-4 w-4" />
        </DockButton>
        <DockButton
          active={showInspector}
          onClick={() => setShowInspector(!showInspector)}
          title={isBg ? "Инспектор" : "Inspector"}
          className="hidden sm:flex"
        >
          <PanelRight className="h-4 w-4" />
        </DockButton>

        <Button
          type="button"
          variant="gold"
          size="sm"
          className="ml-1 h-10 rounded-xl px-4 font-body text-xs font-bold uppercase tracking-wider sm:ml-2"
          disabled={loading}
          onClick={() => void save()}
        >
          <Save className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">{loading ? (isBg ? "…" : "…") : isBg ? "Запази" : "Save"}</span>
        </Button>
      </div>
    </div>
  );
}
