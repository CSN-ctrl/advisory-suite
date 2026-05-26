# Visual DOM Editor

Tree-based page builder with real React rendering and a DOM overlay for selection/editing.

## Add a component type

1. Add the type to `PAGE_NODE_TYPES` in `schema/page-node.ts`.
2. Register it in `registry/component-registry.tsx` with `render`, `defaultProps`, and `paletteLabel`.
3. Add property fields in `editor/panels/PropertiesPanel.tsx` if needed.

## Architecture

- **Renderer** (`renderer/`) — pure UI from `PageNode` tree; sets `data-node-id` via `EditableShell`.
- **Editor** (`editor/`) — overlay, DnD, guards, panels; never imported by renderer.
- **Store** (`store/editor-store.ts`) — Zustand document + selection + undo/redo.
- **Persistence** — `site_pages.blocks` JSON with `{ version: 2, editor: "visual-tree", root }`.

## Routes

- Admin: `/admin/visual-builder/:pageId`
- Public: `/pages/:slug` when page editor is `visual-tree`
