import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Table,
  ImageIcon,
  Underline as UnderlineIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export const NoteEditor = ({ content, onChange, title, onTitleChange }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
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
      Underline.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure(),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none px-6 py-6',
      },
    },
  });

  // Update editor content when prop changes (e.g., loading a different document)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex h-full flex-col bg-editor-bg">
      <div className="border-b border-border bg-card px-6 py-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Note"
          className="w-full border-none bg-transparent text-3xl font-serif font-semibold text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-1 border-b border-border bg-card px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-accent' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-accent' : ''}`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={insertTable}
          className="h-8 w-8 p-0"
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertImage}
          className="h-8 w-8 p-0"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap {
          outline: none;
          min-height: 100%;
        }

        .tiptap p.is-editor-empty:first-child::before {
          color: var(--muted-foreground);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap table {
          margin: 1rem 0;
        }

        .tiptap table td,
        .tiptap table th {
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .tiptap table .selectedCell {
          background-color: var(--accent);
        }

        .tiptap table .column-resize-handle {
          background-color: var(--primary);
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 4px;
        }

        .tiptap img {
          display: block;
          height: auto;
          margin: 1rem 0;
          max-width: 100%;
        }

        .tiptap img.ProseMirror-selectednode {
          outline: 3px solid var(--primary);
        }
      `}</style>
    </div>
  );
};
