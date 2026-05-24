import DOMPurify from "dompurify";

const HTML_LIKE = /^<[a-z][\s\S]*>/i;

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
];

const ALLOWED_ATTR = ["href", "title", "target", "rel", "class", "style", "colspan", "rowspan", "data-color", "color"];

/** Sanitize HTML before rendering or persisting (admin-authored, defense in depth). */
export function sanitizeRichHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
