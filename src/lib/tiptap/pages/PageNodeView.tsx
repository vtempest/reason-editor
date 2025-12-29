import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { NodeViewProps } from '@tiptap/core';
import { useEffect, useState } from 'react';

/**
 * React NodeView for rendering page nodes with page numbers
 * and dynamic formatting based on editor storage
 */
export const PageNodeView = (props: NodeViewProps) => {
  const { editor, getPos, node } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [metrics, setMetrics] = useState(editor.storage.page?.metrics || {
    width: 794,
    height: 1123,
    margins: { top: 60, right: 40, bottom: 60, left: 40 },
  });

  useEffect(() => {
    // Calculate page number based on position in document
    const pos = getPos();
    if (typeof pos === 'number') {
      const resolvedPos = editor.state.doc.resolve(pos);
      const index = resolvedPos.index(0); // Index at depth 0 (top level)
      setPageNumber(index + 1);
    }
  }, [editor, getPos]);

  useEffect(() => {
    // Listen for page format updates
    const handleFormatUpdate = (newMetrics: any) => {
      setMetrics(newMetrics);
    };

    editor.on('pageFormatUpdate', handleFormatUpdate);

    return () => {
      editor.off('pageFormatUpdate', handleFormatUpdate);
    };
  }, [editor]);

  const showPageNumber = editor.extensionManager.extensions
    .find((ext) => ext.name === 'page')
    ?.options?.showPageNumber ?? true;

  const pageGap = editor.storage.page?.pageGap || 40;

  return (
    <NodeViewWrapper
      className="tiptap-page"
      data-page
      data-page-number={pageNumber}
      style={{
        width: `${metrics.width}px`,
        height: `${metrics.height}px`,
        marginBottom: `${pageGap}px`,
      }}
    >
      <div
        className="tiptap-page-inner"
        style={{
          top: `${metrics.margins.top}px`,
          right: `${metrics.margins.right}px`,
          bottom: `${metrics.margins.bottom}px`,
          left: `${metrics.margins.left}px`,
        }}
      >
        <NodeViewContent />
      </div>
      {showPageNumber && (
        <div className="tiptap-page-footer">
          Page {pageNumber}
        </div>
      )}
    </NodeViewWrapper>
  );
};
