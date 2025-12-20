import { Node } from "../types";

export function flattenTree<T>(root: Node<T>): Node<T>[] {
  const result: Node<T>[] = [];

  function traverse(node: Node<T>) {
    // Only add to result if it has a rowIndex (not hidden root)
    if (node.rowIndex !== null) {
      result.push(node);
    }

    // Traverse children if node is open and has children
    if (node.isOpen && node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return result;
}
