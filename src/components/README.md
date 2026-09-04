# Component Catalog and UI Architecture

This directory houses all user interface components for the application, split cleanly between domain-specific feature components and shared reusable UI primitives.

## Directory Organization

```text
components/
├── Products/             Feature-specific components for the product catalogue
│   ├── BulkActionBar.jsx
│   ├── DeleteModal.jsx
│   ├── ProductModal.jsx
│   ├── ProductTable.jsx
│   ├── ProductTableSkeleton.jsx
│   ├── ProductsPage.jsx
│   └── StateDocumentModal.jsx
└── ui/                   Generic, reusable UI primitives
    ├── CustomSelect.jsx
    ├── Pagination.jsx
    └── ToastContainer.jsx
```

## Feature Components (Products)

### ProductsPage.jsx

The top-level container component for product administration.
- Coordinates search input, filter dropdowns, and category tabs.
- Connects to `useProducts` for data fetching and `useFilters` for URL parameter synchronization.
- Renders the product table or empty state, and triggers modal overlays based on user actions.

### ProductTable.jsx

Renders tabular product information.
- Supports individual checkbox selection, row hover states, category pill badges, and status pills.
- Features an inline action dropdown menu for editing, viewing, and deleting specific records.

### ProductModal.jsx

The primary CRUD dialog used for adding new products and editing existing ones.
- Integrates with React Hook Form for client-side form validation.
- Validates required fields, positive numeric prices, optional original prices, stock quantities, and descriptions.
- Dispatches create or update mutations via TanStack Query hooks.

### DeleteModal.jsx

A dedicated confirmation modal to prevent accidental data loss.
- Displays target product details or the count of selected items for bulk deletion.
- Emits confirmation events to initiate deletion mutations.

### BulkActionBar.jsx

A floating bar that appears when one or more rows are selected.
- Shows total count of selected products.
- Provides quick access to batch actions such as deleting all selected records.
- Includes a dismiss trigger to clear the selection state via Redux.

### ProductTableSkeleton.jsx

A skeleton loader mimicking the layout of the product table rows.
- Displayed during initial data queries and page transitions to minimize layout shifts.

## Reusable UI Primitives (ui)

### CustomSelect.jsx

A fully customizable dropdown select component replacing native browser selects.
- Props:
  - `value` (string): Currently selected option value.
  - `onChange` (function): Callback invoked when an option is selected.
  - `options` (array): Array of strings or `{ value, label, color }` objects.
  - `placeholder` (string): Default text when no option is selected.
  - `id` (string): DOM identifier for testing and label association.
- Features: Automatic click-outside dismissal and custom badge dot rendering for status indicators.

### Pagination.jsx

A generic numbered pagination widget.
- Props:
  - `page` (number): Active page index (1-based).
  - `totalPages` (number): Total calculated page count.
  - `onPageChange` (function): Callback invoked when a page number or directional button is clicked.
  - `totalItems` (number): Total count of records across the dataset.
  - `pageSize` (number): Number of rows displayed per page.

### ToastContainer.jsx

Floating notification portal positioned at the bottom right of the viewport.
- Subscribes to the Redux `uiSlice` toast queue.
- Automatically dismisses toasts after their duration expires or on manual close.
