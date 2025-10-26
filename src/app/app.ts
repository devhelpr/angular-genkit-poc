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
    request: () => this.theme(),
    loader: ({ request }) =>
      runFlow({
        url: 'http://localhost:4200/api/menuSuggestion',
        input: { theme: request },
      }),
  });

  async streamMenuItem() {
    const theme = this.menuInput;
    if (!theme) return;

    this.isStreaming.set(true);
    this.streamedText.set('');

    try {
      const result = streamFlow({
        url: 'http://localhost:4200/api/menuSuggestion',
        input: { theme },
      });

      // Process the stream chunks as they arrive
      for await (const chunk of result.stream) {
        this.streamedText.update((prev) => prev + chunk);
      }

      // Get the final complete response
      const finalOutput = await result.output;
      console.log('Final output:', finalOutput);
    } catch (error) {
      console.error('Error streaming menu item:', error);
    } finally {
      this.isStreaming.set(false);
    }
  }
}
