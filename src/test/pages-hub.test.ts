import { describe, expect, it } from "vitest";
import {
  buildCustomPageEntries,
  buildMarketingInlineEntries,
  isLayoutSlug,
} from "@/lib/pages-hub";
import { createDefaultDocument } from "@/lib/canvas-document";
import { createDefaultPageDocument } from "@/visual-editor/schema/page-node";
import type { SitePageRow } from "@/hooks/use-site-pages";

describe("pages-hub", () => {
  it("detects layout slugs", () => {
    expect(isLayoutSlug("layout-home-en")).toBe(true);
    expect(isLayoutSlug("about-us")).toBe(false);
  });

  it("builds marketing inline entries", () => {
    const entries = buildMarketingInlineEntries(false);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].editorKind).toBe("inline");
    expect(entries[0].published).toBeNull();
  });

  it("excludes layout slugs from custom pages", () => {
    const pages: SitePageRow[] = [
      {
        id: "1",
        slug: "layout-home-en",
        locale: "en",
        title: "Home layout",
        parent_id: null,
        sort_order: 0,
        published: true,
        editor: "canvas",
        blocks: [],
        document: createDefaultDocument(),
        pageTree: createDefaultPageDocument(),
        updated_at: "",
        created_at: "",
      },
      {
        id: "2",
        slug: "landing",
        locale: "en",
        title: "Landing",
        parent_id: null,
        sort_order: 0,
        published: false,
        editor: "visual-tree",
        blocks: [],
        document: createDefaultDocument(),
        pageTree: createDefaultPageDocument(),
        updated_at: "",
        created_at: "",
      },
    ];

    const custom = buildCustomPageEntries(pages);
    expect(custom).toHaveLength(1);
    expect(custom[0].path).toBe("/pages/landing");
    expect(custom[0].published).toBe(false);
  });
});
