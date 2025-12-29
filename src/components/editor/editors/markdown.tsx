"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface UnifiedMarkdownProps {
  content: string;
  className?: string;
}

export function UnifiedMarkdown({ content, className }: UnifiedMarkdownProps) {
  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-semibold tracking-tight mb-4 mt-8 first:mt-0 pb-2 border-b border-border/40"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-semibold tracking-tight mb-3 mt-8 first:mt-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-semibold mb-2 mt-6 first:mt-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-base font-semibold mb-2 mt-5 first:mt-0"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-sm font-semibold mb-1 mt-4 first:mt-0"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 mt-4 first:mt-0"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-relaxed my-4 first:mt-0 last:mb-0" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code
                className="px-1.5 py-0.5 rounded-md bg-muted text-foreground font-mono text-[13px]"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={cn(
                  "block p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[13px] font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 overflow-x-auto my-5",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="my-5 overflow-hidden rounded-xl" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 first:mt-0 last:mb-0" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 first:mt-0 last:mb-0" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-5 pl-4 py-1 border-l-2 border-border text-muted-foreground"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] decoration-[1px] hover:decoration-foreground/60 transition-colors duration-150"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              className="max-w-full h-auto rounded-xl border border-border/40 shadow-sm my-5"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-0 h-px bg-border/60" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="my-5 overflow-x-auto">
              <table
                className="w-full text-sm rounded-xl border border-border/60 overflow-hidden"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted/50 dark:bg-muted/30" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 text-foreground border-t border-border/40"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
