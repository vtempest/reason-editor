import { useState, useMemo, useEffect } from 'react';
import { Document } from '@/components/DocumentTree';
import { TiptapEditor } from '@/components/TiptapEditor';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SearchModal } from '@/components/SearchModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage<'tree' | 'outline'>('yana-view-mode', 'tree');

  const [documents, setDocuments] = useLocalStorage<Document[]>('yana-documents', [
    {
      id: '1',
      title: 'Welcome to Yana',
      content: '<h1>Welcome to Yana</h1><p>A powerful note-taking app with nested documents.</p><h2>Features</h2><ul><li><p><strong>Rich text editing</strong> with WYSIWYG editor</p></li><li><p><strong>Nested documents</strong> for better organization</p></li><li><p><strong>Full-text search</strong> to find notes quickly</p></li><li><p><strong>Drag and drop</strong> to reorganize notes</p></li><li><p><strong>Right-click menus</strong> for quick actions</p></li><li><p><strong>Document outline</strong> view</p></li><li><p><strong>Local storage</strong> - your notes stay private</p></li><li><p><strong>Mobile-friendly</strong> with responsive drawer navigation</p></li></ul><h2>Getting Started</h2><p>On mobile, tap the menu icon to access your notes.</p><p>Click the "New Note" button to create your first note, or select this note to start editing.</p><p>You can also create child notes by right-clicking a note.</p><h3>Drag and Drop</h3><p>Drag notes to reorder them or move them under different parent notes.</p><h3>Outline View</h3><p>Click the outline icon to see all headings in the current document.</p><p>Press the search icon (or Ctrl+K) to quickly find any note.</p>',
      parentId: null,
      children: [],
      isExpanded: true,
    },
  ]);

  const [activeDocId, setActiveDocId] = useLocalStorage<string | null>(
    'yana-active-doc',
    documents.length > 0 ? documents[0].id : null
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Build document tree structure
  const buildTree = (docs: Document[]): Document[] => {
    const map = new Map<string, Document>();
    const roots: Document[] = [];

    docs.forEach((doc) => {
      map.set(doc.id, { ...doc, children: [] });
    });

    docs.forEach((doc) => {
      const node = map.get(doc.id)!;
      if (doc.parentId && map.has(doc.parentId)) {
        map.get(doc.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const documentTree = useMemo(() => buildTree(documents), [documents]);

  const activeDocument = documents.find((doc) => doc.id === activeDocId);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return documentTree;
    return buildTree(filteredDocuments);
  }, [filteredDocuments, searchQuery]);

  const handleAddDocument = (parentId: string | null) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: '',
      content: '',
      parentId,
      children: [],
      isExpanded: false,
    };

    setDocuments([...documents, newDoc]);
    setActiveDocId(newDoc.id);

    // Expand parent if exists
    if (parentId) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === parentId ? { ...doc, isExpanded: true } : doc
        )
      );
    }

    toast.success('Note created');
  };

  const handleDeleteDocument = (id: string) => {
    // Recursively collect all descendant IDs
    const collectDescendants = (docId: string): string[] => {
      const children = documents.filter((d) => d.parentId === docId);
      return [
        docId,
        ...children.flatMap((child) => collectDescendants(child.id)),
      ];
    };

    const idsToDelete = collectDescendants(id);
    const remaining = documents.filter((doc) => !idsToDelete.includes(doc.id));
    
    setDocuments(remaining);
    
    if (activeDocId && idsToDelete.includes(activeDocId)) {
      setActiveDocId(remaining.length > 0 ? remaining[0].id : null);
    }

    toast.success('Note deleted');
  };

  const handleDuplicateDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      title: doc.title + ' (Copy)',
      children: [],
    };

    setDocuments([...documents, newDoc]);
    setActiveDocId(newDoc.id);
    toast.success('Note duplicated');
  };

  const handleUpdateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const handleToggleExpand = (id: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, isExpanded: !doc.isExpanded } : doc
      )
    );
  };

  const handleMoveDocument = (
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'child'
  ) => {
    const draggedDoc = documents.find((d) => d.id === draggedId);
    const targetDoc = documents.find((d) => d.id === targetId);

    if (!draggedDoc || draggedId === targetId) return;

    // Prevent moving a parent into its own child
    const isDescendant = (parentId: string, childId: string): boolean => {
      const children = documents.filter((d) => d.parentId === parentId);
      return children.some(
        (child) => child.id === childId || isDescendant(child.id, childId)
      );
    };

    if (targetId && isDescendant(draggedId, targetId)) {
      toast.error('Cannot move a note into its own child');
      return;
    }

    let newParentId: string | null;
    
    if (position === 'child') {
      newParentId = targetId;
    } else {
      newParentId = targetDoc?.parentId || null;
    }

    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === draggedId ? { ...doc, parentId: newParentId } : doc
      )
    );

    toast.success('Note moved');
  };

  // Keyboard shortcut for search modal (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Ensure active document exists
    if (activeDocId && !documents.find((d) => d.id === activeDocId)) {
      setActiveDocId(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, activeDocId, setActiveDocId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {isMobile && (
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearchClick={() => setIsSearchModalOpen(true)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          documents={filteredTree}
          activeId={activeDocId}
          activeDocument={activeDocument}
          onSelect={setActiveDocId}
          onAdd={handleAddDocument}
          onDelete={handleDeleteDocument}
          onDuplicate={handleDuplicateDocument}
          onToggleExpand={handleToggleExpand}
          onMove={handleMoveDocument}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          onSearchFocus={() => !isMobile && setIsSearchModalOpen(true)}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          isMobile={isMobile}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="flex-1 overflow-hidden">
          {activeDocument ? (
            <TiptapEditor
              content={activeDocument.content}
              onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
              title={activeDocument.title}
              onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-editor-bg">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                  No Note Selected
                </h2>
                <p className="text-muted-foreground">
                  {isMobile ? 'Tap the menu to select a note' : 'Select a note from the sidebar or create a new one'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        documents={documents}
        onSelectDocument={setActiveDocId}
      />
    </div>
  );
};

export default Index;
