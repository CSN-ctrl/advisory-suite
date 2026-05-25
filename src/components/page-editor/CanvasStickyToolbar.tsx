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
      className={cn(
        "fixed left-0 right-0 z-[95] border-t border-border bg-card/95 shadow-lg backdrop-blur-md",
        "bottom-0 md:bottom-0",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-[100vw] flex-wrap items-center gap-1 px-2 py-2 sm:gap-2 sm:px-4">
        <Button
          type="button"
          variant={selectedId ? "ghost" : "secondary"}
          size="sm"
          className="h-9 text-xs"
          onClick={() => setSelectedId(null)}
          title={isBg ? "Избери" : "Select"}
        >
          <MousePointer2 className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Избери" : "Select"}
        </Button>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => addElement("text")}>
          <Type className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Текст" : "Text"}
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => addElement("box")}>
          <Square className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Блок" : "Box"}
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => addElement("image")}>
          <ImageIcon className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Снимка" : "Image"}
        </Button>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={rescanPage}>
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Сканирай" : "Scan page"}
        </Button>

        <Button
          type="button"
          variant={showLayers ? "secondary" : "outline"}
          size="sm"
          className="h-9 text-xs"
          onClick={() => setShowLayers(!showLayers)}
        >
          <Layers className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Слоеве" : "Layers"}
        </Button>

        <Button
          type="button"
          variant={showInspector ? "secondary" : "outline"}
          size="sm"
          className="h-9 text-xs"
          onClick={() => setShowInspector(!showInspector)}
        >
          <PanelRight className="mr-1 h-3.5 w-3.5" />
          {isBg ? "Инспектор" : "Inspector"}
        </Button>

        <Button
          type="button"
          variant="gold"
          size="sm"
          className="ml-auto h-9 text-xs"
          disabled={loading}
          onClick={() => void save()}
        >
          <Save className="mr-1 h-3.5 w-3.5" />
          {loading ? (isBg ? "Запазване…" : "Saving…") : isBg ? "Запази" : "Save"}
        </Button>
      </div>
    </div>
  );
}
