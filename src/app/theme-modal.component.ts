import { Component, ElementRef, ViewChild, inject, AfterViewInit } from '@angular/core';
import { ThemeService, Theme } from './theme.service';

@Component({
  selector: 'app-theme-modal',
  standalone: true,
  template: `
    <dialog #themeDialog class="theme-dialog">
      <div class="dialog-header">
        <h2>🎨 Choose Your Theme</h2>
        <button class="close-btn" (click)="closeDialog()" aria-label="Close">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <div class="theme-grid">
          @for (theme of themeService.availableThemes; track theme.id) {
          <button
            class="theme-card"
            [class.active]="theme.id === themeService.currentTheme().id"
            (click)="selectTheme(theme)"
          >
            <div class="theme-preview theme-preview-{{ theme.id }}">
              <div class="preview-circles">
                <span class="circle circle-1"></span>
                <span class="circle circle-2"></span>
                <span class="circle circle-3"></span>
              </div>
            </div>
            <div class="theme-info">
              <h3>{{ theme.name }}</h3>
              <p>{{ theme.description }}</p>
            </div>
            @if (theme.id === themeService.currentTheme().id) {
            <div class="active-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"
                />
              </svg>
            </div>
            }
          </button>
          }
        </div>
      </div>

      <div class="dialog-footer">
        <button class="secondary-btn" (click)="closeDialog()">Close</button>
      </div>
    </dialog>

    <button class="theme-toggle-fab" (click)="openDialog()" aria-label="Change theme">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  `,
  styles: [
    `
      .theme-toggle-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: var(--radius-full);
        background: var(--color-primary);
        color: var(--color-bg-primary);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px var(--color-primary-alpha-40);
        transition: var(--transition-base);
        z-index: var(--z-dropdown);

        &:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 6px 30px var(--color-primary-alpha-60);
        }

        &:active {
          transform: scale(0.95) rotate(90deg);
        }

        svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
      }

      .theme-dialog {
        border: none;
        border-radius: var(--radius-xl);
        padding: 0;
        max-width: 800px;
        width: 90vw;
        background: var(--color-bg-card);
        backdrop-filter: blur(20px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px var(--color-primary-alpha-20);
        border: 1px solid var(--color-border-card);
        color: var(--color-text-primary);

        &::backdrop {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-xl);
          border-bottom: 1px solid var(--color-border-default);

          h2 {
            font-size: var(--font-size-2xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
            margin: 0;
            text-shadow: var(--shadow-text);
          }

          .close-btn {
            background: transparent;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-md);
            transition: var(--transition-base);
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
              background: var(--color-primary-alpha-10);
              color: var(--color-primary);
            }
          }
        }

        .dialog-content {
          padding: var(--spacing-xl);
          max-height: 60vh;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background: var(--color-primary-alpha-05);
            border-radius: var(--radius-full);
          }

          &::-webkit-scrollbar-thumb {
            background: var(--color-primary-alpha-30);
            border-radius: var(--radius-full);

            &:hover {
              background: var(--color-primary-alpha-50);
            }
          }
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--spacing-lg);
        }

        .theme-card {
          background: var(--color-primary-alpha-05);
          border: 2px solid var(--color-border-default);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: var(--transition-base);
          position: relative;
          text-align: left;
          overflow: hidden;

          &:hover {
            border-color: var(--color-primary);
            transform: translateY(-4px);
            box-shadow: 0 8px 25px var(--color-primary-alpha-30);
          }

          &.active {
            border-color: var(--color-primary);
            background: var(--color-primary-alpha-10);
            box-shadow: 0 0 20px var(--color-primary-alpha-40);
          }

          .theme-preview {
            height: 80px;
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-md);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;

            .preview-circles {
              display: flex;
              gap: var(--spacing-sm);
              z-index: 2;

              .circle {
                width: 20px;
                height: 20px;
                border-radius: var(--radius-full);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              }
            }
          }

          .theme-preview-dark-teal {
            background: linear-gradient(135deg, #000000 0%, #0f766e 100%);
            .circle-1 {
              background: #14b8a6;
            }
            .circle-2 {
              background: #5eead4;
            }
            .circle-3 {
              background: #0d9488;
            }
          }

          .theme-preview-light-teal {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            .circle-1 {
              background: #14b8a6;
            }
            .circle-2 {
              background: #0d9488;
            }
            .circle-3 {
              background: #2dd4bf;
            }
          }

          .theme-preview-modern-orange {
            background: linear-gradient(135deg, #000000 0%, #9a3412 100%);
            .circle-1 {
              background: #f97316;
            }
            .circle-2 {
              background: #fb923c;
            }
            .circle-3 {
              background: #ea580c;
            }
          }

          .theme-preview-modern-purple {
            background: linear-gradient(135deg, #000000 0%, #6b21a8 100%);
            .circle-1 {
              background: #a855f7;
            }
            .circle-2 {
              background: #c084fc;
            }
            .circle-3 {
              background: #9333ea;
            }
          }

          .theme-preview-modern-red {
            background: linear-gradient(135deg, #000000 0%, #991b1b 100%);
            .circle-1 {
              background: #ef4444;
            }
            .circle-2 {
              background: #f87171;
            }
            .circle-3 {
              background: #dc2626;
            }
          }

          .theme-info {
            h3 {
              font-size: var(--font-size-lg);
              font-weight: var(--font-weight-semibold);
              color: var(--color-text-primary);
              margin-bottom: var(--spacing-xs);
            }

            p {
              font-size: var(--font-size-sm);
              color: var(--color-text-secondary);
              line-height: 1.4;
            }
          }

          .active-indicator {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            color: var(--color-primary);
            animation: scaleIn 0.3s ease-out;
          }
        }

        .dialog-footer {
          padding: var(--spacing-lg) var(--spacing-xl);
          border-top: 1px solid var(--color-border-default);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-sm);

          button {
            padding: 12px 24px;
            border-radius: var(--radius-md);
            font-size: var(--font-size-base);
            font-weight: var(--font-weight-semibold);
            cursor: pointer;
            transition: var(--transition-base);
            border: none;

            &.secondary-btn {
              background: var(--color-primary-alpha-10);
              color: var(--color-primary);
              border: 2px solid var(--color-primary-alpha-30);

              &:hover {
                background: var(--color-primary-alpha-20);
                border-color: var(--color-primary);
              }
            }
          }
        }
      }

      @keyframes scaleIn {
        from {
          transform: scale(0);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @media (max-width: 640px) {
        .theme-dialog {
          width: 95vw;

          .theme-grid {
            grid-template-columns: 1fr;
          }
        }

        .theme-toggle-fab {
          bottom: 16px;
          right: 16px;
          width: 48px;
          height: 48px;
        }
      }
    `,
  ],
})
export class ThemeModalComponent implements AfterViewInit {
  @ViewChild('themeDialog') dialog!: ElementRef<HTMLDialogElement>;
  themeService = inject(ThemeService);

  ngAfterViewInit() {
    // Handle backdrop clicks to close dialog
    this.dialog.nativeElement.addEventListener('click', (event) => {
      const rect = this.dialog.nativeElement.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        this.closeDialog();
      }
    });
  }

  openDialog(): void {
    this.dialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
