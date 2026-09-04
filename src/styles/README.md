# Design System and Modular Styles

This directory contains the custom CSS design system powering the application. Styles are partitioned by functional domain to maintain clean boundaries without requiring CSS-in-JS dependencies.

## File Breakdown

- `variables.css`: Design tokens, brand colors, status indicators, typography families, border radii, and dark mode overrides.
- `base.css`: HTML element resets, box-sizing rules, body defaults, scrollbar stylings, and global keyframe animations.
- `ui.css`: Reusable component styles including button variants, status badges, toast notifications, and dropdown menus.
- `toolbar.css`: Filter bar containers, search input fields, and related input states.
- `table.css`: Data table formatting, header styling, pagination bar, and floating bulk action bar.
- `modal.css`: Full-screen modal overlays, dialog cards, headers, footers, and standardized form elements.

## Design Tokens

All colors, shadows, and radii are defined as CSS custom properties inside `variables.css`.

### Core Color Palette

- `--bg-app`: Main page background color.
- `--bg-white`: Card and modal surface background.
- `--bg-subtle`: Subtle secondary surface color for table headers and inputs.
- `--border`: Default container and input border color.
- `--border-focus`: Primary focus outline color.
- `--text-primary`: High-contrast body text.
- `--text-secondary`: Secondary descriptive text.
- `--text-muted`: Placeholder and caption text.
- `--accent`: Primary interaction brand color.
- `--accent-hover`: Hover state for primary buttons.

### Status Indicators

- `--green` / `--green-light`: Published status badge and success alerts.
- `--red` / `--red-light`: Inactive status badge, deletion triggers, and error messages.
- `--orange` / `--orange-light`: Out-of-stock badge and warning notifications.
- `--blue` / `--blue-light`: Category accents.

## Dark Mode Implementation

Dark mode uses CSS variables scoped under the attribute selector `[data-theme='dark']`:

```css
[data-theme='dark'] {
  --bg-app: #0f1117;
  --bg-white: #1a1d27;
  --bg-subtle: #22263a;
  --border: #2e3349;
  --text-primary: #f1f3f9;
  --text-secondary: #9aa0bb;
}
```

Components consume these variables directly without requiring conditional style classes in JavaScript:

```css
.card {
  background: var(--bg-white);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```

## Compilation and Bundling

All stylesheets are aggregated by `src/index.css` via standard `@import` statements:

```css
@import './styles/variables.css';
@import './styles/base.css';
@import './styles/ui.css';
@import './styles/toolbar.css';
@import './styles/table.css';
@import './styles/modal.css';
```

When building for production (`npm run build`), Vite automatically inlines and minifies all imported files into a single optimized CSS asset.
