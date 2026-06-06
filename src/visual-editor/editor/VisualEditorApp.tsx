import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Magnet,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore, VIEWPORT_WIDTHS, type EditorViewport } from "@/visual-editor/store/editor-store";
import { VisualEditorDndContext } from "@/visual-editor/editor/dnd/VisualEditorDndContext";
import { ComponentsPalette } from "@/visual-editor/editor/panels/ComponentsPalette";
import { PropertiesPanel } from "@/visual-editor/editor/panels/PropertiesPanel";
import { LayersTreePanel } from "@/visual-editor/editor/panels/LayersTreePanel";
import { EditorCanvas } from "@/visual-editor/editor/EditorCanvas";
import { useKeyboardShortcuts } from "@/visual-editor/editor/use-keyboard-shortcuts";
import { clearDomRegistry } from "@/visual-editor/store/dom-registry";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { useEditorNavigationGuard } from "@/hooks/use-editor-navigation-guard";
import { cn } from "@/lib/utils";

interface VisualEditorAppProps {
  locale: string;
  backHref?: string;
  backLabel?: string;
  livePreviewHref?: string;
  onSave: () => Promise<{ error?: string }>;
}

const VIEWPORTS: { id: EditorViewport; icon: typeof Monitor; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
];

export function VisualEditorApp({
  locale,
  backHref = "/admin/pages",
  backLabel,
  livePreviewHref,
  onSave,
}: VisualEditorAppProps) {
  const isBg = locale === "bg";
  const pageTitle = useEditorStore((s) => s.pageTitle);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);
  const published = useEditorStore((s) => s.published);
  const setPublished = useEditorStore((s) => s.setPublished);
  const dirty = useEditorStore((s) => s.dirty);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);
  const setSnapEnabled = useEditorStore((s) => s.setSnapEnabled);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const [saving, setSaving] = useState(false);

  useKeyboardShortcuts({ onSave: () => void handleSave() });
  useUnsavedChangesGuard(
    dirty,
    isBg ? "Имате незапазени промени." : "You have unsaved changes.",
  );
  useEditorNavigationGuard(
    dirty,
    isBg ? "Имате незапазени промени. Напускане?" : "You have unsaved changes. Leave anyway?",
  );

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave();
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    useEditorStore.getState().setDirty(false);
    toast.success(isBg ? "Запазено" : "Saved");
  };

  const backText = backLabel ?? (isBg ? "← Pages Hub" : "← Pages Hub");

  return (
    <VisualEditorDndContext locale={locale}>
      <div className="flex h-screen flex-col bg-background">
        <header
          data-visual-editor-chrome
          className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-navy px-4 py-2.5 text-white"
        >
          <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10" asChild>
            <Link to={backHref}>{backText}</Link>
          </Button>
          <div className="min-w-0">
            <span className="block max-w-[14rem] truncate font-serif text-sm font-medium">{pageTitle}</span>
            {dirty ? (
              <span className="font-body text-[10px] text-accent">{isBg ? "Незапазени промени" : "Unsaved changes"}</span>
            ) : (
              <span className="font-body text-[10px] text-white/40">{isBg ? "Запазено" : "All changes saved"}</span>
            )}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-white/10 p-0.5">
              {VIEWPORTS.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-white/70",
                    viewport === id && "bg-white/15 text-white",
                  )}
                  onClick={() => setViewport(id)}
                  title={`${label} (${VIEWPORT_WIDTHS[id]}px)`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 text-white/70", snapEnabled && "bg-white/10 text-accent")}
              onClick={() => setSnapEnabled(!snapEnabled)}
              title={isBg ? "Прилепване към мрежа" : "Snap to grid"}
            >
              <Magnet className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70"
              disabled={past.length === 0}
              onClick={() => undo()}
              title="Undo (⌘Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70"
              disabled={future.length === 0}
              onClick={() => redo()}
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Switch
                id="published-ve"
                checked={published}
                onCheckedChange={setPublished}
                className="data-[state=checked]:bg-accent"
              />
              <Label htmlFor="published-ve" className="text-xs text-white/80">
                {isBg ? "Публикувана" : "Published"}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="mode-ve"
                checked={mode === "preview"}
                onCheckedChange={(v) => {
                  if (!v) clearDomRegistry();
                  setMode(v ? "preview" : "edit");
                }}
                className="data-[state=checked]:bg-accent"
              />
              <Label htmlFor="mode-ve" className="flex items-center gap-1 text-xs text-white/80">
                {mode === "preview" ? <Eye className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                {mode === "preview" ? (isBg ? "Преглед" : "Preview") : isBg ? "Редакция" : "Edit"}
              </Label>
            </div>

            {livePreviewHref ? (
              <Button variant="outline" size="sm" className="border-white/20 text-white" asChild>
                <a href={livePreviewHref} target="_blank" rel="noreferrer">
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  {isBg ? "Сайт" : "Live"}
                </a>
              </Button>
            ) : null}

            <Button variant="gold" size="sm" disabled={saving} onClick={() => void handleSave()}>
              <Save className="mr-1 h-3.5 w-3.5" />
              {saving ? "…" : isBg ? "Запази" : "Save"}
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {mode === "edit" ? <ComponentsPalette locale={locale} /> : null}
          {mode === "edit" ? <LayersTreePanel locale={locale} /> : null}
          <EditorCanvas locale={locale} />
          {mode === "edit" ? <PropertiesPanel locale={locale} /> : null}
        </div>
      </div>
    </VisualEditorDndContext>
  );
}
