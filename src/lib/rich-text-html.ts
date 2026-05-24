import DOMPurify from "dompurify";

const HTML_LIKE = /^<[a-z][\s\S]*>/i;

let purifyRichMediaHooksInstalled = false;

function ensurePurifyRichMediaHooks(): void {
  if (purifyRichMediaHooksInstalled) return;
  purifyRichMediaHooksInstalled = true;

  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    const el = node as Element;
    if (el.nodeName === "IFRAME" && data.attrName === "src") {
      const v = String(data.attrValue ?? "");
      if (!/^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//i.test(v)) {
        data.keepAttr = false;
      }
    }
    if (el.nodeName === "IMG" && data.attrName === "src") {
      const v = String(data.attrValue ?? "");
      if (!/^https:\/\//i.test(v)) {
        data.keepAttr = false;
      }
    }
  });
}

/** Heuristic: stored value is TipTap / HTML (not legacy plain text). */
export function isStoredRichHtml(raw: string): boolean {
  const t = raw.trim();
  if (t.length < 2) return false;
  return HTML_LIKE.test(t);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Convert legacy plain text (with newlines) into HTML the rich editor understands. */
export function plainTextToTipTapHtml(plain: string): string {
  const normalized = plain.replace(/\r\n/g, "\n");
  const trimmed = normalized.trim();
  if (trimmed.length === 0) {
    return "<p></p>";
  }
  const blocks = normalized.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const withBreaks = escapeHtml(block).replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

export function normalizeEditorHtml(raw: string): string {
  if (isStoredRichHtml(raw)) {
    return raw.trim().length === 0 ? "<p></p>" : raw;
  }
  return plainTextToTipTapHtml(raw);
}

export function htmlPlainTextApprox(html: string): string {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, " ").trim();
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? "";
}

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "sub",
  "sup",
  "span",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "mark",
  "hr",
  "div",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "img",
  "iframe",
  "input",
  "label",
];

const ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "class",
  "style",
  "colspan",
  "rowspan",
  "data-color",
  "color",
  "src",
  "alt",
  "width",
  "height",
  "loading",
  "referrerpolicy",
  "allow",
  "allowfullscreen",
  "frameborder",
  "type",
  "checked",
  "disabled",
  "data-youtube-video",
  "data-type",
  "data-checked",
  "data-colwidth",
  "colwidth",
  "start",
  "aria-label",
];

/** Sanitize HTML before rendering or persisting (admin-authored, defense in depth). */
export function sanitizeRichHtml(dirty: string): string {
  ensurePurifyRichMediaHooks();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
