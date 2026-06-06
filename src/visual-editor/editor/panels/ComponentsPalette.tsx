import { Layout, Square, Type, Image, MousePointer2, Minus, MoveVertical, Sparkles, Rows3, Megaphone } from "lucide-react";
import { PALETTE_NODE_TYPES, NODE_TYPE_LABELS } from "@/visual-editor/schema/page-node";
import { DraggablePaletteItem } from "@/visual-editor/editor/dnd/DraggablePaletteItem";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS = {
  section: Layout,
  container: Square,
  text: Type,
  button: MousePointer2,
  image: Image,
  divider: Minus,
  spacer: MoveVertical,
  goldDash: Sparkles,
  serviceRow: Rows3,
  ctaStrip: Megaphone,
} as const;

interface ComponentsPaletteProps {
  locale: string;
}

export function ComponentsPalette({ locale }: ComponentsPaletteProps) {
  const isBg = locale === "bg";

  return (
    <aside
      data-visual-editor-chrome
      className="flex w-56 shrink-0 flex-col border-r border-border bg-navy text-white"
    >
      <div className="border-b border-white/10 px-3 py-2.5">
        <h2 className="font-body text-xs font-bold uppercase tracking-wider text-white/70">
          {isBg ? "Компоненти" : "Components"}
        </h2>
        <p className="mt-1 font-body text-[10px] text-white/50">
          {isBg ? "Плъзнете върху страницата" : "Drag onto the page"}
        </p>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-1.5">
          {PALETTE_NODE_TYPES.map((type) => {
            const Icon = ICONS[type as keyof typeof ICONS] ?? Square;
            const label = isBg ? NODE_TYPE_LABELS[type].bg : NODE_TYPE_LABELS[type].en;
            return (
              <DraggablePaletteItem
                key={type}
                type={type}
                label={label}
                icon={<Icon className="h-3.5 w-3.5 shrink-0 text-accent" />}
              />
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
