import type { CanvasDocument, CanvasElement } from "@/lib/canvas-document";
import { styleToInline } from "@/lib/canvas-document";
import { cn } from "@/lib/utils";

interface CanvasRendererProps {
  document: CanvasDocument;
  className?: string;
  scale?: number;
}

/** Renders canvas JSON as real UI (public / preview). */
export function CanvasRenderer({ document: doc, className, scale = 1 }: CanvasRendererProps) {
  const sorted = [...doc.elements].sort((a, b) => (a.position.zIndex ?? 0) - (b.position.zIndex ?? 0));

  return (
    <div
      className={cn("relative mx-auto overflow-hidden bg-background shadow-sm", className)}
      style={{
        width: doc.canvas.width * scale,
        height: doc.canvas.height * scale,
      }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: doc.canvas.width,
          height: doc.canvas.height,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
        }}
      >
        {sorted.map((element) => (
          <CanvasElementRender key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
}

function CanvasElementRender({ element }: { element: CanvasElement }) {
  const { x, y, width, height, zIndex } = element.position;
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    zIndex: zIndex ?? 1,
    overflow: "hidden",
    ...styleToInline(element.style),
  };

  switch (element.type) {
    case "image":
      return (
        <div style={baseStyle}>
          <img
            src={element.content}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      );
    case "button":
      return (
        <div style={baseStyle} className="flex items-center justify-center font-body">
          <span>{element.content}</span>
        </div>
      );
    case "box":
      return <div style={baseStyle} aria-hidden />;
    case "heading":
      return (
        <div style={baseStyle} className="font-serif">
          <h2 className="m-0 h-full w-full overflow-hidden" style={{ fontSize: "inherit", fontWeight: "inherit" }}>
            {element.content}
          </h2>
        </div>
      );
    case "text":
    default:
      return (
        <div style={baseStyle} className="font-body whitespace-pre-wrap">
          {element.content}
        </div>
      );
  }
}
