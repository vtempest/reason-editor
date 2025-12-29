import { useState } from 'react';
import { PagesEditor } from '@/components/editor/editors/PagesEditor';
import { PageFormatName } from '@/lib/tiptap/pages';

/**
 * Demo page for the Tiptap Pages Editor
 * Shows how to use the page-based editor with different formats
 */
export default function PagesDemo() {
  const [content, setContent] = useState(`
    <div data-page="true" class="tiptap-page">
      <div class="tiptap-page-inner">
        <h1>Welcome to Tiptap Pages</h1>
        <p>This is a page-based editor that provides a Word-like experience with fixed-size pages, visual page breaks, and automatic page numbering.</p>
        <h2>Features</h2>
        <ul>
          <li>Fixed-size pages (A4, Letter, Legal, Custom)</li>
          <li>Visual page breaks with automatic numbering</li>
          <li>Print-ready layout</li>
          <li>All standard Tiptap formatting options</li>
          <li>Tables, images, code blocks, and more</li>
        </ul>
        <h2>Getting Started</h2>
        <p>Use the toolbar above to format your text. Click the "Insert Page" button to add a new page, or use the page format dropdown to change the paper size.</p>
        <h3>Try These Features:</h3>
        <ol>
          <li><strong>Bold</strong>, <em>italic</em>, and <u>underline</u> formatting</li>
          <li>Different heading levels (H1-H6)</li>
          <li>Bullet lists and numbered lists</li>
          <li>Tables and images</li>
          <li>Code blocks with syntax highlighting</li>
        </ol>
        <blockquote>
          <p>"The best way to predict the future is to create it." - Peter Drucker</p>
        </blockquote>
        <p>Start writing below to see the page editor in action!</p>
      </div>
    </div>
  `);
  const [title, setTitle] = useState('Pages Demo Document');
  const [pageFormat, setPageFormat] = useState<PageFormatName>('A4');

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Tiptap Pages Editor Demo</h1>
          <p className="text-sm text-muted-foreground">
            A page-based WYSIWYG editor built with Tiptap, providing a Word-like experience with fixed-size pages and visual page breaks.
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <PagesEditor
          content={content}
          onChange={setContent}
          title={title}
          onTitleChange={setTitle}
          pageFormat={pageFormat}
          onPageFormatChange={setPageFormat}
        />
      </div>

      {/* Footer Info */}
      <div className="border-t border-border bg-muted/50 px-6 py-2">
        <div className="max-w-7xl mx-auto text-xs text-muted-foreground">
          <p>
            Current format: <strong>{pageFormat}</strong> |
            Features: Custom Document Schema, Page Node Extension, Dynamic Page Numbering, Print-Ready Layout
          </p>
        </div>
      </div>
    </div>
  );
}
