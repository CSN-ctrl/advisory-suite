import { describe, expect, it } from "vitest";
import { createPageFromTemplate } from "@/visual-editor/lib/page-templates";
import { isPageDocumentV2 } from "@/visual-editor/schema/page-node";

describe("page-templates", () => {
  it("creates valid documents for each template", () => {
    for (const id of ["blank", "about", "landing", "minimal"] as const) {
      const doc = createPageFromTemplate(id, "en");
      expect(isPageDocumentV2(doc)).toBe(true);
      expect(doc.root.children?.length).toBeGreaterThan(0);
    }
  });

  it("landing template includes site components", () => {
    const doc = createPageFromTemplate("landing", "en");
    const types = JSON.stringify(doc.root);
    expect(types).toContain("serviceRow");
    expect(types).toContain("ctaStrip");
  });
});
