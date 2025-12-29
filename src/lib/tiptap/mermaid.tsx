'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// Mermaid React Component
export const MermaidComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!node.attrs.content) {
        setSvg('');
        return;
      }

      try {
        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          node.attrs.content
        );
        setSvg(svg);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        setSvg('');
      }
    };

    renderDiagram();
  }, [node.attrs.content]);

  return (
    <NodeViewWrapper className="mermaid-wrapper">
      <div className="mermaid-container" ref={containerRef}>
        {isEditing ? (
          <div className="border rounded-md p-2 bg-muted">
            <textarea
              className="w-full min-h-[200px] p-2 font-mono text-sm bg-background border rounded resize-y"
              value={node.attrs.content}
              onChange={(e) => updateAttributes({ content: e.target.value })}
              placeholder="Enter Mermaid diagram code..."
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Done
              </button>
              <button
                onClick={deleteNode}
                className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mermaid-display cursor-pointer hover:bg-muted/50 rounded p-2 transition"
            onClick={() => setIsEditing(true)}
          >
            {error ? (
              <div className="text-destructive p-4 border border-destructive rounded">
                <p className="font-semibold">Mermaid Error:</p>
                <pre className="text-sm mt-2">{error}</pre>
                <p className="text-sm mt-2 text-muted-foreground">Click to edit</p>
              </div>
            ) : svg ? (
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <div className="text-muted-foreground p-4 border border-dashed rounded">
                Click to add Mermaid diagram
              </div>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export interface MermaidOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaid: {
      /**
       * Insert a mermaid diagram
       */
      setMermaid: (content?: string) => ReturnType;
    };
  }
}

export const Mermaid = Node.create<MermaidOptions>({
  name: 'mermaid',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-content'),
        renderHTML: attributes => {
          return {
            'data-content': attributes.content,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'mermaid' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidComponent);
  },

  addCommands() {
    return {
      setMermaid:
        (content = '') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { content },
          });
        },
    };
  },
});
