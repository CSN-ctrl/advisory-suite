import { describe, expect, it } from "vitest";
import {
  createDefaultPageDocument,
  isPageDocumentV2,
  normalizePageDocument,
} from "@/visual-editor/schema/page-node";
import {
  cloneTree,
  duplicateNodeInTree,
  findNode,
  insertPaletteNode,
  removeNodeFromTree,
} from "@/visual-editor/lib/tree-ops";

describe("page document v2", () => {
  it("detects and normalizes v2 documents", () => {
    const doc = createDefaultPageDocument();
    expect(isPageDocumentV2(doc)).toBe(true);
    const normalized = normalizePageDocument(doc);
    expect(normalized.root.type).toBe("page");
    expect(normalized.root.children?.length).toBeGreaterThan(0);
  });
});

describe("tree-ops", () => {
  it("inserts and finds nodes", () => {
    const doc = createDefaultPageDocument();
    const sectionId = doc.root.children![0]!.id;
    const next = insertPaletteNode(doc.root, sectionId, "text", 0);
    const text = next.children?.[0]?.children?.[0];
    expect(text?.type).toBe("text");
    expect(findNode(next, text!.id)?.node.id).toBe(text!.id);
  });

  it("removes nodes", () => {
    const doc = createDefaultPageDocument();
    const textId = doc.root.children![0]!.children![0]!.id;
    const next = removeNodeFromTree(doc.root, textId);
    expect(findNode(next, textId)).toBeNull();
  });

  it("duplicates nodes", () => {
    const doc = createDefaultPageDocument();
    const textId = doc.root.children![0]!.children![0]!.id;
    const next = duplicateNodeInTree(doc.root, textId);
    const section = findNode(next, doc.root.children![0]!.id)?.node;
    const texts = section?.children?.filter((c) => c.type === "text") ?? [];
    expect(texts.length).toBeGreaterThan(1);
  });

  it("clones tree immutably", () => {
    const doc = createDefaultPageDocument();
    const copy = cloneTree(doc.root);
    copy.children![0]!.props.className = "mutated";
    expect(doc.root.children![0]!.props.className).not.toBe("mutated");
  });
});
