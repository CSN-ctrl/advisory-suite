import { describe, expect, it } from "vitest";
import {
  createDefaultDocument,
  documentUsesCanvasRenderer,
  isCanvasDocument,
  normalizeCanvasDocument,
} from "@/lib/canvas-document";

describe("canvas-document", () => {
  it("creates default document with canvas editor flag", () => {
    const doc = createDefaultDocument();
    expect(doc.version).toBe(1);
    expect(doc.editor).toBe("canvas");
    expect(doc.elements.length).toBeGreaterThan(0);
  });

  it("normalizes legacy empty input", () => {
    const doc = normalizeCanvasDocument([]);
    expect(isCanvasDocument(doc)).toBe(true);
  });

  it("blocks layout keeps public React page", () => {
    const doc = createDefaultDocument();
    doc.layoutMode = "blocks";
    expect(documentUsesCanvasRenderer(doc)).toBe(false);
  });

  it("freeform elements use public canvas renderer", () => {
    const doc = createDefaultDocument();
    doc.layoutMode = "canvas";
    expect(documentUsesCanvasRenderer(doc)).toBe(true);
  });
});
