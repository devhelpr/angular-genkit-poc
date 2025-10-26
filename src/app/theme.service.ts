import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Theme {
  id: string;
  name: string;
  fileName: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly availableThemes: Theme[] = [
    {
      id: 'dark-teal',
      name: 'Dark Teal',
      fileName: 'dark-teal.scss',
      description: 'Modern dark theme with teal accents',
    },
    {
      id: 'light-teal',
      name: 'Light Teal',
      fileName: 'light-teal.scss',
      description: 'Clean light theme with teal accents',
    },
    {
      id: 'modern-orange',
      name: 'Modern Orange',
      fileName: 'modern-orange.scss',
      description: 'Vibrant dark theme with orange accents',
    },
    {
      id: 'modern-purple',
      name: 'Modern Purple',
      fileName: 'modern-purple.scss',
      description: 'Elegant dark theme with purple accents',
    },
    {
      id: 'modern-red',
      name: 'Modern Red',
      fileName: 'modern-red.scss',
      description: 'Bold dark theme with red accents',
    },
  ];

  currentTheme = signal<Theme>(this.availableThemes[0]);

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const savedThemeId = localStorage.getItem(this.STORAGE_KEY);
    if (savedThemeId) {
      const theme = this.availableThemes.find((t) => t.id === savedThemeId);
      if (theme) {
        this.currentTheme.set(theme);
        this.applyTheme(theme);
        return;
      }
    }
    // Apply default theme
    this.applyTheme(this.currentTheme());
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme.id);
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }
    // Remove all theme classes
    document.body.classList.remove(...this.availableThemes.map((t) => `theme-${t.id}`));
    // Add the selected theme class
    document.body.classList.add(`theme-${theme.id}`);
  }
}
