import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  menuInput = '';
  selectedModel = 'gemini'; // 'gemini' or 'ollama'
  generatedMenuItem = signal('');
  streamedText = signal('');
  isGenerating = signal(false);
  isStreaming = signal(false);

  async generateMenuItem() {
    const theme = this.menuInput?.trim();
    if (!theme) {
      console.log('No theme provided');
      return;
    }

    // Clear previous results
    this.streamedText.set('');
    this.generatedMenuItem.set('');
    this.isGenerating.set(true);

    try {
      console.log('Generating menu item for theme:', theme, 'with model:', this.selectedModel);

      const endpoint =
        this.selectedModel === 'ollama'
          ? 'http://localhost:4200/api/menuSuggestion/ollama'
          : 'http://localhost:4200/api/menuSuggestion';

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
      console.log('Generated result:', result);
      this.generatedMenuItem.set(result.menuItem || '');
    } catch (error) {
      console.error('Error generating menu item:', error);
      this.generatedMenuItem.set('Error occurred. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  async streamMenuItem() {
    const theme = this.menuInput?.trim();
    if (!theme) {
      console.log('No theme provided for streaming');
      return;
    }

    // Clear previous results and set loading state
    this.streamedText.set('');
    this.generatedMenuItem.set('');
    this.isStreaming.set(true);

    try {
      const endpoint =
        this.selectedModel === 'ollama'
          ? 'http://localhost:4200/api/menuSuggestion/stream/ollama'
          : 'http://localhost:4200/api/menuSuggestion/stream';

      // Use fetch API for streaming instead of streamFlow
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
        this.streamedText.update((prev) => prev + chunk);
      }
    } catch (error) {
      console.error('Error streaming menu item:', error);
      this.streamedText.set('Error occurred while streaming. Please try again.');
    } finally {
      this.isStreaming.set(false);
    }
  }
}
