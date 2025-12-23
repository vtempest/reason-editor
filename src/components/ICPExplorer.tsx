'use client'

import React, { useState, useMemo } from 'react'
import { DocumentTree } from '@/components/Tree/containers/DocumentTree'
import type { Document } from '@/lib/db/schema'
import type { DocumentNode } from '@/lib/document-utils'
import { icpMarketingTree, icpMarketingContent } from '@/lib/icp-marketing-tree'
import { Button } from '@/components/ui/button'
import { FolderPlus, FilePlus, ChevronDown, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * ICP Explorer Component
 * Displays the ICP Marketing content in a file tree structure with full exploration capabilities
 */
export function ICPExplorer() {
  const [documents, setDocuments] = useState<Document[]>(() => {
    return convertTreeToDocuments(icpMarketingTree, icpMarketingContent)
  })
  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  const [allExpanded, setAllExpanded] = useState(false)

  const activeDocument = documents.find((doc) => doc.id === activeDocId)

  const documentTree = useMemo(() => buildTree(documents), [documents])

  const handleSelect = (document: Document) => {
    setActiveDocId(document.id)
  }

  const handleDelete = (id: string) => {
    const collectDescendants = (docId: string): string[] => {
      const children = documents.filter((d) => d.parentId === docId)
      return [docId, ...children.flatMap((child) => collectDescendants(child.id))]
    }

    const idsToDelete = collectDescendants(id)
    setDocuments(documents.filter((doc) => !idsToDelete.includes(doc.id)))

    if (activeDocId && idsToDelete.includes(activeDocId)) {
      setActiveDocId(null)
    }
  }

  const handleRename = (id: string, newName: string) => {
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, name: newName } : doc))
    )
  }

  const handleDuplicate = (id: string) => {
    const doc = documents.find((d) => d.id === id)
    if (!doc) return

    const newDoc: Document = {
      ...doc,
      id: `${Date.now()}`,
      name: `${doc.name} (Copy)`,
    }

    setDocuments([...documents, newDoc])
  }

  const handleNewFile = (parentId: string | null) => {
    const newDoc: Document = {
      id: `${Date.now()}`,
      name: 'new-file.md',
      title: 'New File',
      content: '# New File\n\nStart writing...',
      parentId: parentId ? parseInt(parentId) : null,
      isExpanded: 0,
      isFolder: 0,
      type: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: null,
      metadata: null,
      sharing: null,
      summary: null,
      cite: null,
      author: null,
      html: null,
      url: null,
    }

    setDocuments([...documents, newDoc])
  }

  const handleNewFolder = (parentId: string | null) => {
    const newDoc: Document = {
      id: `${Date.now()}`,
      name: 'new-folder',
      title: 'New Folder',
      content: '',
      parentId: parentId ? parseInt(parentId) : null,
      isExpanded: 1,
      isFolder: 1,
      type: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: null,
      metadata: null,
      sharing: null,
      summary: null,
      cite: null,
      author: null,
      html: null,
      url: null,
    }

    setDocuments([...documents, newDoc])
  }

  const handleMove = (
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'child'
  ) => {
    const draggedDoc = documents.find((d) => d.id === draggedId)
    if (!draggedDoc) return

    let newParentId: number | null

    if (position === 'child') {
      newParentId = targetId ? parseInt(targetId) : null
    } else {
      const targetDoc = documents.find((d) => d.id === targetId)
      newParentId = targetDoc?.parentId || null
    }

    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === draggedId ? { ...doc, parentId: newParentId } : doc
      )
    )
  }

  const handleExpandAll = () => {
    const newExpandedState = !allExpanded
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.isFolder === 1 ? { ...doc, isExpanded: newExpandedState ? 1 : 0 } : doc
      )
    )
    setAllExpanded(newExpandedState)
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - File Tree */}
      <div className="w-80 border-r bg-sidebar flex flex-col">
        {/* Toolbar */}
        <div className="p-3 border-b bg-sidebar-accent/50 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNewFile(null)}
            title="Add File"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNewFolder(null)}
            title="Add Folder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            title={allExpanded ? 'Collapse All' : 'Expand All'}
          >
            {allExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-auto">
          <DocumentTree
            data={documentTree}
            activeId={activeDocId}
            onSelect={handleSelect}
            onMove={handleMove}
            onDelete={handleDelete}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            height={800}
          />
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-auto bg-background">
        {activeDocument ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeDocument.content || ''}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FilePlus className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Select a file to view its content</p>
              <p className="text-sm mt-2">
                or right-click to add new files and folders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Convert mockFs-style tree structure to Document array
 */
function convertTreeToDocuments(
  tree: Record<string, { name: string; type: 'file' | 'dir' }[]>,
  content: Record<string, string>
): Document[] {
  const documents: Document[] = []
  const pathToId = new Map<string, string>()
  let idCounter = 1

  // First pass: create all documents
  Object.entries(tree).forEach(([dirPath, items]) => {
    items.forEach((item) => {
      const fullPath = item.name
      const id = `${idCounter++}`
      pathToId.set(fullPath, id)

      const name = fullPath.split('/').pop() || fullPath
      const isFolder = item.type === 'dir'

      documents.push({
        id,
        name,
        title: name,
        content: content[fullPath] || '',
        parentId: null, // Will be set in second pass
        isExpanded: isFolder ? 1 : 0,
        isFolder: isFolder ? 1 : 0,
        type: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null,
        metadata: JSON.stringify({ path: fullPath }),
        sharing: null,
        summary: null,
        cite: null,
        author: null,
        html: null,
        url: null,
      })
    })
  })

  // Second pass: set parent relationships
  documents.forEach((doc) => {
    const metadata = JSON.parse(doc.metadata || '{}')
    const path = metadata.path as string
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/'

    if (parentPath !== '/' && path !== '/README.md') {
      // Find parent
      const parent = documents.find((d) => {
        const pMeta = JSON.parse(d.metadata || '{}')
        return pMeta.path === parentPath
      })

      if (parent) {
        doc.parentId = parseInt(parent.id)
      }
    }
  })

  return documents
}

/**
 * Build hierarchical tree from flat document array
 */
function buildTree(documents: Document[]): DocumentNode[] {
  const map = new Map<string, DocumentNode>()
  const roots: DocumentNode[] = []

  // Create nodes
  documents.forEach((doc) => {
    map.set(doc.id, {
      id: doc.id,
      name: doc.name || 'Untitled',
      data: doc,
      children: [],
    })
  })

  // Build hierarchy
  documents.forEach((doc) => {
    const node = map.get(doc.id)!
    if (doc.parentId && map.has(doc.parentId.toString())) {
      const parent = map.get(doc.parentId.toString())!
      parent.children!.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
