import { describe, expect, it } from "vitest";
import { marketingCanvasSlug, marketingPageFromPath, mergeScannedWithDocument } from "@/lib/marketing-canvas";
import { createDefaultDocument, type CanvasElement } from "@/lib/canvas-document";

describe("marketing-canvas", () => {
  it("maps paths to content pages", () => {
    expect(marketingPageFromPath("/")).toBe("home");
    expect(marketingPageFromPath("/about")).toBe("about");
    expect(marketingPageFromPath("/insights/my-post")).toBe("insight_article");
    expect(marketingPageFromPath("/admin")).toBeNull();
  });

  it("builds layout slug per locale", () => {
    expect(marketingCanvasSlug("home", "en")).toBe("layout-home-en");
    expect(marketingCanvasSlug("home", "bg")).toBe("layout-home-bg");
  });

  it("merges scanned blocks with saved positions", () => {
    const scanned: CanvasElement[] = [
      {
        id: "hero",
        blockId: "hero",
        type: "box",
        content: "Hero",
        style: {},
        position: { x: 0, y: 0, width: 100, height: 80, zIndex: 1 },
      },
    ];
    const doc = createDefaultDocument();
    doc.elements.push({
      id: "hero",
      blockId: "hero",
      type: "box",
      content: "Hero",
      style: { border: "1px solid red" },
      position: { x: 10, y: 20, width: 200, height: 100, zIndex: 5 },
    });
    const merged = mergeScannedWithDocument(scanned, doc);
    expect(merged.elements.find((e) => e.blockId === "hero")?.position.x).toBe(10);
  });
});
