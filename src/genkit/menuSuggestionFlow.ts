import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import { z } from 'zod';
import '../config/environment'; // Load environment variables

// Ensure API key is configured
if (!process.env['GOOGLE_GENAI_API_KEY']) {
  console.error('GOOGLE_GENAI_API_KEY environment variable is required');
  console.error('Please check that .env.local file exists with your API key');
  console.error(
    'Available environment variables:',
    Object.keys(process.env).filter((key) => key.includes('GENKI') || key.includes('GOOGLE'))
  );
  throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable');
}

const ai = genkit({
  plugins: [googleAI()],
});

export const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.object({ theme: z.string() }),
    outputSchema: z.object({ menuItem: z.string() }),
  },
  async ({ theme }) => {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Invent a menu item for a ${theme} themed restaurant.`,
    });

    return { menuItem: response.text };
  }
);
