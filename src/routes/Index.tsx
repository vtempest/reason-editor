import { useState, useMemo, useEffect, useRef } from 'react';
import { Document } from '@/components/editor/documents/DocumentTree';
import { TiptapEditor } from '@/components/editor/editors/TiptapEditor';
import { Sidebar } from '@/components/editor/layout/Sidebar';
import { Header } from '@/components/editor/layout/Header';
import { SearchModal } from '@/components/editor/search/SearchModal';
import { Settings } from '@/components/editor/features/Settings';
import { TeamManagement } from '@/components/editor/features/TeamManagement';
import { InviteModal } from '@/components/editor/modals/InviteModal';
import { TagManagementDialog } from '@/components/editor/features/TagManagementDialog';
import { DocumentTabs } from '@/components/editor/documents/DocumentTabs';
import { OutlineView, type OutlineViewHandle } from '@/components/editor/search/OutlineView';
import { AIRewriteSuggestion } from '@/components/editor/features/AIRewriteSuggestion';
import { TagBar } from '@/components/editor/features/TagBar';
import { rewriteText, markdownToHtml } from '@/lib/ai/rewrite';
import { getActiveFileSourceId, setActiveFileSourceId, getActiveFileSource } from '@/lib/fileSources';
import { loadDocumentsFromSource } from '@/lib/storageLoader';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { FileText, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [showRightOutline, setShowRightOutline] = useLocalStorage<boolean>('REASON-show-right-outline', false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    originalText: string;
    suggestedText: string;
    range: { from: number; to: number };
    mode?: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const editorRef = useRef<any>(null);

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

  const [closedTabsHistory, setClosedTabsHistory] = useState<string[]>([]);
  const [splitViewDocId, setSplitViewDocId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [newDocumentId, setNewDocumentId] = useState<string | null>(null);

  // File source state
  const [activeFileSourceId, setActiveFileSourceIdState] = useState<string>(getActiveFileSourceId());

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

  const handleAddDocument = (selectedId: string | null, isFolder: boolean = false) => {
    // Determine the parent based on the selected document
    let parentId: string | null = null;

    if (selectedId) {
      const selectedDoc = documents.find(doc => doc.id === selectedId);
      if (selectedDoc) {
        if (selectedDoc.isFolder) {
          // If selected is a folder, create as child of that folder
          parentId = selectedId;
        } else {
          // If selected is a file, create as sibling (same parent as selected file)
          parentId = selectedDoc.parentId;
        }
      }
    }

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
      // Trigger rename mode for the new document
      setNewDocumentId(newDoc.id);
      // Clear the newDocumentId after a delay to allow for the next document
      setTimeout(() => setNewDocumentId(null), 500);
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

  const handleFileSourceChange = async (sourceId: string) => {
    setActiveFileSourceIdState(sourceId);
    setActiveFileSourceId(sourceId);

    // Load documents from the selected source
    const source = getActiveFileSource();
    try {
      const loadedDocuments = await loadDocumentsFromSource(source, documents);

      if (source.type !== 'local') {
        // For non-local sources, replace documents with loaded ones
        if (loadedDocuments.length > 0) {
          setDocuments(loadedDocuments);
          toast.success(`Loaded ${loadedDocuments.length} documents from ${source.name}`);
        } else {
          toast.info(`No documents found in ${source.name}`);
        }
      } else {
        toast.success('Switched to local storage');
      }
    } catch (error) {
      console.error('Error loading documents from source:', error);
      toast.error('Failed to load documents from source');
    }
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
    // Add to closed tabs history
    setClosedTabsHistory([tabId, ...closedTabsHistory.slice(0, 9)]); // Keep last 10 closed tabs

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

  const handleTabDelete = (tabId: string) => {
    // Close tab and delete document
    handleTabClose(tabId);
    handleDeleteDocument(tabId);
  };

  const handleReopenLastClosed = () => {
    if (closedTabsHistory.length === 0) return;

    const [lastClosedId, ...restHistory] = closedTabsHistory;
    const docExists = documents.find((d) => d.id === lastClosedId);

    if (docExists) {
      // Reopen the last closed tab
      if (!openTabs.includes(lastClosedId)) {
        setOpenTabs([...openTabs, lastClosedId]);
      }
      setActiveDocId(lastClosedId);
      setClosedTabsHistory(restHistory);
      toast.success('Tab reopened');
    } else {
      // Document was deleted, try next in history
      setClosedTabsHistory(restHistory);
      if (restHistory.length > 0) {
        handleReopenLastClosed();
      }
    }
  };

  const handleSplitRight = (tabId: string) => {
    setSplitViewDocId(tabId);
    toast.success('Split view enabled');
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

  // AI Rewrite handlers
  const handleAIRewrite = async (customPrompt?: string, modeId?: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const { from, to } = editor.state.selection;
    let textToRewrite = '';
    let selectionRange = { from, to };

    // If there's selected text, use it
    if (from !== to) {
      textToRewrite = editor.state.doc.textBetween(from, to, ' ');
    } else {
      // Otherwise, get the current paragraph
      const { $from } = editor.state.selection;
      const currentNode = $from.node($from.depth);

      if (currentNode.type.name === 'paragraph' || currentNode.type.name.includes('heading')) {
        const start = $from.before($from.depth);
        const end = $from.after($from.depth);
        textToRewrite = currentNode.textContent;
        selectionRange = { from: start + 1, to: end - 1 };
      } else {
        toast.error('Please select text or place cursor in a paragraph to rewrite');
        return;
      }
    }

    if (!textToRewrite.trim()) {
      toast.error('No text to rewrite');
      return;
    }

    setIsAiLoading(true);
    setAiSuggestion(null);
    setShowAiPanel(true);
    setShowRightOutline(true); // Ensure right panel is visible

    try {
      const fullPrompt = customPrompt ? `${customPrompt}\n\n"${textToRewrite}"` : undefined;
      const suggestion = await rewriteText(textToRewrite, fullPrompt);
      setAiSuggestion({
        originalText: textToRewrite,
        suggestedText: suggestion,
        range: selectionRange,
        mode: modeId,
      });
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate AI suggestion');
      setShowAiPanel(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAIApprove = () => {
    if (!editorRef.current || !aiSuggestion) return;

    const editor = editorRef.current;

    // Convert markdown to HTML before inserting
    const htmlContent = markdownToHtml(aiSuggestion.suggestedText);

    editor
      .chain()
      .focus()
      .deleteRange(aiSuggestion.range)
      .insertContentAt(aiSuggestion.range.from, htmlContent)
      .run();

    setAiSuggestion(null);
    setShowAiPanel(false);
    toast.success('AI suggestion applied');
  };

  const handleAIReject = () => {
    setAiSuggestion(null);
    setShowAiPanel(false);
    toast.info('AI suggestion rejected');
  };

  const handleAIRegenerate = async (mode: any) => {
    if (!aiSuggestion) return;
    await handleAIRewrite(mode.prompt, mode.id);
  };

  useEffect(() => {
    // Ensure active document exists
    if (activeDocId && !documents.find((d) => d.id === activeDocId)) {
      setActiveDocId(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, activeDocId, setActiveDocId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
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
              newDocumentId={newDocumentId}
              showRightOutline={showRightOutline}
              onToggleRightOutline={() => setShowRightOutline(!showRightOutline)}
              activeFileSourceId={activeFileSourceId}
              onFileSourceChange={handleFileSourceChange}
            />
            <main className="flex-1 overflow-hidden flex flex-col">
              <DocumentTabs
                openTabs={openTabs}
                activeTab={activeDocId}
                documents={documents}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
                onTabAdd={handleTabAdd}
                onRename={(id, title) => handleUpdateDocument(id, { title })}
                onMenuClick={() => setIsSidebarOpen(true)}
                onDelete={handleTabDelete}
                onReopenLastClosed={handleReopenLastClosed}
                onSplitRight={handleSplitRight}
                canReopenLastClosed={closedTabsHistory.length > 0}
              />

              {activeDocument ? (
                <>
                  {splitViewDocId && splitViewDocId !== activeDocId ? (
                    <PanelGroup direction="horizontal" className="flex-1">
                      <Panel defaultSize={50} minSize={30}>
                        <div className="flex flex-col h-full border-r border-border">
                          <div className="flex-1 overflow-hidden">
                            <TiptapEditor
                              content={activeDocument.content}
                              onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                              title={activeDocument.title}
                              onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                              scrollToHeading={() => { }}
                            />
                          </div>
                        </div>
                      </Panel>
                      <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
                      <Panel defaultSize={50} minSize={30}>
                        {(() => {
                          const splitDoc = documents.find(d => d.id === splitViewDocId);
                          return splitDoc ? (
                            <div className="flex flex-col h-full relative">
                              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                                <span className="text-sm font-medium">{splitDoc.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setSplitViewDocId(null)}
                                  title="Close split view"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <TiptapEditor
                                  content={splitDoc.content}
                                  onChange={(content) => handleUpdateDocument(splitDoc.id, { content })}
                                  title={splitDoc.title}
                                  onTitleChange={(title) => handleUpdateDocument(splitDoc.id, { title })}
                                  scrollToHeading={() => { }}
                                />
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </Panel>
                    </PanelGroup>
                  ) : (
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
                          scrollToHeading={() => { }}
                        />
                      </div>
                    </>
                  )}
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
                newDocumentId={newDocumentId}
                showRightOutline={showRightOutline}
                onToggleRightOutline={() => setShowRightOutline(!showRightOutline)}
                activeFileSourceId={activeFileSourceId}
                onFileSourceChange={handleFileSourceChange}
              />
            </Panel>
            <PanelResizeHandle className="w-px bg-sidebar-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={80} minSize={50}>
              {showRightOutline ? (
                <PanelGroup direction="horizontal" className="flex-1">
                  <Panel defaultSize={75} minSize={50}>
                    <main className="flex-1 overflow-hidden flex flex-col h-full">
                      <DocumentTabs
                        openTabs={openTabs}
                        activeTab={activeDocId}
                        documents={documents}
                        onTabChange={handleTabChange}
                        onTabClose={handleTabClose}
                        onTabAdd={handleTabAdd}
                        onRename={(id, title) => handleUpdateDocument(id, { title })}
                        onDelete={handleTabDelete}
                        onReopenLastClosed={handleReopenLastClosed}
                        onSplitRight={handleSplitRight}
                        canReopenLastClosed={closedTabsHistory.length > 0}
                      />

                      {activeDocument ? (
                        <>
                          {splitViewDocId && splitViewDocId !== activeDocId ? (
                            <PanelGroup direction="horizontal" className="flex-1">
                              <Panel defaultSize={50} minSize={30}>
                                <div className="flex flex-col h-full border-r border-border">
                                  {activeDocument.tags && activeDocument.tags.length > 0 && (
                                    <TagBar
                                      tags={activeDocument.tags}
                                      onAddTag={(tag) => handleAddTag(activeDocument.id, tag)}
                                      onRemoveTag={(tag) => handleRemoveTag(activeDocument.id, tag)}
                                    />
                                  )}
                                  <div className="flex-1 overflow-hidden">
                                    <TiptapEditor
                                      ref={editorRef}
                                      content={activeDocument.content}
                                      onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                                      title={activeDocument.title}
                                      onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                                      scrollToHeading={() => { }}
                                      aiSuggestion={aiSuggestion}
                                      isAiLoading={isAiLoading}
                                      onAiRewrite={handleAIRewrite}
                                      onAiApprove={handleAIApprove}
                                      onAiReject={handleAIReject}
                                      onAiRegenerate={handleAIRegenerate}
                                    />
                                  </div>
                                </div>
                              </Panel>
                              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
                              <Panel defaultSize={50} minSize={30}>
                                {(() => {
                                  const splitDoc = documents.find(d => d.id === splitViewDocId);
                                  return splitDoc ? (
                                    <div className="flex flex-col h-full relative">
                                      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                                        <span className="text-sm font-medium">{splitDoc.title}</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setSplitViewDocId(null)}
                                          title="Close split view"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      {splitDoc.tags && splitDoc.tags.length > 0 && (
                                        <TagBar
                                          tags={splitDoc.tags}
                                          onAddTag={(tag) => handleAddTag(splitDoc.id, tag)}
                                          onRemoveTag={(tag) => handleRemoveTag(splitDoc.id, tag)}
                                        />
                                      )}
                                      <div className="flex-1 overflow-hidden">
                                        <TiptapEditor
                                          content={splitDoc.content}
                                          onChange={(content) => handleUpdateDocument(splitDoc.id, { content })}
                                          title={splitDoc.title}
                                          onTitleChange={(title) => handleUpdateDocument(splitDoc.id, { title })}
                                          scrollToHeading={() => { }}
                                        />
                                      </div>
                                    </div>
                                  ) : null;
                                })()}
                              </Panel>
                            </PanelGroup>
                          ) : (
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
                                  ref={editorRef}
                                  content={activeDocument.content}
                                  onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                                  title={activeDocument.title}
                                  onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                                  scrollToHeading={() => { }}
                                  aiSuggestion={aiSuggestion}
                                  isAiLoading={isAiLoading}
                                  onAiRewrite={handleAIRewrite}
                                  onAiApprove={handleAIApprove}
                                  onAiReject={handleAIReject}
                                  onAiRegenerate={handleAIRegenerate}
                                />
                              </div>
                            </>
                          )}
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
                  <PanelResizeHandle className="w-px bg-sidebar-border hover:bg-primary/50 transition-colors" />
                  <Panel defaultSize={25} minSize={15} maxSize={40}>
                    <div className="h-full border-l border-sidebar-border bg-sidebar-background">
                      {showAiPanel ? (
                        <div className="h-full overflow-hidden flex flex-col">
                          <div className="px-3 py-2 border-b border-sidebar-border flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-sidebar-foreground">AI Suggestions</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => setShowAiPanel(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            {isAiLoading ? (
                              <div className="h-full flex items-center justify-center p-6">
                                <div className="text-center">
                                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-3" />
                                  <p className="text-sm text-muted-foreground">Generating AI suggestion...</p>
                                </div>
                              </div>
                            ) : aiSuggestion ? (
                              <AIRewriteSuggestion
                                originalText={aiSuggestion.originalText}
                                suggestedText={aiSuggestion.suggestedText}
                                onApprove={handleAIApprove}
                                onReject={handleAIReject}
                                onRegenerate={handleAIRegenerate}
                                currentMode={aiSuggestion.mode}
                                isLoading={false}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center p-6 text-center">
                                <p className="text-sm text-muted-foreground">Select text and click the AI button to get suggestions</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full overflow-hidden flex flex-col">
                          <div className="px-3 py-2 border-b border-sidebar-border">
                            <h3 className="text-sm font-semibold text-sidebar-foreground">Outline</h3>
                          </div>
                          <div className="flex-1 overflow-auto">
                            <OutlineView
                              content={activeDocument?.content || ''}
                              searchQuery={searchQuery}
                              onNavigate={(headingText) => {
                                // Call the global scroll function set by TiptapEditor
                                if ((window as any).__scrollToHeading) {
                                  (window as any).__scrollToHeading(headingText);
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </PanelGroup>
              ) : (
                <main className="flex-1 overflow-hidden flex flex-col h-full">
                  <DocumentTabs
                    openTabs={openTabs}
                    activeTab={activeDocId}
                    documents={documents}
                    onTabChange={handleTabChange}
                    onTabClose={handleTabClose}
                    onTabAdd={handleTabAdd}
                    onRename={(id, title) => handleUpdateDocument(id, { title })}
                    onDelete={handleTabDelete}
                    onReopenLastClosed={handleReopenLastClosed}
                    onSplitRight={handleSplitRight}
                    canReopenLastClosed={closedTabsHistory.length > 0}
                  />

                  {activeDocument ? (
                    <>
                      {splitViewDocId && splitViewDocId !== activeDocId ? (
                        <PanelGroup direction="horizontal" className="flex-1">
                          <Panel defaultSize={50} minSize={30}>
                            <div className="flex flex-col h-full border-r border-border">
                              {activeDocument.tags && activeDocument.tags.length > 0 && (
                                <TagBar
                                  tags={activeDocument.tags}
                                  onAddTag={(tag) => handleAddTag(activeDocument.id, tag)}
                                  onRemoveTag={(tag) => handleRemoveTag(activeDocument.id, tag)}
                                />
                              )}
                              <div className="flex-1 overflow-hidden">
                                <TiptapEditor
                                  ref={editorRef}
                                  content={activeDocument.content}
                                  onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                                  title={activeDocument.title}
                                  onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                                  scrollToHeading={() => { }}
                                  aiSuggestion={aiSuggestion}
                                  isAiLoading={isAiLoading}
                                  onAiRewrite={handleAIRewrite}
                                  onAiApprove={handleAIApprove}
                                  onAiReject={handleAIReject}
                                  onAiRegenerate={handleAIRegenerate}
                                />
                              </div>
                            </div>
                          </Panel>
                          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
                          <Panel defaultSize={50} minSize={30}>
                            {(() => {
                              const splitDoc = documents.find(d => d.id === splitViewDocId);
                              return splitDoc ? (
                                <div className="flex flex-col h-full relative">
                                  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                                    <span className="text-sm font-medium">{splitDoc.title}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => setSplitViewDocId(null)}
                                      title="Close split view"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {splitDoc.tags && splitDoc.tags.length > 0 && (
                                    <TagBar
                                      tags={splitDoc.tags}
                                      onAddTag={(tag) => handleAddTag(splitDoc.id, tag)}
                                      onRemoveTag={(tag) => handleRemoveTag(splitDoc.id, tag)}
                                    />
                                  )}
                                  <div className="flex-1 overflow-hidden">
                                    <TiptapEditor
                                      content={splitDoc.content}
                                      onChange={(content) => handleUpdateDocument(splitDoc.id, { content })}
                                      title={splitDoc.title}
                                      onTitleChange={(title) => handleUpdateDocument(splitDoc.id, { title })}
                                      scrollToHeading={() => { }}
                                    />
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </Panel>
                        </PanelGroup>
                      ) : (
                        <>
                          <div className="flex-1 overflow-hidden">
                            <TiptapEditor
                              ref={editorRef}
                              content={activeDocument.content}
                              onChange={(content) => handleUpdateDocument(activeDocument.id, { content })}
                              title={activeDocument.title}
                              onTitleChange={(title) => handleUpdateDocument(activeDocument.id, { title })}
                              scrollToHeading={() => { }}
                              aiSuggestion={aiSuggestion}
                              isAiLoading={isAiLoading}
                              onAiRewrite={handleAIRewrite}
                              onAiApprove={handleAIApprove}
                              onAiReject={handleAIReject}
                              onAiRegenerate={handleAIRegenerate}
                            />
                          </div>
                        </>
                      )}
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
              )}
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
