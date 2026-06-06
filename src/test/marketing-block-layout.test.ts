import { describe, expect, it } from "vitest";
import { createDefaultDocument, type CanvasElement } from "@/lib/canvas-document";
import { buildMarketingBlockLayout, marketingBlocksLayoutIsActive } from "@/lib/marketing-block-layout";

describe("marketing-block-layout", () => {
  it("detects active blocks layout mode", () => {
    const doc = createDefaultDocument();
    doc.layoutMode = "blocks";
    doc.elements = [
      {
        id: "a",
        blockId: "home-hero",
        type: "box",
        content: "Hero",
        style: {},
        position: { x: 0, y: 0, width: 100, height: 80, zIndex: 1 },
      },
    ];
    expect(marketingBlocksLayoutIsActive(doc)).toBe(true);
  });

  it("orders blocks by vertical position and applies hidden flag", () => {
    const doc = createDefaultDocument();
    doc.layoutMode = "blocks";
    const mk = (blockId: string, y: number, hidden?: boolean): CanvasElement => ({
      id: blockId,
      blockId,
      type: "box",
      content: blockId,
      style: {},
      position: { x: 0, y, width: 100, height: 80, zIndex: 1 },
      hidden,
    });
    doc.elements = [mk("home-services", 400), mk("home-hero", 0), mk("home-approach", 200, true)];

    const layout = buildMarketingBlockLayout(doc);
    expect(layout.get("home-hero")?.order).toBe(0);
    expect(layout.get("home-approach")?.order).toBe(1);
    expect(layout.get("home-approach")?.hidden).toBe(true);
    expect(layout.get("home-services")?.order).toBe(2);
  });

  it("maps padding and background to live styles", () => {
    const doc = createDefaultDocument();
    doc.layoutMode = "blocks";
    doc.elements = [
      {
        id: "x",
        blockId: "home-hero",
        type: "box",
        content: "Hero",
        style: { padding: "24px", backgroundColor: "hsl(0 0% 98%)" },
        position: { x: 0, y: 0, width: 100, height: 80, zIndex: 1 },
      },
    ];
    const layout = buildMarketingBlockLayout(doc);
    expect(layout.get("home-hero")?.style.padding).toBe("24px");
    expect(layout.get("home-hero")?.style.backgroundColor).toBe("hsl(0 0% 98%)");
  });
});
