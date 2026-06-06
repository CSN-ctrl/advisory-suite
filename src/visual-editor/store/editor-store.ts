import { create } from "zustand";
import {
  createDefaultPageDocument,
  type PageDocumentV2,
  type PageNode,
  type PageNodeProps,
  type PageNodeType,
} from "@/visual-editor/schema/page-node";
import {
  cloneNodeWithNewIds,
  cloneTree,
  duplicateNodeInTree,
  findDefaultDropParent,
  findNode,
  insertChildAt,
  insertPaletteNode,
  moveNodeInTree,
  removeNodeFromTree,
  reorderSibling,
  updateNodeInTree,
} from "@/visual-editor/lib/tree-ops";

const HISTORY_CAP = 50;

export type EditorMode = "edit" | "preview";
export type EditorViewport = "desktop" | "tablet" | "mobile";

export const VIEWPORT_WIDTHS: Record<EditorViewport, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

type Clipboard = { nodes: PageNode[] } | null;

export type EditorState = {
  root: PageNode;
  selectedIds: string[];
  hoveredId: string | null;
  mode: EditorMode;
  viewport: EditorViewport;
  gridSize: number;
  snapEnabled: boolean;
  inlineEditingId: string | null;
  past: PageNode[];
  future: PageNode[];
  clipboard: Clipboard;
  pageId: string | null;
  pageTitle: string;
  pageMeta: { title?: string; description?: string };
  published: boolean;
  dirty: boolean;

  loadDocument: (doc: PageDocumentV2, meta?: { pageId?: string; title?: string; published?: boolean }) => void;
  setPageMeta: (meta: { title?: string; description?: string }) => void;
  getDocument: () => PageDocumentV2;
  setRoot: (root: PageNode, options?: { skipHistory?: boolean }) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  commit: () => void;

  select: (id: string | null, additive?: boolean) => void;
  clearSelection: () => void;
  setHoveredId: (id: string | null) => void;
  setMode: (mode: EditorMode) => void;
  setViewport: (viewport: EditorViewport) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setInlineEditingId: (id: string | null) => void;
  setPublished: (published: boolean) => void;
  setDirty: (dirty: boolean) => void;

  updateNode: (id: string, patch: Partial<PageNodeProps>) => void;
  updateNodeLayout: (id: string, layout: Partial<NonNullable<PageNodeProps["layout"]>>) => void;
  insertNode: (parentId: string, type: PageNodeType, index?: number) => void;
  moveNode: (nodeId: string, targetParentId: string, targetIndex: number) => void;
  removeNode: (id: string) => void;
  duplicateSelected: () => void;
  removeSelected: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  reorderSelected: (direction: -1 | 1) => void;
};

function pushPast(state: EditorState, snapshot: PageNode): Pick<EditorState, "past" | "future"> {
  const past = [...state.past, cloneTree(snapshot)].slice(-HISTORY_CAP);
  return { past, future: [] };
}

export const useEditorStore = create<EditorState>((set, get) => {
  const defaultDoc = createDefaultPageDocument();

  return {
    root: defaultDoc.root,
    selectedIds: [],
    hoveredId: null,
    mode: "edit",
    viewport: "desktop",
    gridSize: 8,
    snapEnabled: true,
    inlineEditingId: null,
    past: [],
    future: [],
    clipboard: null,
    pageId: null,
    pageTitle: "",
    pageMeta: {},
    published: true,
    dirty: false,

    loadDocument: (doc, meta) => {
      set({
        root: cloneTree(doc.root),
        selectedIds: [],
        hoveredId: null,
        inlineEditingId: null,
        past: [],
        future: [],
        dirty: false,
        pageId: meta?.pageId ?? null,
        pageTitle: meta?.title ?? "",
        pageMeta: doc.meta ? { ...doc.meta } : {},
        published: meta?.published ?? true,
      });
    },

    setPageMeta: (pageMeta) => set({ pageMeta, dirty: true }),

    getDocument: () => ({
      version: 2,
      editor: "visual-tree",
      root: cloneTree(get().root),
      meta: get().pageMeta ? { ...get().pageMeta } : undefined,
    }),

    setRoot: (root, options) => {
      const state = get();
      const next = cloneTree(root);
      if (options?.skipHistory) {
        set({ root: next, dirty: true });
        return;
      }
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },

    pushHistory: () => {
      const state = get();
      set(pushPast(state, state.root));
    },

    commit: () => {
      get().pushHistory();
    },

    undo: () => {
      const { past, root, future } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1]!;
      set({
        past: past.slice(0, -1),
        future: [cloneTree(root), ...future].slice(0, HISTORY_CAP),
        root: cloneTree(previous),
        dirty: true,
      });
    },

    redo: () => {
      const { future, root, past } = get();
      if (future.length === 0) return;
      const next = future[0]!;
      set({
        future: future.slice(1),
        past: [...past, cloneTree(root)].slice(-HISTORY_CAP),
        root: cloneTree(next),
        dirty: true,
      });
    },

    select: (id, additive) => {
      if (!id) {
        set({ selectedIds: [], inlineEditingId: null });
        return;
      }
      const { selectedIds } = get();
      if (additive) {
        const exists = selectedIds.includes(id);
        set({
          selectedIds: exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
          inlineEditingId: null,
        });
      } else {
        set({ selectedIds: [id], inlineEditingId: null });
      }
    },

    clearSelection: () => set({ selectedIds: [], inlineEditingId: null }),

    setHoveredId: (id) => set({ hoveredId: id }),

    setMode: (mode) =>
      set({
        mode,
        inlineEditingId: mode === "preview" ? null : get().inlineEditingId,
      }),

    setViewport: (viewport) => set({ viewport }),

    setSnapEnabled: (snapEnabled) => set({ snapEnabled }),

    setInlineEditingId: (id) => set({ inlineEditingId: id }),

    setPublished: (published) => set({ published, dirty: true }),

    setDirty: (dirty) => set({ dirty }),

    updateNode: (id, patch) => {
      const state = get();
      const next = updateNodeInTree(state.root, id, (node) => ({
        ...node,
        props: { ...node.props, ...patch },
      }));
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },

    updateNodeLayout: (id, layout) => {
      const state = get();
      const next = updateNodeInTree(state.root, id, (node) => ({
        ...node,
        props: {
          ...node.props,
          layout: { ...node.props.layout, ...layout },
        },
      }));
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },

    insertNode: (parentId, type, index = -1) => {
      const state = get();
      const parent = findNode(state.root, parentId);
      if (!parent) return;
      const idx = index < 0 ? (parent.node.children?.length ?? 0) : index;
      const beforeLen = parent.node.children?.length ?? 0;
      const next = insertPaletteNode(state.root, parentId, type, idx);
      const afterParent = findNode(next, parentId);
      const newChild = afterParent?.node.children?.[idx] ?? afterParent?.node.children?.[beforeLen];
      set({
        ...pushPast(state, state.root),
        root: next,
        selectedIds: newChild ? [newChild.id] : [],
        dirty: true,
      });
    },

    moveNode: (nodeId, targetParentId, targetIndex) => {
      const state = get();
      const next = moveNodeInTree(state.root, nodeId, targetParentId, targetIndex);
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },

    removeNode: (id) => {
      if (id === get().root.id) return;
      const state = get();
      const next = removeNodeFromTree(state.root, id);
      set({
        ...pushPast(state, state.root),
        root: next,
        selectedIds: state.selectedIds.filter((x) => x !== id),
        dirty: true,
      });
    },

    duplicateSelected: () => {
      const state = get();
      let next = state.root;
      for (const id of state.selectedIds) {
        next = duplicateNodeInTree(next, id);
      }
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },

    removeSelected: () => {
      const state = get();
      let next = state.root;
      for (const id of state.selectedIds) {
        if (id !== state.root.id) next = removeNodeFromTree(next, id);
      }
      set({
        ...pushPast(state, state.root),
        root: next,
        selectedIds: [],
        dirty: true,
      });
    },

    copySelected: () => {
      const state = get();
      const nodes = state.selectedIds
        .map((id) => findNode(state.root, id)?.node)
        .filter((n): n is PageNode => n != null && n.type !== "page");
      if (nodes.length) set({ clipboard: { nodes: nodes.map(cloneTree) } });
    },

    pasteClipboard: () => {
      const state = get();
      if (!state.clipboard?.nodes.length) return;
      const parentId =
        state.selectedIds[0] != null
          ? (findNode(state.root, state.selectedIds[0]!)?.parent?.id ??
            findDefaultDropParent(state.root))
          : findDefaultDropParent(state.root);
      let next = cloneTree(state.root);
      const newIds: string[] = [];
      for (const node of state.clipboard.nodes) {
        const copy = cloneNodeWithNewIds(node);
        const idx = findNode(next, parentId)?.node.children?.length ?? 0;
        next = insertChildAt(next, parentId, copy, idx);
        newIds.push(copy.id);
      }
      set({
        ...pushPast(state, state.root),
        root: next,
        selectedIds: newIds,
        dirty: true,
      });
    },

    reorderSelected: (direction) => {
      const state = get();
      let next = state.root;
      for (const id of state.selectedIds) {
        next = reorderSibling(next, id, direction);
      }
      set({ ...pushPast(state, state.root), root: next, dirty: true });
    },
  };
});
