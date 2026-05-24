export type PageBlock =
  | { id: string; type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { id: string; type: "richText"; html: string }
  | { id: string; type: "image"; src: string; alt?: string }
  | { id: string; type: "spacer"; heightPx: number }
  | { id: string; type: "divider" };

export function newBlockId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultBlocks(): PageBlock[] {
  return [{ id: newBlockId(), type: "richText", html: "<p></p>" }];
}

export function normalizeBlocks(raw: unknown): PageBlock[] {
  if (!Array.isArray(raw)) {
    return createDefaultBlocks();
  }
  const out: PageBlock[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : newBlockId();
    const type = r.type;
    if (type === "heading" && typeof r.text === "string") {
      const levelRaw = Number(r.level);
      const level = ([1, 2, 3, 4, 5, 6] as const).find((n) => n === levelRaw) ?? 2;
      out.push({ id, type: "heading", level, text: r.text });
    } else if (type === "richText" && typeof r.html === "string") {
      out.push({ id, type: "richText", html: r.html });
    } else if (type === "image" && typeof r.src === "string") {
      out.push({ id, type: "image", src: r.src, alt: typeof r.alt === "string" ? r.alt : undefined });
    } else if (type === "spacer" && typeof r.heightPx === "number") {
      out.push({ id, type: "spacer", heightPx: Math.max(8, Math.min(400, r.heightPx)) });
    } else if (type === "divider") {
      out.push({ id, type: "divider" });
    }
  }
  return out.length > 0 ? out : createDefaultBlocks();
}

export const BLOCK_TYPE_LABELS: Record<PageBlock["type"], { en: string; bg: string }> = {
  heading: { en: "Heading", bg: "Заглавие" },
  richText: { en: "Rich text", bg: "Форматиран текст" },
  image: { en: "Image", bg: "Изображение" },
  spacer: { en: "Spacer", bg: "Разстояние" },
  divider: { en: "Divider", bg: "Разделител" },
};
