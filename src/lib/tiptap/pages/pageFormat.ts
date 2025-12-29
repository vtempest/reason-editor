/**
 * Page format definitions for different paper sizes
 */

export type PageFormatName = 'A4' | 'Letter' | 'Legal' | 'Custom';

export interface PageMetrics {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Standard page formats with dimensions in pixels
 * Assuming 96 DPI (web standard)
 */
export const PAGE_FORMATS: Record<PageFormatName, PageMetrics> = {
  /**
   * A4: 210mm × 297mm (8.27in × 11.69in)
   */
  A4: {
    width: 794,  // 210mm
    height: 1123, // 297mm
    margins: {
      top: 60,
      right: 40,
      bottom: 60,
      left: 40,
    },
  },
  /**
   * Letter: 8.5in × 11in
   */
  Letter: {
    width: 816,  // 8.5in
    height: 1056, // 11in
    margins: {
      top: 56,
      right: 36,
      bottom: 56,
      left: 36,
    },
  },
  /**
   * Legal: 8.5in × 14in
   */
  Legal: {
    width: 816,  // 8.5in
    height: 1344, // 14in
    margins: {
      top: 56,
      right: 36,
      bottom: 56,
      left: 36,
    },
  },
  /**
   * Custom format - default to A4 size but can be overridden
   */
  Custom: {
    width: 794,
    height: 1123,
    margins: {
      top: 60,
      right: 40,
      bottom: 60,
      left: 40,
    },
  },
};

/**
 * Helper to get page format metrics
 */
export function getPageFormat(name: PageFormatName): PageMetrics {
  return PAGE_FORMATS[name] || PAGE_FORMATS.A4;
}
