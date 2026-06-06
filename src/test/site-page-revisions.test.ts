import { describe, expect, it } from "vitest";
import {
  blocksPayloadEqual,
  nextRevisionPayload,
  patchHasContentChange,
} from "@/lib/site-page-revisions";

describe("site-page-revisions", () => {
  it("detects content patches", () => {
    expect(patchHasContentChange({})).toBe(false);
    expect(patchHasContentChange({ blocks: [] })).toBe(true);
    expect(patchHasContentChange({ document: { version: 1 } })).toBe(true);
    expect(patchHasContentChange({ pageTree: { version: 2 } })).toBe(true);
  });

  it("picks the next payload by editor priority", () => {
    expect(nextRevisionPayload({ blocks: [1], document: { v: 1 } })).toEqual({ v: 1 });
    expect(nextRevisionPayload({ blocks: [1] })).toEqual([1]);
  });

  it("compares JSON payloads", () => {
    expect(blocksPayloadEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(blocksPayloadEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});
