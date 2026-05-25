import { useEffect } from "react";
import { isAllowedAppScript, nodeMatchesXssBlocklist, XSS_BLOCKED_CLASS_NAMES } from "@/lib/xss-blocklist";

function shouldRemoveNode(el: Element): boolean {
  if (el.id === "root") return false;

  if (el.tagName === "SCRIPT" && !isAllowedAppScript(el)) {
    return true;
  }

  if (nodeMatchesXssBlocklist(el)) {
    return true;
  }

  for (const name of XSS_BLOCKED_CLASS_NAMES) {
    if (el.classList.contains(name)) return true;
  }

  return false;
}

/** Removes injected DOM (XSS / malvertising overlays) outside trusted app scripts. */
export function purgeInjectedDom(): number {
  const root = document.getElementById("root");
  let removed = 0;

  for (const child of Array.from(document.body.children)) {
    if (child === root) continue;
    if (shouldRemoveNode(child)) {
      child.remove();
      removed += 1;
    }
  }

  for (const name of XSS_BLOCKED_CLASS_NAMES) {
    document.querySelectorAll(`.${name}`).forEach((el) => {
      if (shouldRemoveNode(el)) {
        el.remove();
        removed += 1;
      }
    });
  }

  document.querySelectorAll("script").forEach((el) => {
    if (shouldRemoveNode(el)) {
      el.remove();
      removed += 1;
    }
  });

  return removed;
}

/** Runs continuously so reinjected overlays are stripped. */
export default function XssGuard() {
  useEffect(() => {
    purgeInjectedDom();

    const observer = new MutationObserver(() => {
      purgeInjectedDom();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    const interval = window.setInterval(purgeInjectedDom, 2000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
