import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuSuggestionService {
  async generateMenuItem(theme: string, model: 'gemini' | 'ollama'): Promise<string> {
    const endpoint = model === 'ollama' ? '/api/menuSuggestion/ollama' : '/api/menuSuggestion';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.menuItem || '';
  }

  async streamMenuItem(
    theme: string,
    model: 'gemini' | 'ollama',
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const endpoint =
      model === 'ollama' ? '/api/menuSuggestion/stream/ollama' : '/api/menuSuggestion/stream';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  }
}
