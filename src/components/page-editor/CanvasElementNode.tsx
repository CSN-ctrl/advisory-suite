import { useCallback, useRef } from "react";
import type { CanvasElement } from "@/lib/canvas-document";
import { styleToInline } from "@/lib/canvas-document";
import { cn } from "@/lib/utils";

interface CanvasElementNodeProps {
  element: CanvasElement;
  isSelected: boolean;
  isEditing: boolean;
  /** Viewport scale applied to the canvas (pointer deltas are in screen px). */
  canvasScale?: number;
  /** Overlay on a live page block — keep transparent so content stays visible. */
  linkedBlock?: boolean;
  onSelect: () => void;
  onChange: (next: CanvasElement) => void;
}

export function CanvasElementNode({
  element,
  isSelected,
  isEditing,
  canvasScale = 1,
  linkedBlock = false,
  onSelect,
  onChange,
}: CanvasElementNodeProps) {
  const { x, y, width, height, zIndex } = element.position;
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const updatePosition = useCallback(
    (patch: Partial<typeof element.position>) => {
      onChange({ ...element, position: { ...element.position, ...patch } });
    },
    [element, onChange],
  );

  const onDragPointerDown = (e: React.PointerEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    onSelect();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y };
  };

  const onDragPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / canvasScale;
    const dy = (e.clientY - dragRef.current.startY) / canvasScale;
    updatePosition({
      x: Math.max(0, dragRef.current.origX + dx),
      y: Math.max(0, dragRef.current.origY + dy),
    });
  };

  const onDragPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onResizePointerDown = (e: React.PointerEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: width, origH: height };
  };

  const onResizePointerMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dw = (e.clientX - resizeRef.current.startX) / canvasScale;
    const dh = (e.clientY - resizeRef.current.startY) / canvasScale;
    updatePosition({
      width: Math.max(40, resizeRef.current.origW + dw),
      height: Math.max(24, resizeRef.current.origH + dh),
    });
  };

  const onResizePointerUp = (e: React.PointerEvent) => {
    resizeRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    zIndex: zIndex ?? 1,
    ...(linkedBlock ? {} : styleToInline(element.style)),
  };

  const ring = cn(
    linkedBlock && "editor-block-overlay",
    linkedBlock && element.hidden && "opacity-40",
    linkedBlock && isSelected && "editor-block-overlay--selected",
    linkedBlock && !isSelected && "editor-block-overlay--idle",
    !linkedBlock && isSelected && isEditing && "ring-2 ring-accent ring-offset-2 ring-offset-background",
  );

  const inner = () => {
    switch (element.type) {
      case "image":
        return (
          <img
            src={element.content}
            alt=""
            className="pointer-events-none h-full w-full object-cover"
            draggable={false}
          />
        );
      case "button":
        return isEditing && isSelected ? (
          <div
            className="flex h-full w-full items-center justify-center font-body outline-none"
            contentEditable
            suppressContentEditableWarning
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={(e) => onChange({ ...element, content: e.currentTarget.textContent ?? "" })}
          >
            {element.content}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center font-body pointer-events-none">
            {element.content}
          </div>
        );
      case "box":
      case "card":
        if (linkedBlock) {
          return (
            <span className="editor-block-label pointer-events-none absolute left-2 top-0 max-w-[calc(100%-1rem)] -translate-y-1/2 truncate rounded-md bg-navy px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-accent shadow-md">
              {element.label ?? element.content}
            </span>
          );
        }
        return element.type === "card" ? (
          <div className="pointer-events-none flex h-full w-full items-center justify-center font-body text-xs text-muted-foreground">
            {element.label ?? element.content}
          </div>
        ) : null;
      case "heading":
        return isEditing && isSelected ? (
          <div
            className="h-full w-full overflow-auto font-serif outline-none"
            contentEditable
            suppressContentEditableWarning
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={(e) => onChange({ ...element, content: e.currentTarget.textContent ?? "" })}
          >
            {element.content}
          </div>
        ) : (
          <h2 className="m-0 h-full w-full overflow-hidden font-serif" style={{ fontSize: "inherit" }}>
            {element.content}
          </h2>
        );
      case "text":
      default:
        return isEditing && isSelected ? (
          <div
            className="h-full w-full overflow-auto font-body whitespace-pre-wrap outline-none"
            contentEditable
            suppressContentEditableWarning
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={(e) => onChange({ ...element, content: e.currentTarget.textContent ?? "" })}
          >
            {element.content}
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden font-body whitespace-pre-wrap">{element.content}</div>
        );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn("group/el pointer-events-auto", ring)}
      style={baseStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={onDragPointerDown}
      onPointerMove={onDragPointerMove}
      onPointerUp={onDragPointerUp}
    >
      {inner()}
      {isSelected && isEditing ? (
        <div
          className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize rounded-sm bg-accent"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        />
      ) : null}
    </div>
  );
}
