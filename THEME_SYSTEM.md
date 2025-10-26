# Theme System Documentation

## Overview
The application now supports multiple color themes that can be selected through a modern modal dialog interface. Theme preferences are persisted in localStorage.

## Available Themes
1. **Dark Teal** - Modern dark theme with teal accents (default)
2. **Light Teal** - Clean light theme with teal accents
3. **Modern Orange** - Vibrant dark theme with orange accents
4. **Modern Purple** - Elegant dark theme with purple accents
5. **Modern Red** - Bold dark theme with red accents

## File Structure
```
src/
├── app/
│   ├── theme.service.ts           # Theme management service
│   ├── theme-modal.component.ts   # Theme selection modal
│   └── app.ts                      # Updated to include theme modal
└── styles/
    ├── themes/
    │   ├── dark-teal.scss         # Dark teal theme variables
    │   ├── light-teal.scss        # Light teal theme variables
    │   ├── modern-orange.scss     # Modern orange theme variables
    │   ├── modern-purple.scss     # Modern purple theme variables
    │   └── modern-red.scss        # Modern red theme variables
    └── styles.scss                # Global styles with theme imports
```

## Features
- **Theme Modal Dialog**: Native HTML5 `<dialog>` element with modern styling
- **Floating Action Button (FAB)**: Bottom-right theme toggle button
- **Theme Preview Cards**: Visual previews of each theme with gradient backgrounds
- **LocalStorage Persistence**: Theme selection is saved and restored across sessions
- **SSR Compatible**: Uses platform detection to ensure compatibility with server-side rendering
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Changing Themes
1. Click the sun/theme icon button in the bottom-right corner
2. Select your preferred theme from the modal dialog
3. The theme is applied immediately and saved to localStorage

### Adding New Themes
To add a new theme:

1. Create a new SCSS file in `src/styles/themes/` (e.g., `new-theme.scss`)
2. Define CSS custom properties for the theme:
```scss
.theme-new-theme {
  --color-primary: #yourcolor;
  --color-primary-dark: #yourcolor;
  --color-primary-light: #yourcolor;
  
  /* Define all other required CSS variables */
  /* See existing theme files for complete list */
}
```

3. Add the theme to `ThemeService.availableThemes` array in `src/app/theme.service.ts`:
```typescript
{
  id: 'new-theme',
  name: 'New Theme',
  fileName: 'new-theme.scss',
  description: 'Description of your theme'
}
```

4. Import the new theme in `src/styles.scss`:
```scss
@use './styles/themes/new-theme.scss';
```

5. Add a preview gradient in `theme-modal.component.ts` styles:
```scss
.theme-preview-new-theme {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
  .circle-1 { background: #accent1; }
  .circle-2 { background: #accent2; }
  .circle-3 { background: #accent3; }
}
```

## CSS Variables
Each theme must define the following CSS custom properties:

### Color Variables
- `--color-primary`: Primary theme color
- `--color-primary-dark`: Darker variant of primary
- `--color-primary-light`: Lighter variant of primary
- `--color-primary-alpha-XX`: Primary color with opacity (05, 08, 10, 15, 20, 30, 40, 50, 60, 90)

### Background Colors
- `--color-bg-primary`: Main background
- `--color-bg-card`: Card/panel background
- `--color-bg-input`: Input field background
- `--color-bg-input-hover`: Input hover state
- `--color-bg-input-focus`: Input focus state

### Text Colors
- `--color-text-primary`: Primary text color
- `--color-text-secondary`: Secondary text color
- `--color-text-placeholder`: Placeholder text
- `--color-text-label`: Label text color

### Border Colors
- `--color-border-default`: Default border color
- `--color-border-hover`: Hover state border
- `--color-border-focus`: Focus state border
- `--color-border-card`: Card border color

### Shadows
- `--shadow-sm`: Small shadow
- `--shadow-md`: Medium shadow
- `--shadow-lg`: Large shadow
- `--shadow-xl`: Extra large shadow
- `--shadow-glow`: Glow effect
- `--shadow-text`: Text shadow effect

## Technical Details

### ThemeService
The `ThemeService` manages theme state and persistence:
- Uses Angular signals for reactive theme updates
- Detects browser platform to avoid SSR issues
- Applies theme by adding/removing CSS classes on `document.body`
- Stores selected theme ID in localStorage

### Theme Modal Component
The standalone `ThemeModalComponent`:
- Uses native HTML5 `<dialog>` element
- Provides visual theme previews with gradient backgrounds
- Handles backdrop clicks to close
- Displays active theme indicator
- Fully responsive design

## Browser Support
- Modern browsers with CSS custom properties support
- HTML5 dialog element (Chrome 37+, Firefox 98+, Safari 15.4+)
- LocalStorage API
