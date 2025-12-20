import { useState, useMemo, useEffect } from 'react';
import { Document } from '@/components/DocumentTree';
import { TiptapEditor } from '@/components/TiptapEditor';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SearchModal } from '@/components/SearchModal';
import { Settings } from '@/components/Settings';
import { TeamManagement } from '@/components/TeamManagement';
import { InviteModal } from '@/components/InviteModal';
import { TagBar } from '@/components/TagBar';
import { TagManagementDialog } from '@/components/TagManagementDialog';
import { DocumentTabs } from '@/components/DocumentTabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagManagementDocId, setTagManagementDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useLocalStorage<'tree' | 'outline' | 'split'>('REASON-view-mode', 'tree');

  const [documents, setDocuments] = useLocalStorage<Document[]>('REASON-documents', [
    {
      id: '1',
      title: 'Welcome to REASON',
      content: '<h1>Welcome to REASON</h1><p>A powerful note-taking app with nested documents.</p><h2>Features</h2><ul><li><p><strong>Rich text editing</strong> with WYSIWYG editor</p></li><li><p><strong>Nested documents</strong> for better organization</p></li><li><p><strong>Full-text search</strong> to find notes quickly</p></li><li><p><strong>Drag and drop</strong> to reorganize notes</p></li><li><p><strong>Right-click menus</strong> for quick actions</p></li><li><p><strong>Document outline</strong> view</p></li><li><p><strong>Local storage</strong> - your notes stay private</p></li><li><p><strong>Mobile-friendly</strong> with responsive drawer navigation</p></li></ul><h2>Getting Started</h2><p>On mobile, tap the menu icon to access your notes.</p><p>Click the "New Note" button to create your first note, or select this note to start editing.</p><p>You can also create child notes by right-clicking a note.</p><h3>Drag and Drop</h3><p>Drag notes to reorder them or move them under different parent notes.</p><h3>Outline View</h3><p>Click the outline icon to see all headings in the current document.</p><p>Press the search icon (or Ctrl+K) to quickly find any note.</p>',
      parentId: null,
      children: [],
      isExpanded: true,
      tags: []
    },
  ]);

  const [activeDocId, setActiveDocId] = useLocalStorage<string | null>(
    'REASON-active-doc',
    documents.length > 0 ? documents[0].id : null
  );

  const [openTabs, setOpenTabs] = useLocalStorage<string[]>(
    'REASON-open-tabs',
    documents.length > 0 ? [documents[0].id] : []
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
      tags: [],
    };

    setDocuments([...documents, newDoc]);
    setActiveDocId(newDoc.id);
    setOpenTabs([...openTabs, newDoc.id]);

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

    // Remove deleted documents from open tabs
    const newOpenTabs = openTabs.filter((tabId) => !idsToDelete.includes(tabId));
    setOpenTabs(newOpenTabs);

    if (activeDocId && idsToDelete.includes(activeDocId)) {
      setActiveDocId(newOpenTabs.length > 0 ? newOpenTabs[0] : remaining.length > 0 ? remaining[0].id : null);
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
    setOpenTabs([...openTabs, newDoc.id]);
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

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddTag = (docId: string, tag: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId
          ? { ...doc, tags: [...(doc.tags || []), tag] }
          : doc
      )
    );
  };

  const handleRemoveTag = (docId: string, tag: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId
          ? { ...doc, tags: (doc.tags || []).filter((t) => t !== tag) }
          : doc
      )
    );
  };

  const handleManageTags = (docId: string) => {
    setTagManagementDocId(docId);
    setIsTagDialogOpen(true);
  };

  const handleUpdateTags = (tags: string[]) => {
    if (tagManagementDocId) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === tagManagementDocId ? { ...doc, tags } : doc
        )
      );
      toast.success('Tags updated');
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveDocId(tabId);
  };

  const handleTabClose = (tabId: string) => {
    const newOpenTabs = openTabs.filter((id) => id !== tabId);
    setOpenTabs(newOpenTabs);

    // If closing active tab, switch to another tab
    if (activeDocId === tabId) {
      const closedIndex = openTabs.indexOf(tabId);
      const newActiveIndex = Math.max(0, closedIndex - 1);
      setActiveDocId(newOpenTabs[newActiveIndex] || null);
    }
  };

  const handleTabAdd = () => {
    handleAddDocument(null);
  };

  const handleSelectDocument = (id: string) => {
    // Open document in tab if not already open
    if (!openTabs.includes(id)) {
      setOpenTabs([...openTabs, id]);
    }
    setActiveDocId(id);
  };

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
          onSettingsClick={() => setIsSettingsOpen(true)}
          onShareClick={() => setIsInviteModalOpen(true)}
          documentTitle={activeDocument?.title}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          documents={filteredDocuments}
          activeId={activeDocId}
          activeDocument={activeDocument}
          onSelect={handleSelectDocument}
          onAdd={handleAddDocument}
          onDelete={handleDeleteDocument}
          onDuplicate={handleDuplicateDocument}
          onToggleExpand={handleToggleExpand}
          onMove={handleMoveDocument}
          onManageTags={handleManageTags}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          onSearchFocus={() => !isMobile && setIsSearchModalOpen(true)}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          isMobile={isMobile}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onInviteClick={() => setIsInviteModalOpen(true)}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {!isMobile && (
            <DocumentTabs
              openTabs={openTabs}
              activeTab={activeDocId}
              documents={documents}
              onTabChange={handleTabChange}
              onTabClose={handleTabClose}
              onTabAdd={handleTabAdd}
            />
          )}

          {activeDocument ? (
            <>
              {activeDocument.tags && activeDocument.tags.length > 0 && (
                <TagBar
                  tags={activeDocument.tags}
                  onAddTag={(tag) => handleAddTag(activeDocument.id, tag)}
                  onRemoveTag={(tag) => handleRemoveTag(activeDocument.id, tag)}
                />
              )}
              <div className="flex-1 overflow-hidden">
                <TiptapEditor
                  content={activeDocument.content}
                  onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                  title={activeDocument.title}
                  onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                />
              </div>
            </>
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
        onSelectDocument={handleSelectDocument}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTeams={() => setIsTeamsOpen(true)}
        onToggleTheme={handleToggleTheme}
        currentTheme={theme}
      />

      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      <TeamManagement open={isTeamsOpen} onOpenChange={setIsTeamsOpen} />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        documentTitle={activeDocument?.title || 'Untitled'}
        sharingInfo={activeDocument?.sharing}
        onUpdateSharing={(sharing) => {
          if (activeDocument) {
            setDocuments(docs =>
              docs.map(doc =>
                doc.id === activeDocument.id
                  ? { ...doc, sharing }
                  : doc
              )
            );
          }
        }}
      />

      <TagManagementDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        currentTags={tagManagementDocId ? (documents.find(d => d.id === tagManagementDocId)?.tags || []) : []}
        onUpdateTags={handleUpdateTags}
      />
    </div>
  );
};

export default Index;
