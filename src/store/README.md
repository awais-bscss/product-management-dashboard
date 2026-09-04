# Architecture and State Management Guide

This document outlines the architectural patterns, state boundaries, data flow strategies, and slice configurations adopted across the Product Management application.

## State Management Architecture

The application adopts a hybrid state management model where each piece of state resides in the tool best equipped to handle its lifecycle.

### State Categories and Ownership

1. Server State (Handled by TanStack Query)
   - Scope: Remote data fetched from the API (product records, total counts, categories, brands).
   - Key responsibilities: Automatic background refetching, query caching, deduping concurrent network calls, and mutation lifecycle (optimistic updates and cache invalidation).
   - Hook implementation: `src/hooks/useProducts.js`.

2. Global Client UI State (Handled by Redux Toolkit)
   - Scope: Ephemeral client state requiring cross-component coordination.
   - Key responsibilities: Active modal dialogs, selected row IDs for batch operations, toast notification queues, and theme preferences (light/dark mode).
   - Store implementation:
     - `src/store/filtersSlice.js`: In-memory mirror of search queries, category, brand, and pagination filters.
     - `src/store/uiSlice.js`: Modal management (`modal`: 'add' | 'edit' | 'delete' | 'bulkDelete'), active `editingProduct` payload, `selectedIds` for bulk actions, and collision-free `toasts` queue.
     - `src/store/themeSlice.js`: Light and dark mode preference, synchronized with DOM `data-theme` attribute and `localStorage`.

3. URL State (Handled by React Router `useSearchParams`)
   - Scope: User intent filters, pagination numbers, category tabs, and search strings.
   - Key responsibilities: Making views bookmarkable, preserving applied filters on page reload, and supporting standard browser Back and Forward navigation history.
   - Synchronization hook: `src/hooks/useFilters.js`.

4. Local Component State (Handled by React `useState` and `useForm`)
   - Scope: Component-isolated values.
   - Key responsibilities: Form field inputs, validation errors, and local dropdown hover or toggle visibility.
   - Implementation: `src/components/Products/ProductModal.jsx` and `src/components/ui/CustomSelect.jsx`.

## Comparison Matrix

| Criteria | TanStack Query | Redux Toolkit | URL Search Params | Local Component State |
|---|---|---|---|---|
| Primary Target | Remote API records | Shared synchronous UI | Shareable navigation parameters | Transient widget state |
| Persistence | Query cache (in-memory) | Redux store (session) | Browser address bar | Component instance lifecycle |
| Source of Truth | Remote database | Client application | Browser URL location | Component virtual DOM |
| Sync Mechanism | Automated refetch and polling | Explicit Redux dispatchers | `useSearchParams` hook | React state setter |

## Data Flow and URL Synchronization

The application implements a two-way synchronization pattern between Redux and URL Search Params:

1. User Interaction: The user selects a category or types a query into the search input.
2. Synchronous Update: The `useFilters` hook dispatches an action to Redux (`filtersSlice`), immediately updating client-side controls.
3. URL Mirroring: A `useEffect` inside `useFilters` detects the state delta and serializes the state to URL query parameters via `setSearchParams(..., { replace: true })`.
4. Reload or Direct Link: When the application loads, `getInitialFiltersFromUrl()` reads the query parameters directly from `window.location.search` to seed the initial Redux state before initial data retrieval.
5. Navigation History: When the user presses the browser Back or Forward button, `useFilters` parses the altered URL parameters and dispatches corrective actions to align the Redux store.
