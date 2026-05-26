import { useEditorStore } from "@/visual-editor/store/editor-store";
import { findNode } from "@/visual-editor/lib/tree-ops";
import { NODE_TYPE_LABELS } from "@/visual-editor/schema/page-node";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertiesPanelProps {
  locale: string;
}

export function PropertiesPanel({ locale }: PropertiesPanelProps) {
  const isBg = locale === "bg";
  const root = useEditorStore((s) => s.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateNode = useEditorStore((s) => s.updateNode);
  const updateNodeLayout = useEditorStore((s) => s.updateNodeLayout);

  const primaryId = selectedIds[0];
  const loc = primaryId ? findNode(root, primaryId) : null;
  const node = loc?.node;

  if (!node) {
    return (
      <aside
        data-visual-editor-chrome
        className="flex w-72 shrink-0 flex-col border-l border-border bg-card"
      >
        <div className="border-b border-border px-3 py-2.5">
          <h2 className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isBg ? "Свойства" : "Properties"}
          </h2>
        </div>
        <p className="p-4 font-body text-sm text-muted-foreground">
          {isBg ? "Изберете елемент." : "Select an element."}
        </p>
      </aside>
    );
  }

  const typeLabel = isBg ? NODE_TYPE_LABELS[node.type].bg : NODE_TYPE_LABELS[node.type].en;
  const patch = (p: Record<string, unknown>) => updateNode(node.id, p);

  return (
    <aside
      data-visual-editor-chrome
      className="flex w-72 shrink-0 flex-col border-l border-border bg-card"
    >
      <div className="border-b border-border px-3 py-2.5">
        <h2 className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBg ? "Свойства" : "Properties"}
        </h2>
        <p className="font-body text-sm text-foreground">{typeLabel}</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {node.type === "text" ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">{isBg ? "Текст" : "Text"}</Label>
                <Textarea
                  value={String(node.props.text ?? "")}
                  onChange={(e) => patch({ text: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{isBg ? "Вариант" : "Variant"}</Label>
                <Select
                  value={String(node.props.variant ?? "body")}
                  onValueChange={(v) => patch({ variant: v })}
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
            </>
          ) : null}

          {node.type === "button" ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">{isBg ? "Етикет" : "Label"}</Label>
                <Input
                  value={String(node.props.label ?? "")}
                  onChange={(e) => patch({ label: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input
                  value={String(node.props.href ?? "")}
                  onChange={(e) => patch({ href: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="/"
                />
              </div>
            </>
          ) : null}

          {node.type === "image" ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Src</Label>
                <Input
                  value={String(node.props.src ?? "")}
                  onChange={(e) => patch({ src: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alt</Label>
                <Input
                  value={String(node.props.alt ?? "")}
                  onChange={(e) => patch({ alt: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </>
          ) : null}

          <div className="space-y-1.5">
            <Label className="text-xs">className</Label>
            <Input
              value={String(node.props.className ?? "")}
              onChange={(e) => patch({ className: e.target.value })}
              className="h-8 text-xs font-mono"
            />
          </div>

          {(node.type === "image" || node.type === "container") && (
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
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
