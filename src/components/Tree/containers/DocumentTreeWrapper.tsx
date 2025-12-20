"use client"

import React from "react"
import { DocumentTree } from "./DocumentTree"
import { buildDocumentTree } from "@/lib/document-utils"
import type { Document } from "@/components/DocumentTree"

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

export const DocumentTreeWrapper = ({
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
}: DocumentTreeWrapperProps) => {
  // Build hierarchical tree data from flat documents array
  const treeData = React.useMemo(() => buildDocumentTree(documents), [documents])

  // Adapt onMove callback
  const handleMove = (nodeId: string, parentId: string | null, index: number) => {
    // The old API expects position, the new one provides index
    // For simplicity, we'll use 'child' position
    onMove(nodeId, parentId, "child")
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
      data={treeData}
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
}
