import { describe, expect, it } from "vitest";
import { resolveMediaSrc } from "@/lib/resolve-media-src";

describe("resolveMediaSrc", () => {
  it("uses default when cms value is empty", () => {
    expect(resolveMediaSrc("", "/default.png")).toBe("/default.png");
  });

  it("uses https urls from cms", () => {
    expect(resolveMediaSrc("https://cdn.example.com/a.jpg", "/default.png")).toBe(
      "https://cdn.example.com/a.jpg",
    );
  });
});
