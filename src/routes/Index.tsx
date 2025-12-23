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
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
  const [defaultSidebarView, setDefaultSidebarView] = useLocalStorage<'tree' | 'outline' | 'split' | 'last-used'>('REASON-default-sidebar-view', 'last-used');
  const [viewMode, setViewMode] = useLocalStorage<'tree' | 'outline' | 'split'>('REASON-view-mode', 'split');

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
    {
      id: '2',
      title: 'Projects',
      content: '',
      parentId: null,
      children: [],
      isExpanded: true,
      isFolder: true,
      tags: []
    },
    {
      id: '3',
      title: 'Website Redesign',
      content: '<h1>Website Redesign</h1><p>Planning for the new website design.</p><h2>Goals</h2><ul><li><p>Modern, clean interface</p></li><li><p>Mobile-first approach</p></li><li><p>Improved accessibility</p></li></ul>',
      parentId: '2',
      children: [],
      isExpanded: false,
      tags: ['design', 'web']
    },
    {
      id: '4',
      title: 'API Integration',
      content: '<h1>API Integration</h1><p>Notes on integrating the new REST API.</p><h2>Endpoints</h2><ul><li><p>GET /api/documents</p></li><li><p>POST /api/documents</p></li><li><p>PUT /api/documents/:id</p></li></ul>',
      parentId: '2',
      children: [],
      isExpanded: false,
      tags: ['development', 'api']
    },
    {
      id: '5',
      title: 'Research',
      content: '',
      parentId: null,
      children: [],
      isExpanded: true,
      isFolder: true,
      tags: []
    },
    {
      id: '6',
      title: 'Market Analysis',
      content: '<h1>Market Analysis</h1><p>Research findings on market trends.</p><h2>Key Insights</h2><ul><li><p>Growing demand for productivity tools</p></li><li><p>Users prefer cloud-based solutions</p></li><li><p>Mobile access is essential</p></li></ul>',
      parentId: '5',
      children: [],
      isExpanded: false,
      tags: ['research', 'business']
    },
    {
      id: '7',
      title: 'Competitor Review',
      content: '<h1>Competitor Review</h1><p>Analysis of competitor products.</p><h2>Top Competitors</h2><ul><li><p>Notion - Versatile but complex</p></li><li><p>Obsidian - Great for developers</p></li><li><p>Roam Research - Powerful linking</p></li></ul>',
      parentId: '5',
      children: [],
      isExpanded: false,
      tags: ['research', 'competition']
    },
    {
      id: '8',
      title: 'Meeting Notes',
      content: '<h1>Meeting Notes</h1><p>Quick notes from today\'s team meeting.</p><h2>Action Items</h2><ul><li><p>Review PRs by EOD</p></li><li><p>Update documentation</p></li><li><p>Schedule next sprint planning</p></li></ul>',
      parentId: null,
      children: [],
      isExpanded: false,
      tags: ['meetings']
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

  // Update document title when active document changes
  useEffect(() => {
    if (activeDocument?.title) {
      document.title = `${activeDocument.title} - Reason Docs`;
    } else {
      document.title = 'Reason - Powerful Note-Taking App';
    }
  }, [activeDocument?.title]);

  const filteredDocuments = useMemo(() => {
    // Filter out archived and deleted documents from the main tree
    const activeDocuments = documents.filter(
      (doc) => !doc.isArchived && !doc.isDeleted
    );

    if (!searchQuery.trim()) return activeDocuments;

    const query = searchQuery.toLowerCase();
    return activeDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return documentTree;
    return buildTree(filteredDocuments);
  }, [filteredDocuments, searchQuery]);

  const handleAddDocument = (parentId: string | null, isFolder: boolean = false) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: isFolder ? 'New Folder' : '',
      content: '',
      parentId,
      children: [],
      isExpanded: isFolder,
      isFolder,
      tags: [],
    };

    setDocuments([...documents, newDoc]);

    // Only set active and open in tab if it's a note (not a folder)
    if (!isFolder) {
      setActiveDocId(newDoc.id);
      setOpenTabs([...openTabs, newDoc.id]);
    }

    // Expand parent if exists
    if (parentId) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === parentId ? { ...doc, isExpanded: true } : doc
        )
      );
    }

    toast.success(isFolder ? 'Folder created' : 'Note created');
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

    setDocuments((docs) => {
      // Create a new array without the dragged document
      const withoutDragged = docs.filter((d) => d.id !== draggedId);

      // Update the dragged document with new parent
      const updatedDragged = { ...draggedDoc, parentId: newParentId };

      // Find the insert position
      let insertIndex: number;

      if (position === 'child') {
        // Insert at the beginning of the target's children
        const targetIndex = withoutDragged.findIndex((d) => d.id === targetId);
        // Find the first child of target, or insert right after target
        const firstChildIndex = withoutDragged.findIndex(
          (d, i) => i > targetIndex && d.parentId === targetId
        );
        insertIndex = firstChildIndex !== -1 ? firstChildIndex : targetIndex + 1;
      } else if (position === 'before') {
        // Insert before the target
        insertIndex = withoutDragged.findIndex((d) => d.id === targetId);
      } else {
        // Insert after the target (and its children)
        const targetIndex = withoutDragged.findIndex((d) => d.id === targetId);
        // Find the last descendant of target
        let lastDescendantIndex = targetIndex;
        const findLastDescendant = (parentId: string, startIndex: number): number => {
          let lastIndex = startIndex;
          for (let i = startIndex + 1; i < withoutDragged.length; i++) {
            if (withoutDragged[i].parentId === parentId) {
              lastIndex = i;
              const childLastIndex = findLastDescendant(withoutDragged[i].id, i);
              if (childLastIndex > lastIndex) {
                lastIndex = childLastIndex;
                i = childLastIndex;
              }
            }
          }
          return lastIndex;
        };
        lastDescendantIndex = findLastDescendant(targetId, targetIndex);
        insertIndex = lastDescendantIndex + 1;
      }

      // Insert the dragged document at the correct position
      const result = [
        ...withoutDragged.slice(0, insertIndex),
        updatedDragged,
        ...withoutDragged.slice(insertIndex)
      ];

      return result;
    });

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

  // Apply default sidebar view on mount
  useEffect(() => {
    if (defaultSidebarView !== 'last-used') {
      setViewMode(defaultSidebarView as 'tree' | 'outline' | 'split');
    }
  }, []); // Only run on mount

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

  const handleArchiveDocument = (id: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, isArchived: true, isDeleted: false } : doc
      )
    );
    toast.success('Note archived');
  };

  const handleRestoreDocument = (id: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, isArchived: false, isDeleted: false } : doc
      )
    );
    toast.success('Note restored');
  };

  const handlePermanentDelete = (id: string) => {
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

    toast.success('Note permanently deleted');
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
    const doc = documents.find((d) => d.id === id);

    // Don't open folders in tabs
    if (doc?.isFolder) {
      // Just expand/collapse the folder
      handleToggleExpand(id);
      return;
    }

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
        {isMobile ? (
          <>
            <Sidebar
              documents={documents}
              activeId={activeDocId}
              activeDocument={activeDocument}
              onSelect={handleSelectDocument}
              onAdd={handleAddDocument}
              onDelete={handleDeleteDocument}
              onDuplicate={handleDuplicateDocument}
              onToggleExpand={handleToggleExpand}
              onMove={handleMoveDocument}
              onManageTags={handleManageTags}
              onRename={(id, title) => handleUpdateDocument(id, { title })}
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
              onArchive={handleArchiveDocument}
              onRestore={handleRestoreDocument}
              onPermanentDelete={handlePermanentDelete}
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
                  onRename={(id, title) => handleUpdateDocument(id, { title })}
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
                      scrollToHeading={() => {}}
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
          </>
        ) : (
          <PanelGroup direction="horizontal" className="flex-1">
            <Panel defaultSize={20} minSize={15} maxSize={40}>
              <Sidebar
                documents={documents}
                activeId={activeDocId}
                activeDocument={activeDocument}
                onSelect={handleSelectDocument}
                onAdd={handleAddDocument}
                onDelete={handleDeleteDocument}
                onDuplicate={handleDuplicateDocument}
                onToggleExpand={handleToggleExpand}
                onMove={handleMoveDocument}
                onManageTags={handleManageTags}
                onRename={(id, title) => handleUpdateDocument(id, { title })}
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
                onArchive={handleArchiveDocument}
                onRestore={handleRestoreDocument}
                onPermanentDelete={handlePermanentDelete}
              />
            </Panel>
            <PanelResizeHandle className="w-px bg-sidebar-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={80} minSize={50}>
              <main className="flex-1 overflow-hidden flex flex-col h-full">
                <DocumentTabs
                  openTabs={openTabs}
                  activeTab={activeDocId}
                  documents={documents}
                  onTabChange={handleTabChange}
                  onTabClose={handleTabClose}
                  onTabAdd={handleTabAdd}
                  onRename={(id, title) => handleUpdateDocument(id, { title })}
                />

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
                        scrollToHeading={() => {}}
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
                        Select a note from the sidebar or create a new one
                      </p>
                    </div>
                  </div>
                )}
              </main>
            </Panel>
          </PanelGroup>
        )}
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

      <Settings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultSidebarView={defaultSidebarView}
        onDefaultSidebarViewChange={setDefaultSidebarView}
      />

      <TeamManagement open={isTeamsOpen} onOpenChange={setIsTeamsOpen} />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        documentTitle={activeDocument?.title || 'Untitled'}
        documentId={activeDocument?.id || ''}
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
