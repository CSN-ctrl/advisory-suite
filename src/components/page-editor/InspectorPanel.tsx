import type { CanvasDocument, CanvasElement, CanvasStyle } from "@/lib/canvas-document";
import { ELEMENT_LABELS } from "@/lib/canvas-document";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorPanelHeader } from "@/components/page-editor/EditorChrome";
import { cn } from "@/lib/utils";

interface InspectorPanelProps {
  locale: string;
  element: CanvasElement | null;
  canvas: CanvasDocument["canvas"];
  onElementChange: (next: CanvasElement) => void;
  onCanvasChange: (next: CanvasDocument["canvas"]) => void;
  embedded?: boolean;
}

function StyleField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input className="h-8 text-xs" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function InspectorPanel({
  locale,
  element,
  canvas,
  onElementChange,
  onCanvasChange,
  embedded = false,
}: InspectorPanelProps) {
  const isBg = locale === "bg";
  const shell = cn(
    "flex min-h-0 flex-1 flex-col",
    embedded ? "bg-navy text-white" : "w-72 shrink-0 border-l border-border bg-card",
  );

  if (!element) {
    return (
      <aside className={shell}>
        <EditorPanelHeader title={isBg ? "Инспектор" : "Inspector"} />
        <ScrollArea className="flex-1 p-4">
          <p className={cn("text-sm font-body mb-4", embedded ? "text-white/60" : "text-muted-foreground")}>
            {isBg ? "Изберете блок на страницата." : "Select a block on the page."}
          </p>
          <Separator className={cn("my-4", embedded && "bg-white/10")} />
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider mb-3",
              embedded ? "text-white/50" : "text-muted-foreground",
            )}
          >
            {isBg ? "Платно" : "Canvas"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <StyleField
              label="Width"
              value={String(canvas.width)}
              onChange={(v) => onCanvasChange({ ...canvas, width: Number(v) || 1200 })}
            />
            <StyleField
              label="Height"
              value={String(canvas.height)}
              onChange={(v) => onCanvasChange({ ...canvas, height: Number(v) || 1600 })}
            />
          </div>
        </ScrollArea>
      </aside>
    );
  }

  const patchStyle = (style: Partial<CanvasStyle>) =>
    onElementChange({ ...element, style: { ...element.style, ...style } });

  const patchPosition = (patch: Partial<typeof element.position>) =>
    onElementChange({ ...element, position: { ...element.position, ...patch } });

  const typeLabel = isBg ? ELEMENT_LABELS[element.type].bg : ELEMENT_LABELS[element.type].en;

  return (
    <aside className={shell}>
      <EditorPanelHeader title={isBg ? "Инспектор" : "Inspector"} subtitle={typeLabel} />
      <ScrollArea className="flex-1 p-4 space-y-4 editor-panel-scroll">
        <div className="grid gap-2">
          <Label>{isBg ? "Съдържание" : "Content"}</Label>
          <Input
            value={element.content}
            onChange={(e) => onElementChange({ ...element, content: e.target.value })}
            className="text-sm"
          />
        </div>

        <Separator />

        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Позиция" : "Position"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <StyleField label="X" value={String(element.position.x)} onChange={(v) => patchPosition({ x: Number(v) || 0 })} />
          <StyleField label="Y" value={String(element.position.y)} onChange={(v) => patchPosition({ y: Number(v) || 0 })} />
          <StyleField label="W" value={String(element.position.width)} onChange={(v) => patchPosition({ width: Number(v) || 40 })} />
          <StyleField label="H" value={String(element.position.height)} onChange={(v) => patchPosition({ height: Number(v) || 24 })} />
          <StyleField label="Z" value={String(element.position.zIndex ?? 1)} onChange={(v) => patchPosition({ zIndex: Number(v) || 1 })} />
        </div>

        <Separator />

        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Типография" : "Typography"}
        </p>
        <StyleField
          label={isBg ? "Размер" : "Font size"}
          value={element.style.fontSize ?? ""}
          onChange={(v) => patchStyle({ fontSize: v })}
          placeholder="18px"
        />
        <StyleField
          label={isBg ? "Тегло" : "Weight"}
          value={element.style.fontWeight ?? ""}
          onChange={(v) => patchStyle({ fontWeight: v })}
          placeholder="600"
        />
        <StyleField
          label={isBg ? "Цвят" : "Color"}
          value={element.style.color ?? ""}
          onChange={(v) => patchStyle({ color: v })}
          placeholder="#000"
        />
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {isBg ? "Подравняване" : "Text align"}
          </Label>
          <Select
            value={element.style.textAlign ?? "left"}
            onValueChange={(v) => patchStyle({ textAlign: v as CanvasStyle["textAlign"] })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Оформление" : "Layout"}
        </p>
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Display</Label>
          <Select
            value={element.style.display ?? "block"}
            onValueChange={(v) => patchStyle({ display: v as CanvasStyle["display"] })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">block</SelectItem>
              <SelectItem value="flex">flex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {element.style.display === "flex" ? (
          <>
            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Direction</Label>
              <Select
                value={element.style.flexDirection ?? "row"}
                onValueChange={(v) => patchStyle({ flexDirection: v as CanvasStyle["flexDirection"] })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">row</SelectItem>
                  <SelectItem value="column">column</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <StyleField
              label="Gap"
              value={element.style.gap ?? ""}
              onChange={(v) => patchStyle({ gap: v })}
              placeholder="8px"
            />
            <StyleField
              label="Justify"
              value={element.style.justifyContent ?? ""}
              onChange={(v) => patchStyle({ justifyContent: v })}
              placeholder="center"
            />
            <StyleField
              label="Align"
              value={element.style.alignItems ?? ""}
              onChange={(v) => patchStyle({ alignItems: v })}
              placeholder="center"
            />
          </>
        ) : null}

        <StyleField
          label={isBg ? "Фон" : "Background"}
          value={element.style.backgroundColor ?? ""}
          onChange={(v) => patchStyle({ backgroundColor: v })}
        />
        <StyleField
          label="Padding"
          value={element.style.padding ?? ""}
          onChange={(v) => patchStyle({ padding: v })}
          placeholder="12px"
        />
        <StyleField
          label="Radius"
          value={element.style.borderRadius ?? ""}
          onChange={(v) => patchStyle({ borderRadius: v })}
          placeholder="8px"
        />
      </ScrollArea>
    </aside>
  );
}
