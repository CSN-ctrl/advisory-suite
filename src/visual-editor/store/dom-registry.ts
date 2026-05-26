/** DOM element registry — outside Zustand to avoid re-renders on every ref update. */

const registry = new Map<string, HTMLElement>();

export function registerDomNode(id: string, el: HTMLElement | null): void {
  if (el) {
    registry.set(id, el);
  } else {
    registry.delete(id);
  }
}

export function getDomNode(id: string): HTMLElement | undefined {
  return registry.get(id);
}

export function clearDomRegistry(): void {
  registry.clear();
}

export function getNodeIdFromElement(el: Element | null): string | null {
  if (!el) return null;
  const host = el.closest("[data-node-id]");
  if (!host) return null;
  return host.getAttribute("data-node-id");
}
