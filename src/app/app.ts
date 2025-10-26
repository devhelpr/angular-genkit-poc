import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuSuggestionService } from './menu-suggestion.service';
import { ThemeModalComponent } from './theme-modal.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ThemeModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private menuSuggestionService = inject(MenuSuggestionService);

  menuInput = '';
  selectedModel: 'gemini' | 'ollama' = 'gemini';
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

      const result = await this.menuSuggestionService.generateMenuItem(theme, this.selectedModel);
      console.log('Generated result:', result);
      this.generatedMenuItem.set(result);
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
      await this.menuSuggestionService.streamMenuItem(theme, this.selectedModel, (chunk) => {
        this.streamedText.update((prev) => prev + chunk);
      });
    } catch (error) {
      console.error('Error streaming menu item:', error);
      this.streamedText.set('Error occurred while streaming. Please try again.');
    } finally {
      this.isStreaming.set(false);
    }
  }
}
