import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { FontSize } from '@/lib/tiptap/fontSize';
import { SearchAndReplace } from '@/lib/tiptap/searchAndReplace';
import { Mermaid } from '@/lib/tiptap/mermaid.tsx';
import { PageDocument } from '@/lib/tiptap/pages/PageDocument';
import { Page } from '@/lib/tiptap/pages/Page';
import { PageFormatName } from '@/lib/tiptap/pages/pageFormat';
import '@/lib/tiptap/pages/pages.css';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SearchReplaceBar } from '../search/SearchReplaceBar';
import { FontFamilyDropdown } from '../toolbars/FontFamilyDropdown';
import { FontSizeDropdown } from '../toolbars/FontSizeDropdown';
import { AlignmentDropdown } from '../toolbars/AlignmentDropdown';
import { HeadingsDropdown } from '../toolbars/HeadingsDropdown';
import { StylesDropdown } from '../toolbars/StylesDropdown';
import { splitSentences } from '@/lib/sentence-splitter';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Link2,
  Highlighter,
  Undo,
  Redo,
  Bot,
  Table,
  ImageIcon,
  Trash,
  Plus,
  Merge,
  Youtube as YoutubeIcon,
  CodeSquare,
  Network,
  FilePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { rewriteText, markdownToHtml } from '@/lib/ai/rewrite';
import { AIRewriteSuggestion } from '../features/AIRewriteSuggestion';
import { ExportDropdown } from '../toolbars/ExportDropdown';
import { toast } from 'sonner';

interface PagesEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  scrollToHeading?: (headingText: string) => void;
  readOnly?: boolean;
  pageFormat?: PageFormatName;
  onPageFormatChange?: (format: PageFormatName) => void;
  aiSuggestion?: {
    originalText: string;
    suggestedText: string;
    range: { from: number; to: number };
    mode?: string;
  } | null;
  isAiLoading?: boolean;
  onAiRewrite?: (customPrompt?: string, modeId?: string) => void;
  onAiApprove?: () => void;
  onAiReject?: () => void;
  onAiRegenerate?: (mode: any) => void;
}

export const PagesEditor = forwardRef<any, PagesEditorProps>(({
  content,
  onChange,
  title,
  onTitleChange,
  scrollToHeading,
  readOnly = false,
  pageFormat = 'A4',
  onPageFormatChange,
  aiSuggestion: externalAiSuggestion,
  isAiLoading: externalIsAiLoading = false,
  onAiRewrite: externalOnAiRewrite,
  onAiApprove: externalOnAiApprove,
  onAiReject: externalOnAiReject,
  onAiRegenerate: externalOnAiRegenerate,
}, ref) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalAiSuggestion, setInternalAiSuggestion] = useState<{
    originalText: string;
    suggestedText: string;
    range: { from: number; to: number };
    mode?: string;
  } | null>(null);
  const [internalIsAiLoading, setInternalIsAiLoading] = useState(false);
  const aiSuggestion = externalAiSuggestion !== undefined ? externalAiSuggestion : internalAiSuggestion;
  const isAiLoading = externalIsAiLoading !== undefined ? externalIsAiLoading : internalIsAiLoading;

  const lowlight = createLowlight(common);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        document: false, // Disable default document
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      PageDocument, // Custom document that allows page+ content
      Page.configure({
        pageFormat,
        showPageNumber: true,
        pageGap: 40,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'code-block-lowlight',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'youtube-embed',
        },
      }),
      Mermaid,
      Placeholder.configure({
        placeholder: 'Start writing... Type / for commands',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Underline.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TableKit.configure({
        table: {
          HTMLAttributes: {
            class: 'tiptap-table w-full border-collapse border border-border',
          },
        },
        tableRow: {
          HTMLAttributes: {
            class: 'border border-border',
          },
        },
        tableCell: {
          HTMLAttributes: {
            class: 'border border-border p-2 min-w-[100px]',
          },
        },
        tableHeader: {
          HTMLAttributes: {
            class: 'border border-border p-2 min-w-[100px] bg-muted font-semibold',
          },
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md my-4',
        },
      }),
      FloatingMenuExtension,
      BubbleMenuExtension,
      CharacterCount.configure({
        limit: null,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      SearchAndReplace.configure({
        searchResultClass: 'search-result',
        caseSensitive: false,
        disableRegex: true,
      }),
    ],
    content: content || {
      type: 'pageDocument',
      content: [
        {
          type: 'page',
          attrs: { pageNumber: 1 },
          content: [
            { type: 'paragraph' },
          ],
        },
      ],
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useImperativeHandle(ref, () => editor, [editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (scrollToHeading && editor) {
      (window as any).__scrollToHeading = (headingText: string) => {
        const editorElement = editor.view.dom;
        const headings = editorElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

        const targetHeading = Array.from(headings).find(
          h => h.textContent?.trim() === headingText.trim()
        ) as HTMLElement;

        if (targetHeading) {
          targetHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });

          targetHeading.style.border = '2px solid #9ca3af';
          targetHeading.style.borderRadius = '4px';
          targetHeading.style.padding = '4px';
          targetHeading.style.transition = 'border-color 0.3s ease-in-out';

          let blinkCount = 0;
          const blinkInterval = setInterval(() => {
            targetHeading.style.borderColor = blinkCount % 2 === 0 ? 'transparent' : '#9ca3af';
            blinkCount++;

            if (blinkCount >= 6) {
              clearInterval(blinkInterval);
              setTimeout(() => {
                targetHeading.style.border = '';
                targetHeading.style.borderRadius = '';
                targetHeading.style.padding = '';
              }, 300);
            }
          }, 150);
        }
      };
    }

    return () => {
      if ((window as any).__scrollToHeading) {
        delete (window as any).__scrollToHeading;
      }
    };
  }, [editor, scrollToHeading]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertYouTube = () => {
    const url = window.prompt('Enter YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const insertCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  const insertMermaid = () => {
    const defaultContent = `graph TD
    A[Start] --> B[Process]
    B --> C[End]`;
    editor.chain().focus().setMermaid(defaultContent).run();
  };

  const insertPage = () => {
    editor.chain().focus().insertPage().run();
    toast.success('New page inserted');
  };

  const handlePageFormatChange = (format: PageFormatName) => {
    editor.chain().focus().setPageFormat(format).run();
    onPageFormatChange?.(format);
    toast.success(`Page format changed to ${format}`);
  };

  const handleAIRewrite = async (customPrompt?: string, modeId?: string) => {
    if (externalOnAiRewrite) {
      externalOnAiRewrite(customPrompt, modeId);
      return;
    }

    if (!editor) return;

    const { from, to } = editor.state.selection;
    let textToRewrite = '';
    let selectionRange = { from, to };

    if (from !== to) {
      textToRewrite = editor.state.doc.textBetween(from, to, ' ');
    } else {
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

    setInternalIsAiLoading(true);
    setInternalAiSuggestion(null);

    try {
      const fullPrompt = customPrompt ? `${customPrompt}\n\n"${textToRewrite}"` : undefined;
      const suggestion = await rewriteText(textToRewrite, fullPrompt);
      setInternalAiSuggestion({
        originalText: textToRewrite,
        suggestedText: suggestion,
        range: selectionRange,
        mode: modeId,
      });
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate AI suggestion');
    } finally {
      setInternalIsAiLoading(false);
    }
  };

  const handleRegenerateWithMode = async (mode: any) => {
    if (externalOnAiRegenerate) {
      externalOnAiRegenerate(mode);
      return;
    }

    if (!aiSuggestion) return;
    await handleAIRewrite(mode.prompt, mode.id);
  };

  const handleApproveSuggestion = () => {
    if (externalOnAiApprove) {
      externalOnAiApprove();
      return;
    }

    if (!editor || !aiSuggestion) return;

    const htmlContent = markdownToHtml(aiSuggestion.suggestedText);

    editor
      .chain()
      .focus()
      .deleteRange(aiSuggestion.range)
      .insertContentAt(aiSuggestion.range.from, htmlContent)
      .run();

    setInternalAiSuggestion(null);
    toast.success('AI suggestion applied');
  };

  const handleRejectSuggestion = () => {
    if (externalOnAiReject) {
      externalOnAiReject();
      return;
    }

    setInternalAiSuggestion(null);
    toast.info('AI suggestion rejected');
  };

  const getSentenceCount = () => {
    if (!editor) return 0;
    const text = editor.getText();
    const sentences = splitSentences(text);
    return sentences.length;
  };

  // Debounced counts that update every 10 seconds
  const [debouncedSentenceCount, setDebouncedSentenceCount] = useState(0);
  const [debouncedWordCount, setDebouncedWordCount] = useState(0);
  const [debouncedCharCount, setDebouncedCharCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    let timer: NodeJS.Timeout;

    const updateCounts = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const text = editor.getText();
        const sentences = splitSentences(text);
        setDebouncedSentenceCount(sentences.length);
        setDebouncedWordCount(editor.storage.characterCount.words());
        setDebouncedCharCount(editor.storage.characterCount.characters());
      }, 10000);
    };

    // Initial update
    updateCounts();

    // Listen to editor updates
    editor.on('update', updateCounts);

    return () => {
      clearTimeout(timer);
      editor.off('update', updateCounts);
    };
  }, [editor]);

  return (
    <div className="flex h-full flex-col bg-editor-bg">
      {/* Search and Replace Bar */}
      {!readOnly && (
        <SearchReplaceBar
          editor={editor}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-card px-4 py-2">
          {/* History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Page Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertPage}
            className="h-8 px-2 text-xs"
            title="Insert Page"
          >
            <FilePlus className="h-4 w-4 mr-1" />
            Page
          </Button>

          <select
            value={pageFormat}
            onChange={(e) => handlePageFormatChange(e.target.value as PageFormatName)}
            className="h-8 px-2 text-xs border border-border rounded bg-background"
            title="Page Format"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
            <option value="Custom">Custom</option>
          </select>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Font Family and Size */}
          <FontFamilyDropdown editor={editor} />
          <FontSizeDropdown editor={editor} />

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Headings */}
          <HeadingsDropdown editor={editor} />

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Styles */}
          <StylesDropdown editor={editor} />

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bold') && 'bg-muted'
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('italic') && 'bg-muted'
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('underline') && 'bg-muted'
            )}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('strike') && 'bg-muted'
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('code') && 'bg-muted'
            )}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('highlight') && 'bg-muted'
            )}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bulletList') && 'bg-muted'
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('orderedList') && 'bg-muted'
            )}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('taskList') && 'bg-muted'
            )}
            title="Task List"
          >
            <ListTodo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('blockquote') && 'bg-muted'
            )}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Alignment */}
          <AlignmentDropdown editor={editor} />

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('link') && 'bg-muted'
            )}
            title="Add Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Table */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertTable}
            className="h-8 w-8 p-0"
            title="Insert Table"
          >
            <Table className="h-4 w-4" />
          </Button>

          {/* Image */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-8 w-8 p-0"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          {/* YouTube */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertYouTube}
            className="h-8 w-8 p-0"
            title="Insert YouTube Video"
          >
            <YoutubeIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Code Block */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertCodeBlock}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('codeBlock') && 'bg-muted'
            )}
            title="Code Block"
          >
            <CodeSquare className="h-4 w-4" />
          </Button>

          {/* Mermaid Diagram */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertMermaid}
            className="h-8 w-8 p-0"
            title="Insert Mermaid Diagram"
          >
            <Network className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* AI Rewrite */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIRewrite}
            disabled={isAiLoading}
            className="h-8 w-8 p-0"
            title="AI Rewrite"
          >
            <Bot className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Export */}
          <ExportDropdown title={title} htmlContent={editor.getHTML()} />
        </div>
      )}

      {/* Editor Content with Pages Layout */}
      <div className="flex-1 overflow-auto relative">
        <div className="tiptap-pages-root">
          <EditorContent editor={editor} className="w-full" />

          {/* Floating Menu - appears on empty lines */}
          <FloatingMenu
            editor={editor}
            shouldShow={({ state }) => {
              const { $from } = state.selection;
              const isEmptyParagraph = $from.parent.type.name === 'paragraph' &&
                $from.parent.textContent.length === 0;
              return isEmptyParagraph;
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="h-8 px-2 text-xs"
              title="Heading 1"
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="h-8 px-2 text-xs"
              title="Heading 2"
            >
              H2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 w-8 p-0"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className="h-8 w-8 p-0"
              title="Task List"
            >
              <ListTodo className="h-4 w-4" />
            </Button>
          </FloatingMenu>

          {/* Bubble Menu - appears on text selection */}
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor, state }) => {
              const { from, to } = state.selection;
              const hasSelection = from !== to;
              return hasSelection && !editor.isActive('codeBlock');
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('bold') && 'bg-accent'
              )}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('italic') && 'bg-accent'
              )}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('underline') && 'bg-accent'
              )}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('strike') && 'bg-accent'
              )}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('highlight') && 'bg-accent'
              )}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addLink}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('link') && 'bg-accent'
              )}
              title="Add Link"
            >
              <Link2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleAIRewrite}
              disabled={isAiLoading}
              className="h-8 w-8 p-0"
              title="AI Rewrite"
            >
              <Bot className="h-4 w-4" />
            </Button>
          </BubbleMenu>

          {/* Table Bubble Menu */}
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => {
              return (
                editor.isActive('table') ||
                editor.isActive('tableCell') ||
                editor.isActive('tableHeader') ||
                editor.isActive('tableRow')
              );
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg"
          >
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="h-8 px-2 text-xs"
                title="Add column before"
              >
                <Plus className="h-3 w-3 mr-1" />
                Col ←
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="h-8 px-2 text-xs"
                title="Add column after"
              >
                <Plus className="h-3 w-3 mr-1" />
                Col →
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="h-8 px-2 text-xs text-destructive"
                title="Delete column"
              >
                <Trash className="h-3 w-3 mr-1" />
                Col
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="h-8 px-2 text-xs"
                title="Add row before"
              >
                <Plus className="h-3 w-3 mr-1" />
                Row ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="h-8 px-2 text-xs"
                title="Add row after"
              >
                <Plus className="h-3 w-3 mr-1" />
                Row ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="h-8 px-2 text-xs text-destructive"
                title="Delete row"
              >
                <Trash className="h-3 w-3 mr-1" />
                Row
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
                className="h-8 px-2 text-xs"
                title="Merge or split cells"
              >
                <Merge className="h-3 w-3 mr-1" />
                Merge
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="h-8 px-2 text-xs"
                title="Toggle header row"
              >
                Header
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="h-8 px-2 text-xs text-destructive"
                title="Delete table"
              >
                <Trash className="h-3 w-3 mr-1" />
                Table
              </Button>
            </div>
          </BubbleMenu>

          {/* AI Suggestion Overlay */}
          {(aiSuggestion || isAiLoading) && externalAiSuggestion === undefined && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <AIRewriteSuggestion
                originalText={aiSuggestion?.originalText || ''}
                suggestedText={aiSuggestion?.suggestedText || ''}
                onApprove={handleApproveSuggestion}
                onReject={handleRejectSuggestion}
                onRegenerate={handleRegenerateWithMode}
                currentMode={aiSuggestion?.mode}
                isLoading={isAiLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar with Sentence, Word and Character Count */}
      <div className="border-t border-border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-4">
        <span>
          Sentences: {debouncedSentenceCount}
        </span>
        <span>
          Words: {debouncedWordCount}
        </span>
        <span>
          Characters: {debouncedCharCount}
        </span>
      </div>

      {/* Tiptap Styles */}
      <style>{`
        .ProseMirror {
          min-height: 100%;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: hsl(var(--muted-foreground));
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }

        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          cursor: pointer;
          width: 1rem;
          height: 1rem;
          margin-top: 0.3rem;
        }

        .ProseMirror mark {
          background-color: hsl(var(--primary) / 0.3);
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
        }

        .ProseMirror code {
          background-color: hsl(var(--muted));
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          background-color: hsl(var(--muted));
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          font-size: 0.875rem;
        }

        .ProseMirror blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
        }

        .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          line-height: 1.25;
        }

        .ProseMirror h1 {
          font-size: 2rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
        }

        /* Search and Replace highlighting */
        .search-result {
          background-color: rgba(255, 237, 74, 0.4);
          border-radius: 2px;
        }

        .search-result-current {
          background-color: rgba(255, 152, 0, 0.6);
          border-radius: 2px;
        }

        /* Table styles */
        .ProseMirror table {
          margin: 1rem 0;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table .selectedCell {
          background-color: hsl(var(--accent));
        }

        .ProseMirror table .column-resize-handle {
          background-color: hsl(var(--primary));
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 4px;
        }

        /* Image styles */
        .ProseMirror img {
          display: block;
          height: auto;
          margin: 1rem 0;
          max-width: 100%;
        }

        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid hsl(var(--primary));
        }

        /* Code block with syntax highlighting */
        .ProseMirror .code-block-lowlight {
          background-color: hsl(var(--muted));
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .ProseMirror .code-block-lowlight code {
          background: none;
          padding: 0;
          color: inherit;
        }

        /* YouTube embed */
        .ProseMirror .youtube-embed {
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          max-width: 100%;
        }

        .ProseMirror .youtube-embed iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
        }

        /* Mermaid diagram styles */
        .mermaid-wrapper {
          margin: 1rem 0;
        }

        .mermaid-container {
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .mermaid-display svg {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
});

PagesEditor.displayName = 'PagesEditor';
