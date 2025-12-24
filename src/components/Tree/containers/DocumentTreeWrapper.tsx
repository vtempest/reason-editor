"use client"

import React, { forwardRef } from "react"
import { DocumentTree, type DocumentTreeHandle } from "./DocumentTree"
import { buildDocumentTree } from "@/lib/document-utils"
import type { Document } from "@/components/DocumentTree"

export type { DocumentTreeHandle }

interface DocumentTreeWrapperProps {
  documents: Document[]
  activeId: string | null
  onSelect: (id: string) => void
  onAdd: (parentId: string | null, isFolder?: boolean) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleExpand: (id: string) => void
  onMove: (draggedId: string, targetId: string | null, position: "before" | "after" | "child") => void
  onManageTags?: (id: string) => void
  onRename?: (id: string, newTitle: string) => void
  width?: number
  height?: number
}

export const DocumentTreeWrapper = forwardRef<DocumentTreeHandle, DocumentTreeWrapperProps>(({
  documents,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onToggleExpand,
  onMove,
  onManageTags,
  onRename,
  width = 300,
  height = 500,
}, ref) => {
  // Build hierarchical tree data from flat documents array
  const treeData = React.useMemo(() => buildDocumentTree(documents), [documents])

  // Adapt onMove callback
  const handleMove = (nodeId: string, parentId: string | null, position: "before" | "after" | "child") => {
    onMove(nodeId, parentId, position)
  }

  // Adapt onSelect callback
  const handleSelect = (document: Document) => {
    onSelect(document.id)
  }

  // Adapt onDelete callback
  const handleDelete = (nodeId: string) => {
    onDelete(nodeId)
  }

  // Adapt onRename callback
  const handleRename = (nodeId: string, newName: string) => {
    onRename?.(nodeId, newName)
  }

  // Adapt onDuplicate callback
  const handleDuplicate = (nodeId: string) => {
    onDuplicate(nodeId)
  }

  // Adapt onNewFile callback
  const handleNewFile = (parentId: string | null) => {
    onAdd(parentId, false)
  }

  // Adapt onNewFolder callback
  const handleNewFolder = (parentId: string | null) => {
    onAdd(parentId, true)
  }

  return (
    <DocumentTree
      ref={ref}
      data={treeData}
      activeId={activeId}
      onSelect={handleSelect}
      onMove={handleMove}
      onDelete={handleDelete}
      onRename={handleRename}
      onDuplicate={handleDuplicate}
      onNewFile={handleNewFile}
      onNewFolder={handleNewFolder}
      height={height}
    />
  )
})
