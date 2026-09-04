# Product Management Dashboard

A modern, responsive product management web application built with React, Redux Toolkit, TanStack Query, and Vite. The application provides end-to-end product administration, including search, multi-criteria filtering, pagination, bulk operations, and full CRUD capability with optimistic UI feedback.

## Features

- Complete CRUD Operations: Create, view, update, and delete products with real-time UI updates.
- Robust Filtering and Search: Instant client and server filtering by search query, category, status, and price ranges.
- URL Query Synchronization: Synchronizes active search and filter states with browser query parameters for shareable links and navigation history.
- Dual-Layer State Architecture: Combines TanStack Query for asynchronous server state with Redux Toolkit for synchronous client UI states.
- Bulk Actions: Select individual items or entire datasets to perform multi-item batch deletions.
- Optimistic Updates and Cache Invalidation: Instant visual updates on mutations with background cache synchronization.
- Responsive and Accessible Design: Custom CSS design system with light and dark mode support, accessible forms, and loading skeleton states.
- Modular Styling: Domain-partitioned CSS architecture for scalable maintenance.

## Technology Stack

- Core Framework: React 19
- Build Tool: Vite 8
- Client State Management: Redux Toolkit and React Redux
- Server State and Caching: TanStack React Query
- Form Management: React Hook Form
- Routing: React Router DOM
- HTTP Client: Native Fetch API
- Icons: Lucide React
- Code Quality: Oxlint

## Project Structure

```text
src/
├── components/
│   ├── Products/
│   │   ├── BulkActionBar.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── ProductModal.jsx
│   │   ├── ProductTable.jsx
│   │   ├── ProductTableSkeleton.jsx
│   │   ├── ProductsPage.jsx
│   │   └── StateDocumentModal.jsx
│   └── ui/
│       ├── CustomSelect.jsx
│       ├── Pagination.jsx
│       └── ToastContainer.jsx
├── hooks/
│   ├── useDebounce.js
│   ├── useFilters.js
│   └── useProducts.js
├── layouts/
│   └── RootLayout.jsx
├── services/
│   └── api.js
├── store/
│   ├── filtersSlice.js
│   ├── index.js
│   ├── themeSlice.js
│   └── uiSlice.js
├── styles/
│   ├── base.css
│   ├── modal.css
│   ├── table.css
│   ├── toolbar.css
│   ├── ui.css
│   └── variables.css
├── utils/
│   └── constants.js
├── App.jsx
├── index.css
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or later)
- npm (version 9.0.0 or later)

### Installation

1. Clone the repository or navigate to the project root directory.
2. Install all dependencies:

```bash
npm install
```

### Development Server

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the application for production deployment:

```bash
npm run build
```

This compiles all React components and bundles the modular CSS stylesheets into a minified, production-ready asset distribution in the `dist` folder.

To preview the generated production build locally:

```bash
npm run preview
```

### Code Quality and Linting

Run Oxlint to check code quality and detect syntax or logic problems:

```bash
npm run lint
```

## Additional Documentation

For module-specific documentation, refer to the README files located directly alongside their code:

- [Architecture and State Management](src/store/README.md): Detailed breakdown of the state management strategy, caching mechanisms, and data flow.
- [API Integration and Data Models](src/services/README.md): Specification of API endpoints, mock data fallback, and network layer configuration.
- [Component Catalog and UI Architecture](src/components/README.md): Breakdown of feature components, reusable primitives, and prop contracts.
- [Design System and Modular Styles](src/styles/README.md): Guide to design tokens, dark mode implementation, and modular CSS conventions.
