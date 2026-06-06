# Visual DOM Editor

Tree-based page builder with real React rendering and a DOM overlay for selection/editing.

## Add a component type

1. Add the type to `PAGE_NODE_TYPES` in `schema/page-node.ts`.
2. Register it in `registry/component-registry.tsx` with `render`, `defaultProps`, and `paletteLabel`.
3. Add property fields in `editor/panels/PropertiesPanel.tsx` if needed.

## Page templates

New Visual DOM pages can start from templates in `lib/page-templates.ts` (Blank, About, Landing, Minimal). Templates are chosen in **Pages Hub → New page**.

## Site components

Palette includes site-specific blocks: **Gold dash**, **Service row**, and **CTA strip** — styled to match the marketing site.

## Architecture

- **Renderer** (`renderer/`) — pure UI from `PageNode` tree; sets `data-node-id` via `EditableShell`.
- **Editor** (`editor/`) — overlay, DnD, guards, panels; never imported by renderer.
- **Store** (`store/editor-store.ts`) — Zustand document + selection + undo/redo + page SEO meta.
- **Persistence** — `site_pages.blocks` JSON with `{ version: 2, editor: "visual-tree", root, meta? }`.

## Routes

- Hub: `/admin/pages`
- Admin: `/admin/visual-builder/:pageId`
- Public: `/pages/:slug` when page editor is `visual-tree`
- Draft preview: `/pages/:slug?draft=1` (admins only, when unpublished)

## Marketing canvas vs inline

Marketing **canvas layout** editors annotate sections — copy and images on live pages are edited with **Edit Mode** on the site, not in the canvas editor.
