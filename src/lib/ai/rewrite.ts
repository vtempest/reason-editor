import { ChatGroq } from '@langchain/groq';

/**
 * Get Groq API key from environment
 */
function getGroqApiKey(): string | undefined {
  // Support both Next.js and Vite environments
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GROQ_API_KEY) {
    return process.env.NEXT_PUBLIC_GROQ_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY as string;
  }
  return undefined;
}

/**
 * Rewrite text using Groq's Llama 3.3 model
 */
export async function rewriteText(text: string): Promise<string> {
  const GROQ_API_KEY = getGroqApiKey();

  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Please add NEXT_PUBLIC_GROQ_API_KEY (Next.js) or VITE_GROQ_API_KEY (Vite) to your .env file.');
  }

  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  const prompt = `Rewrite the following text to improve clarity, grammar, and style while maintaining the original meaning and tone. Only return the rewritten text without any explanation or additional commentary:

${text}`;

  const response = await model.invoke(prompt);

  return response.content.toString().trim();
}
