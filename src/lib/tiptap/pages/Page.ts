import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PageNodeView } from './PageNodeView';
import { PageFormatName, PAGE_FORMATS, getPageFormat } from './pageFormat';

export interface PageOptions {
  pageFormat: PageFormatName;
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  pageGap: number;
  showPageNumber: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    page: {
      /**
       * Insert a new page after the current page
       */
      insertPage: () => ReturnType;
      /**
       * Set the page format (A4, Letter, Legal, Custom)
       */
      setPageFormat: (format: PageFormatName) => ReturnType;
    };
  }
}

export const Page = Node.create<PageOptions>({
  name: 'page',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  addOptions() {
    const defaultFormat = PAGE_FORMATS.A4;
    return {
      pageFormat: 'A4' as PageFormatName,
      pageWidth: defaultFormat.width,
      pageHeight: defaultFormat.height,
      marginTop: defaultFormat.margins.top,
      marginRight: defaultFormat.margins.right,
      marginBottom: defaultFormat.margins.bottom,
      marginLeft: defaultFormat.margins.left,
      pageGap: 40,
      showPageNumber: true,
    };
  },

  addAttributes() {
    return {
      pageNumber: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-page-number'),
        renderHTML: (attributes) => {
          if (!attributes.pageNumber) {
            return {};
          }
          return {
            'data-page-number': attributes.pageNumber,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-page]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page': 'true',
        class: 'tiptap-page',
      }),
      [
        'div',
        { class: 'tiptap-page-inner' },
        0, // content goes here
      ],
    ];
  },

  addStorage() {
    const defaultFormat = PAGE_FORMATS.A4;
    return {
      pageFormat: 'A4' as PageFormatName,
      metrics: defaultFormat,
    };
  },

  addCommands() {
    return {
      insertPage:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection, schema } = state;
          const pageType = schema.nodes.page;
          if (!pageType) return false;

          const { $from } = selection;

          // Find the parent page node
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type === pageType) {
              const posAfterPage = $from.end(depth);

              // Create a new page with an empty paragraph
              const newPage = pageType.create(
                { pageNumber: null },
                schema.nodes.paragraph.create()
              );

              tr.insert(posAfterPage + 1, newPage);

              if (dispatch) {
                dispatch(tr.scrollIntoView());
              }
              return true;
            }
          }

          // If not inside a page, insert at current position
          const newPage = pageType.create(
            { pageNumber: null },
            schema.nodes.paragraph.create()
          );

          tr.insert(selection.from, newPage);

          if (dispatch) {
            dispatch(tr.scrollIntoView());
          }
          return true;
        },

      setPageFormat:
        (formatName: PageFormatName) =>
        ({ editor }) => {
          const format = getPageFormat(formatName);
          if (!format) return false;

          // Update storage
          editor.storage.page.metrics = format;
          editor.storage.page.pageFormat = formatName;

          // Emit event for UI updates
          editor.emit('pageFormatUpdate', format);

          return true;
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageNodeView);
  },
});
