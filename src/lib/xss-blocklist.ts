/** Known malicious / injected UI patterns (not used by this app). */
export const XSS_BLOCKED_CLASS_NAMES = ["main-shell", "robot-check", "qr-verify-overlay"] as const;

export const XSS_BLOCKED_TEXT = [
  "prove you are not a robot",
  "scan this qr code",
  "scan this qr",
  "open a link",
  "i'm not a robot",
] as const;

export function nodeMatchesXssBlocklist(el: Element): boolean {
  const cls = el.className;
  if (typeof cls === "string") {
    const lower = cls.toLowerCase();
    for (const blocked of XSS_BLOCKED_CLASS_NAMES) {
      if (lower.includes(blocked)) return true;
    }
  }

  const text = (el.textContent ?? "").toLowerCase().slice(0, 2000);
  if (text.length > 0) {
    for (const snippet of XSS_BLOCKED_TEXT) {
      if (text.includes(snippet)) return true;
    }
  }

  return false;
}

export function isAllowedAppScript(el: Element): boolean {
  if (el.tagName !== "SCRIPT") return false;
  const src = el.getAttribute("src");
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}
