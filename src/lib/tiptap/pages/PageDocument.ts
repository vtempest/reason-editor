import { Document } from '@tiptap/extension-document';

/**
 * Custom Document extension that only allows page nodes as top-level content
 * This ensures the document structure is page+ instead of block+
 */
export const PageDocument = Document.extend({
  name: 'pageDocument',

  content: 'page+',
});
