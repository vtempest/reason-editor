import type { Document } from "@/components/DocumentTree"

export interface DocumentNode {
  id: string
  name: string
  data: Document
  children?: DocumentNode[]
}

/**
 * Convert a flat array of documents to a hierarchical tree structure
 */
export function buildDocumentTree(documents: Document[]): DocumentNode[] {
  const documentMap = new Map<string, DocumentNode>()
  const rootNodes: DocumentNode[] = []

  // First pass: create DocumentNode for each document
  documents.forEach((doc) => {
    const node: DocumentNode = {
      id: doc.id,
      name: doc.title || "Untitled",
      data: doc,
      children: [],
    }
    documentMap.set(doc.id, node)
  })

  // Second pass: build the tree structure
  documents.forEach((doc) => {
    const node = documentMap.get(doc.id)
    if (!node) return

    if (doc.parentId) {
      const parent = documentMap.get(doc.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        // Parent not found, treat as root
        rootNodes.push(node)
      }
    } else {
      // No parent, it's a root node
      rootNodes.push(node)
    }
  })

  // Remove empty children arrays for leaf nodes
  documentMap.forEach((node) => {
    if (node.children && node.children.length === 0) {
      delete node.children
    }
  })

  return rootNodes
}
