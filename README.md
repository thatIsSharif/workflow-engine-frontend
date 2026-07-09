# Workflow Engine Frontend

A React-based frontend application for managing workflow approvals across multiple departments (NOC, LOA, Finance, Rental, Cancellation).

## Features

- **Multi-department workflow management** — Create and track approval requests across departments
- **Dark/Light/High Contrast themes** — Toggle between three visual themes with persistent preference
- **Role-based views** — Different views and actions based on user roles (admin, officer, controller, finance, head)
- **Activity feed** — Real-time visibility into all workflow actions
- **History timeline** — Detailed audit trail for each entity

## Tech Stack

- **React 18** with React Router v6
- **Vite** for build tooling
- **Plain CSS** with CSS custom properties for theming

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Layout.jsx        # App shell with sidebar navigation
│   └── ThemeToggle.jsx   # Theme switcher component
├── pages/          # Route-level page components
├── api.js          # API client
├── App.jsx         # Root component with routing
├── main.jsx        # Entry point
└── index.css       # Global styles and theme definitions
```

## Themes

The application supports three themes that cycle on each toggle click:

| Theme | Description |
|-------|-------------|
| Light | Default light mode with subtle grays |
| Dark | Dark mode with reduced blue light |
| High Contrast | Black/white palette with thick borders for accessibility |

Theme preference is persisted in `localStorage` and respects system `prefers-color-scheme` on first visit.

## API

The app communicates with a backend workflow engine API. Configure the base URL in `src/api.js`.