import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { useMarketingCanvasPage } from "@/hooks/use-marketing-canvas-page";
import {
  createElement,
  createDefaultDocument,
  type CanvasDocument,
  type CanvasElement,
  type CanvasElementType,
} from "@/lib/canvas-document";
import { isMarketingRoute, mergeScannedWithDocument, scanPageBlocks } from "@/lib/marketing-canvas";

type PageCanvasEditorContextValue = {
  isActive: boolean;
  loading: boolean;
  pageId: string | null;
  document: CanvasDocument;
  selectedId: string | null;
  showInspector: boolean;
  showLayers: boolean;
  setSelectedId: (id: string | null) => void;
  setShowInspector: (v: boolean) => void;
  setShowLayers: (v: boolean) => void;
  updateElement: (id: string, next: CanvasElement) => void;
  addElement: (type: CanvasElementType) => void;
  removeElement: (id: string) => void;
  reorderElements: (elements: CanvasElement[]) => void;
  setCanvasSize: (canvas: CanvasDocument["canvas"]) => void;
  rescanPage: () => void;
  save: () => Promise<void>;
  registerRoot: (el: HTMLElement | null) => void;
};

const PageCanvasEditorContext = createContext<PageCanvasEditorContextValue | null>(null);

export function PageCanvasEditorProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  /** Live-site overlay disabled — edit layouts in /admin/pages instead. */
  const isActive = false;

  const { row, loading, saveDocument } = useMarketingCanvasPage(location.pathname, locale);
  const [document, setDocument] = useState<CanvasDocument>(createDefaultDocument());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const scanTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (row?.document) {
      setDocument(row.document);
      setSelectedId(row.document.elements[0]?.id ?? null);
    }
  }, [row?.id, row?.document]);

  const registerRoot = useCallback((el: HTMLElement | null) => {
    rootRef.current = el;
  }, []);

  const rescanPage = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const scanned = scanPageBlocks(root);
    if (scanned.length === 0) {
      toast.message(locale === "bg" ? "Няма блокове за сканиране" : "No blocks found to scan");
      return;
    }
    setDocument((prev) => {
      const merged = mergeScannedWithDocument(scanned, prev);
      return {
        ...merged,
        canvas: {
          ...merged.canvas,
          height: Math.max(merged.canvas.height, root.scrollHeight),
        },
      };
    });
    toast.success(
      locale === "bg" ? `${scanned.length} блока на платното` : `${scanned.length} blocks on canvas`,
    );
  }, [locale]);

  useEffect(() => {
    if (!isActive || loading) return;

    const scheduleScan = () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = window.setTimeout(() => {
        const root = rootRef.current;
        if (!root) return;
        const scanned = scanPageBlocks(root);
        if (scanned.length > 0) {
          setDocument((prev) => {
            const merged = mergeScannedWithDocument(scanned, prev);
            const scrollH = root.scrollHeight;
            return {
              ...merged,
              canvas: {
                ...merged.canvas,
                height: Math.max(merged.canvas.height, scrollH),
              },
            };
          });
        }
      }, 400);
    };

    scheduleScan();
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(scheduleScan);
    observer.observe(root);
    window.addEventListener("resize", scheduleScan);

    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      observer.disconnect();
      window.removeEventListener("resize", scheduleScan);
    };
  }, [isActive, loading, location.pathname, locale]);

  const updateElement = useCallback((id: string, next: CanvasElement) => {
    setDocument((prev) => ({
      ...prev,
      elements: prev.elements.map((e) => (e.id === id ? next : e)),
    }));
  }, []);

  const addElement = useCallback((type: CanvasElementType) => {
    const el = createElement(type);
    const maxZ = document.elements.reduce((m, e) => Math.max(m, e.position.zIndex ?? 1), 0);
    el.position.zIndex = maxZ + 1;
    setDocument((prev) => ({ ...prev, elements: [...prev.elements, el] }));
    setSelectedId(el.id);
  }, [document.elements]);

  const removeElement = useCallback((id: string) => {
    setDocument((prev) => {
      const next = prev.elements.filter((e) => e.id !== id);
      return { ...prev, elements: next.length > 0 ? next : prev.elements };
    });
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const reorderElements = useCallback((elements: CanvasElement[]) => {
    setDocument((prev) => ({ ...prev, elements }));
  }, []);

  const setCanvasSize = useCallback((canvas: CanvasDocument["canvas"]) => {
    setDocument((prev) => ({ ...prev, canvas }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const result = await saveDocument(document);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(locale === "bg" ? "Оформлението е запазено" : "Layout saved");
  }, [document, locale, saveDocument]);

  const value = useMemo<PageCanvasEditorContextValue>(
    () => ({
      isActive,
      loading: loading || saving,
      pageId: row?.id ?? null,
      document,
      selectedId,
      showInspector,
      showLayers,
      setSelectedId,
      setShowInspector,
      setShowLayers,
      updateElement,
      addElement,
      removeElement,
      reorderElements,
      setCanvasSize,
      rescanPage,
      save,
      registerRoot,
    }),
    [
      isActive,
      loading,
      saving,
      row?.id,
      document,
      selectedId,
      showInspector,
      showLayers,
      updateElement,
      addElement,
      removeElement,
      reorderElements,
      setCanvasSize,
      rescanPage,
      save,
      registerRoot,
    ],
  );

  return <PageCanvasEditorContext.Provider value={value}>{children}</PageCanvasEditorContext.Provider>;
}

export function usePageCanvasEditor() {
  const ctx = useContext(PageCanvasEditorContext);
  if (!ctx) {
    throw new Error("usePageCanvasEditor must be used within PageCanvasEditorProvider");
  }
  return ctx;
}

export function usePageCanvasEditorOptional() {
  return useContext(PageCanvasEditorContext);
}
