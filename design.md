# Design Documentation

## Architecture

The application follows a simple page-based architecture with React Router handling client-side navigation.

```
App (React Router)
├── Layout (sidebar shell)
│   ├── Navigation (sidebar nav links)
│   ├── UserSwitcher
│   ├── ThemeToggle
│   └── <Outlet /> (page content)
│       ├── Dashboard
│       ├── NOC
│       ├── LOA
│       ├── Finance
│       ├── Rental
│       └── Cancellation
```

### Component Tree

- **App.jsx** — Root component; configures React Router routes
- **Layout.jsx** — Persistent shell with sidebar navigation, user switcher, and theme toggle
- **ThemeToggle.jsx** — Cycles between light, dark, and high-contrast themes

## Theming System

The app uses CSS custom properties (variables) for theming. Three theme classes are defined:

| Class | Description |
|-------|-------------|
| (none — default) | Light theme |
| `.dark-theme` | Dark theme with reduced contrast |
| `.high-contrast-theme` | High-contrast accessibility theme |

Themes are applied by toggling a class on `<html>`. All component styles reference CSS variables (`--color-bg`, `--color-text`, etc.), so switching theme classes automatically updates the entire UI.

### CSS Variable Reference

| Variable | Light | Dark | High Contrast |
|----------|-------|------|---------------|
| `--color-bg` | `#f5f7fa` | `#0f172a` | `#000000` |
| `--color-sidebar` | `#1a1d23` | `#1e293b` | `#000000` |
| `--color-primary` | `#3b82f6` | `#3b82f6` | `#ffff00` |
| `--color-text` | `#1e293b` | `#f1f5f9` | `#ffffff` |
| `--color-border` | `#e2e8f0` | `#334155` | `#ffffff` |

### High Contrast Theme

The high-contrast theme prioritizes accessibility:
- Pure black background (`#000000`) with pure white text (`#ffffff`)
- Yellow (`#ffff00`) for primary interactive elements
- Thick borders (`2px`–`3px`) on all interactive components
- High-contrast status badges with doubled border widths
- Removed box shadows in favor of clear borders

## Persistence

Theme preference is stored in `localStorage` under the key `theme`. On first visit (no saved preference), the app respects the system's `prefers-color-scheme` media query.

## Routing

Routes are defined in `App.jsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Summary cards and activity feed |
| `/:entity` | EntityPage | List and detail views per department |

## State Management

There is no global state library. Each page fetches data on mount via the API client in `src/api.js`. The Layout component fetches the user list for the switcher dropdown.
