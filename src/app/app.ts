import { Component, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { runFlow, streamFlow } from 'genkit/beta/client';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
export class App {
  menuInput = '';
  theme = signal('');
  streamedText = signal('');
  isStreaming = signal(false);

  menuResource = resource({
    loader: () => {
      const currentTheme = this.theme();
      // Don't make request if theme is empty
      if (!currentTheme || currentTheme.trim() === '') {
        return Promise.resolve({ menuItem: '' });
      }

      return runFlow({
        url: 'http://localhost:4200/api/menuSuggestion',
        input: { theme: currentTheme },
      });
    },
  });

  generateMenuItem() {
    const theme = this.menuInput?.trim();
    if (!theme) {
      console.log('No theme provided');
      return;
    }

    // Clear previous streaming results
    this.streamedText.set('');
    this.isStreaming.set(false);

    // Set theme which will trigger the resource loader
    this.theme.set(theme);
  }

  async streamMenuItem() {
    const theme = this.menuInput?.trim();
    if (!theme) {
      console.log('No theme provided for streaming');
      return;
    }

    // Clear previous results and set loading state
    this.streamedText.set('');
    this.isStreaming.set(true);
    // Clear the regular resource to avoid conflicts
    this.theme.set('');

    try {
      // Use fetch API for streaming instead of streamFlow
      const response = await fetch('http://localhost:4200/api/menuSuggestion/stream', {
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
