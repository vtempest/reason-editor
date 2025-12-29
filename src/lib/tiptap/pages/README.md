# Tiptap Pages Extension

A custom page-based editor extension for Tiptap that provides a Word-like experience with fixed-size pages, visual page breaks, and automatic page numbering.

## Features

- **Fixed-size pages** with support for multiple formats (A4, Letter, Legal, Custom)
- **Visual page breaks** with automatic page numbering
- **Print-ready layout** that translates well to PDF/print
- **Dynamic page formatting** - change page size on the fly
- **Full Tiptap compatibility** - works with all standard Tiptap extensions
- **Responsive design** - scales on smaller screens

## Architecture

The implementation follows the guide provided and consists of:

1. **PageDocument** (`PageDocument.ts`) - Custom document extension that enforces `page+` content
2. **Page** (`Page.ts`) - Node extension defining page structure, attributes, and commands
3. **PageNodeView** (`PageNodeView.tsx`) - React component for rendering pages with dynamic formatting
4. **Page Format Utilities** (`pageFormat.ts`) - Predefined page formats and metrics
5. **Styles** (`pages.css`) - CSS for page layout, visual breaks, and print support

## Usage

### Basic Setup

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { PageDocument, Page } from '@/lib/tiptap/pages';
import '@/lib/tiptap/pages/pages.css';

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      document: false, // Disable default document
    }),
    PageDocument, // Custom document
    Page.configure({
      pageFormat: 'A4',
      showPageNumber: true,
      pageGap: 40,
    }),
  ],
  content: {
    type: 'pageDocument',
    content: [
      {
        type: 'page',
        content: [{ type: 'paragraph' }],
      },
    ],
  },
});
```

### Using the PagesEditor Component

The `PagesEditor` component provides a complete editor UI with all features:

```tsx
import { PagesEditor } from '@/components/editor/editors/PagesEditor';

function MyApp() {
  const [content, setContent] = useState('');
  const [pageFormat, setPageFormat] = useState('A4');

  return (
    <PagesEditor
      content={content}
      onChange={setContent}
      title="My Document"
      onTitleChange={setTitle}
      pageFormat={pageFormat}
      onPageFormatChange={setPageFormat}
    />
  );
}
```

## Commands

### Insert Page

Insert a new page after the current page:

```tsx
editor.chain().focus().insertPage().run();
```

### Set Page Format

Change the page format:

```tsx
editor.chain().focus().setPageFormat('Letter').run();
```

## Page Formats

| Format | Dimensions | Use Case |
|--------|-----------|----------|
| A4 | 210mm × 297mm (794px × 1123px) | International standard |
| Letter | 8.5in × 11in (816px × 1056px) | North American standard |
| Legal | 8.5in × 14in (816px × 1344px) | Legal documents |
| Custom | Configurable | Custom sizes |

## Styling

The extension includes comprehensive styles in `pages.css`:

- Page container with shadow and hover effects
- Inner content area with configurable margins
- Page numbers in footer
- Print-ready styles with `@media print`
- Responsive scaling for smaller screens

## Demo

Visit `/pages-demo` to see a live demonstration of the Pages editor with all features.

## Technical Details

### Schema Structure

```
pageDocument
└── page+ (one or more pages)
    └── block+ (paragraphs, headings, lists, etc.)
```

### Page Attributes

- `pageNumber`: Automatically calculated from position in document

### Storage

The extension stores page format settings in editor storage:

```tsx
editor.storage.page.metrics // Current page dimensions and margins
editor.storage.page.pageFormat // Current format name
```

### Events

The extension emits a `pageFormatUpdate` event when the format changes, which triggers re-rendering of all pages.

## Limitations

- **Automatic pagination**: This implementation uses manual page breaks. True automatic pagination based on content overflow requires additional plugin logic.
- **Headers/Footers**: Custom headers and footers per page would require extending the Page node schema.
- **Page-specific styles**: Currently all pages share the same format. Per-page formatting would require adding more attributes.

## Future Enhancements

Potential improvements that could be added:

1. **Automatic pagination** - Plugin to detect content overflow and auto-insert page breaks
2. **Headers and footers** - Customizable per-page or per-section headers/footers
3. **Page orientation** - Portrait/landscape support
4. **Section breaks** - Different formatting for different sections
5. **Line numbering** - For legal documents
6. **Watermarks** - Background images or text

## Credits

Built following the Tiptap Pages architecture guide, adapted for this codebase.

## License

Part of the reason-editor project.
