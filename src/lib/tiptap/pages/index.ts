/**
 * Tiptap Pages Extension
 *
 * A page-based editor system for Tiptap that provides:
 * - Fixed-size pages with customizable formats (A4, Letter, Legal)
 * - Visual page breaks and page numbers
 * - Print-ready layout
 * - Commands for page manipulation
 *
 * Usage:
 * ```tsx
 * import { PageDocument, Page } from '@/lib/tiptap/pages';
 *
 * const editor = useEditor({
 *   extensions: [
 *     StarterKit.configure({ document: false }),
 *     PageDocument,
 *     Page.configure({
 *       pageFormat: 'A4',
 *       showPageNumber: true,
 *     }),
 *   ],
 * });
 * ```
 */

export { PageDocument } from './PageDocument';
export { Page } from './Page';
export { PageNodeView } from './PageNodeView';
export { PAGE_FORMATS, getPageFormat } from './pageFormat';
export type { PageFormatName, PageMetrics } from './pageFormat';
export type { PageOptions } from './Page';
