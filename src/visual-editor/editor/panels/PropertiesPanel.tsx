import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { useEditorStore } from "@/visual-editor/store/editor-store";
import { findNode } from "@/visual-editor/lib/tree-ops";
import { NODE_TYPE_LABELS } from "@/visual-editor/schema/page-node";
import {
  BUTTON_STYLE_PRESETS,
  CONTAINER_GAP_PRESETS,
  INTERNAL_ROUTE_OPTIONS,
  SECTION_SPACING_PRESETS,
  SPACER_HEIGHT_PRESETS,
  TEXT_STYLE_PRESETS,
} from "@/visual-editor/lib/design-tokens";
import { MediaPickerDialog } from "@/components/admin/MediaPickerDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  locale: string;
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export function PropertiesPanel({ locale }: PropertiesPanelProps) {
  const isBg = locale === "bg";
  const root = useEditorStore((s) => s.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateNode = useEditorStore((s) => s.updateNode);
  const updateNodeLayout = useEditorStore((s) => s.updateNodeLayout);
  const [mediaOpen, setMediaOpen] = useState(false);

  const primaryId = selectedIds[0];
  const loc = primaryId ? findNode(root, primaryId) : null;
  const node = loc?.node;

  const shell = (
    <aside
      data-visual-editor-chrome
      className="flex w-80 shrink-0 flex-col border-l border-border bg-card"
    >
      <div className="border-b border-border px-3 py-2.5">
        <h2 className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Свойства" : "Properties"}
        </h2>
        {node ? (
          <p className="font-body text-sm text-foreground">
            {isBg ? NODE_TYPE_LABELS[node.type].bg : NODE_TYPE_LABELS[node.type].en}
          </p>
        ) : null}
      </div>
      {!node ? (
        <p className="p-4 font-body text-sm text-muted-foreground">
          {isBg ? "Изберете елемент на страницата." : "Select an element on the page."}
        </p>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {node.type === "text" ? (
              <FieldGroup title={isBg ? "Текст" : "Text"}>
                <Textarea
                  value={String(node.props.text ?? "")}
                  onChange={(e) => updateNode(node.id, { text: e.target.value })}
                  rows={4}
                  className="text-sm"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Стил" : "Style preset"}</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TEXT_STYLE_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto justify-start px-2 py-1.5 text-[11px]"
                        onClick={() =>
                          updateNode(node.id, {
                            variant: preset.variant,
                            className: preset.className,
                          })
                        }
                      >
                        {isBg ? preset.bg : preset.en}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Вариант" : "Heading level"}</Label>
                  <Select
                    value={String(node.props.variant ?? "body")}
                    onValueChange={(v) => updateNode(node.id, { variant: v as "body" | "h1" | "h2" | "h3" })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="body">Body</SelectItem>
                      <SelectItem value="h1">H1</SelectItem>
                      <SelectItem value="h2">H2</SelectItem>
                      <SelectItem value="h3">H3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FieldGroup>
            ) : null}

            {node.type === "button" ? (
              <FieldGroup title={isBg ? "Бутон" : "Button"}>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Етикет" : "Label"}</Label>
                  <Input
                    value={String(node.props.label ?? "")}
                    onChange={(e) => updateNode(node.id, { label: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Вътрешен линк" : "Internal link"}</Label>
                  <Select
                    value={String(node.props.href ?? "")}
                    onValueChange={(v) => updateNode(node.id, { href: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={isBg ? "Изберете" : "Choose route"} />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERNAL_ROUTE_OPTIONS.map((route) => (
                        <SelectItem key={route.path} value={route.path}>
                          {isBg ? route.bg : route.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Външен URL" : "External URL"}</Label>
                  <Input
                    value={String(node.props.href ?? "")}
                    onChange={(e) => updateNode(node.id, { href: e.target.value })}
                    className="h-8 text-xs"
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Стил" : "Style"}</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {BUTTON_STYLE_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => updateNode(node.id, { className: preset.className })}
                      >
                        {isBg ? preset.bg : preset.en}
                      </Button>
                    ))}
                  </div>
                </div>
              </FieldGroup>
            ) : null}

            {node.type === "image" ? (
              <FieldGroup title={isBg ? "Изображение" : "Image"}>
                <div className="overflow-hidden rounded-md border border-border bg-muted/30">
                  {node.props.src ? (
                    <img
                      src={String(node.props.src)}
                      alt={String(node.props.alt ?? "")}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setMediaOpen(true)}>
                  <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                  {isBg ? "Избери от библиотека" : "Choose from library"}
                </Button>
                <div className="space-y-1.5">
                  <Label className="text-xs">Alt</Label>
                  <Input
                    value={String(node.props.alt ?? "")}
                    onChange={(e) => updateNode(node.id, { alt: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Покритие" : "Object fit"}</Label>
                  <Select
                    value={String(node.props.objectFit ?? "cover")}
                    onValueChange={(v) =>
                      updateNode(node.id, {
                        objectFit: v === "contain" ? "contain" : "cover",
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="contain">Contain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FieldGroup>
            ) : null}

            {node.type === "section" ? (
              <FieldGroup title={isBg ? "Секция" : "Section"}>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Вертикален отстъп" : "Vertical spacing"}</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SECTION_SPACING_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 text-[11px]",
                          String(node.props.className ?? "").includes(preset.className.split(" ")[0]!) &&
                            "border-accent",
                        )}
                        onClick={() =>
                          updateNode(node.id, {
                            className: `container flex flex-col gap-6 ${preset.className}`,
                          })
                        }
                      >
                        {isBg ? preset.bg : preset.en}
                      </Button>
                    ))}
                  </div>
                </div>
              </FieldGroup>
            ) : null}

            {node.type === "container" ? (
              <FieldGroup title={isBg ? "Контейнер" : "Container"}>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isBg ? "Посока" : "Direction"}</Label>
                  <Select
                    value={String(node.props.flexDirection ?? "column")}
                    onValueChange={(v) => updateNode(node.id, { flexDirection: v as "row" | "column" })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="column">{isBg ? "Колона" : "Column"}</SelectItem>
                      <SelectItem value="row">{isBg ? "Ред" : "Row"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Gap</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONTAINER_GAP_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => updateNode(node.id, { gap: preset.value })}
                      >
                        {isBg ? preset.bg : preset.en}
                      </Button>
                    ))}
                  </div>
                </div>
              </FieldGroup>
            ) : null}

            {node.type === "spacer" ? (
              <FieldGroup title={isBg ? "Разстояние" : "Spacer"}>
                <div className="flex flex-wrap gap-1.5">
                  {SPACER_HEIGHT_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() => updateNode(node.id, { height: preset.value })}
                    >
                      {isBg ? preset.bg : preset.en}
                    </Button>
                  ))}
                </div>
              </FieldGroup>
            ) : null}

            {(node.type === "image" || node.type === "container") && (
              <FieldGroup title={isBg ? "Размер" : "Size"}>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{isBg ? "Ширина" : "Width"}</Label>
                    <Input
                      type="number"
                      value={Number(node.props.layout?.width ?? "") || ""}
                      onChange={(e) =>
                        updateNodeLayout(node.id, {
                          width: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{isBg ? "Височина" : "Height"}</Label>
                    <Input
                      type="number"
                      value={Number(node.props.layout?.height ?? "") || ""}
                      onChange={(e) =>
                        updateNodeLayout(node.id, {
                          height: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </FieldGroup>
            )}

            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50">
                {isBg ? "Разширени (CSS класове)" : "Advanced (CSS classes)"}
                <span className="text-[10px]">▾</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <Input
                  value={String(node.props.className ?? "")}
                  onChange={(e) => updateNode(node.id, { className: e.target.value })}
                  className="h-8 font-mono text-xs"
                  placeholder="font-body text-foreground"
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      )}
    </aside>
  );

  return (
    <>
      {shell}
      <MediaPickerDialog
        open={mediaOpen}
        onOpenChange={setMediaOpen}
        locale={locale}
        onSelect={(url) => node && updateNode(node.id, { src: url })}
      />
    </>
  );
}
