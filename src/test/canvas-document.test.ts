import { describe, expect, it } from "vitest";
import { createDefaultDocument, isCanvasDocument, normalizeCanvasDocument } from "@/lib/canvas-document";

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
});
