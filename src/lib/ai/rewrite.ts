import { marked } from 'marked';

/**
 * Convert markdown text to HTML
 */
export function markdownToHtml(markdown: string): string {
  // Configure marked to be safer and handle inline elements better
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
  });

  const html = marked.parse(markdown) as string;
  return html.trim();
}

/**
 * Rewrite text using Groq's Llama 3.3 model via backend API
 */
export async function rewriteText(text: string, customPrompt?: string): Promise<string> {
  const response = await fetch('/api/ai/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, prompt: customPrompt }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to rewrite text' }));
    throw new Error(error.error || 'Failed to rewrite text');
  }

  const data = await response.json();
  return data.rewrittenText;
}
