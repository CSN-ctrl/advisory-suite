import { describe, expect, it } from "vitest";
import { nodeMatchesXssBlocklist } from "@/lib/xss-blocklist";
import { plainTextBoldToSafeHtml, sanitizeRichHtml } from "@/lib/rich-text-html";

describe("XSS sanitization", () => {
  it("strips script tags from rich HTML", () => {
    const out = sanitizeRichHtml('<p>Hi</p><script>alert(1)</script><div class="main-shell">bad</div>');
    expect(out.toLowerCase()).not.toContain("<script");
    expect(out).not.toContain("main-shell");
  });

  it("blocks javascript: links", () => {
    const out = sanitizeRichHtml('<a href="javascript:alert(1)">x</a>');
    expect(out.toLowerCase()).not.toContain("javascript:");
  });

  it("allows bold markup from plainTextBoldToSafeHtml", () => {
    const out = plainTextBoldToSafeHtml("Hello **world**");
    expect(out).toContain("<strong");
    expect(out).toContain("world");
    expect(out).not.toContain("<script");
  });

  it("detects known scam overlay text", () => {
    const el = document.createElement("div");
    el.textContent = "Prove you are not a robot. Scan this QR code.";
    expect(nodeMatchesXssBlocklist(el)).toBe(true);
  });
});
