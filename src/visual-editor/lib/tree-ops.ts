import { canHaveChildren, createNode, newNodeId, type PageNode, type PageNodeType } from "@/visual-editor/schema/page-node";

export type NodeLocation = {
  node: PageNode;
  parent: PageNode | null;
  index: number;
};

export function cloneTree(node: PageNode): PageNode {
  return {
    ...node,
    props: { ...node.props },
    children: node.children?.map(cloneTree),
  };
}

export function findNode(root: PageNode, id: string): NodeLocation | null {
  if (root.id === id) {
    return { node: root, parent: null, index: 0 };
  }
  const walk = (parent: PageNode, children: PageNode[]): NodeLocation | null => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      if (child.id === id) {
        return { node: child, parent, index: i };
      }
      if (child.children?.length) {
        const found = walk(child, child.children);
        if (found) return found;
      }
    }
    return null;
  };
  if (root.children?.length) {
    return walk(root, root.children);
  }
  return null;
}

export function updateNodeInTree(root: PageNode, id: string, updater: (node: PageNode) => PageNode): PageNode {
  if (root.id === id) {
    return updater(cloneTree(root));
  }
  if (!root.children?.length) return root;
  return {
    ...root,
    children: root.children.map((child) => updateNodeInTree(child, id, updater)),
  };
}

export function removeNodeFromTree(root: PageNode, id: string): PageNode {
  if (root.id === id) return root;
  if (!root.children?.length) return root;
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNodeFromTree(c, id)),
  };
}

export function insertChildAt(
  root: PageNode,
  parentId: string,
  child: PageNode,
  index: number,
): PageNode {
  if (root.id === parentId) {
    if (!canHaveChildren(root.type)) return root;
    const children = [...(root.children ?? [])];
    children.splice(Math.max(0, Math.min(index, children.length)), 0, child);
    return { ...root, children };
  }
  if (!root.children?.length) return root;
  return {
    ...root,
    children: root.children.map((c) => insertChildAt(c, parentId, child, index)),
  };
}

export function moveNodeInTree(
  root: PageNode,
  nodeId: string,
  targetParentId: string,
  targetIndex: number,
): PageNode {
  const loc = findNode(root, nodeId);
  if (!loc || loc.node.type === "page") return root;

  let tree = removeNodeFromTree(cloneTree(root), nodeId);
  const moved = cloneTree(loc.node);
  tree = insertChildAt(tree, targetParentId, moved, targetIndex);
  return tree;
}

export function duplicateNodeInTree(root: PageNode, id: string): PageNode {
  const loc = findNode(root, id);
  if (!loc || !loc.parent) return root;

  const dup = cloneNodeWithNewIds(loc.node);
  return insertChildAt(cloneTree(root), loc.parent.id, dup, loc.index + 1);
}

export function cloneNodeWithNewIds(node: PageNode): PageNode {
  return {
    ...node,
    id: newNodeId(),
    props: { ...node.props },
    children: node.children?.map(cloneNodeWithNewIds),
  };
}

export function reorderSibling(
  root: PageNode,
  nodeId: string,
  direction: -1 | 1,
): PageNode {
  const loc = findNode(root, nodeId);
  if (!loc?.parent?.children) return root;
  const siblings = loc.parent.children;
  const newIndex = loc.index + direction;
  if (newIndex < 0 || newIndex >= siblings.length) return root;
  return moveNodeInTree(root, nodeId, loc.parent.id, newIndex);
}

export function getParentId(root: PageNode, nodeId: string): string | null {
  const loc = findNode(root, nodeId);
  return loc?.parent?.id ?? null;
}

export function collectDescendantIds(node: PageNode): string[] {
  const ids = [node.id];
  for (const child of node.children ?? []) {
    ids.push(...collectDescendantIds(child));
  }
  return ids;
}

export function insertPaletteNode(
  root: PageNode,
  parentId: string,
  type: PageNodeType,
  index: number,
): PageNode {
  const child = createNode(type);
  if (type === "page") return root;
  return insertChildAt(cloneTree(root), parentId, child, index);
}

/** Find first droppable parent (section/container/page) for palette drops. */
export function findDefaultDropParent(root: PageNode): string {
  if (root.type === "page" && root.children?.[0]) {
    const section = root.children[0];
    if (section.type === "section" || section.type === "container") {
      return section.id;
    }
  }
  const section = root.children?.find((c) => c.type === "section" || c.type === "container");
  return section?.id ?? root.id;
}
