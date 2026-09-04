# API Integration and Data Model Reference

This document describes the networking layer, data contracts, mock and seed persistence, and mutation workflows utilized by the Product Management client application.

## Client Configuration

Data requests are handled through the `api` service module in `src/services/api.js`.

- Seed Source: Fetches initial sample data from npoint storage (`https://api.npoint.io/370c3dda4019b0689bde`).
- Persistence Layer: Utilizes browser `localStorage` (`pm_products` and `pm_next_id`) so all CRUD modifications, additions, and deletions persist across page reloads and browser sessions.
- In-Memory Fallback: If network access is restricted on first load, seed data initializes safely to provide a robust demonstration.

## Data Models

### Product Schema

Each product record complies with the following structure:

```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "published" | "draft" | "inactive" | "out-stock";
  description?: string;
  createdAt?: string;
}
```

### Supported Categories

The product catalogue includes the following standard category identifiers:
- `Computers`
- `Electronics`
- `Shoes`
- `Bags`
- `Furniture`

### Supported Brands

Standard brands supported by the catalogue include:
`Apple`, `Lenovo`, `Beats`, `Nike`, `Amazon`, `Diro`, `Arlime`, `The North Face`, `Sony`, `Adidas`, and `Canon`.

### Status Definitions

- `published`: Product is actively displayed and available for customer purchases.
- `draft`: Product is under internal review and not visible on storefronts.
- `inactive`: Product has been archived or temporarily withdrawn.
- `out-stock`: Inventory counter is zero or below reserve thresholds.

## Endpoints and Methods

All methods are exposed via the `api` export in `src/services/api.js`:

### 1. Fetch Products

- Method: `api.getProducts({ search, category, brand, status, page, limit })`
- Parameters:
  - `search` (string): Search query matching product name, category, brand, or ID.
  - `category` (string): Category filter. Pass empty string to bypass.
  - `brand` (string): Brand filter. Pass empty string to bypass.
  - `status` (string): Status filter. Pass empty string to bypass.
  - `page` (number): 1-indexed target page number (defaults to 1).
  - `limit` (number): Number of rows per page (defaults to 8).
- Response Format:
  ```json
  {
    "items": [ ... ],
    "total": 24,
    "page": 1,
    "limit": 8,
    "totalPages": 3
  }
  ```

### 2. Create Product

- Method: `api.createProduct(productData)`
- Request Body: Partial or full product fields excluding `id` and `createdAt`.
- Response: Newly created product record with an auto-incremented integer `id` and ISO date string.

### 3. Update Product

- Method: `api.updateProduct(id, productData)`
- Parameters: Target record `id`.
- Request Body: Updated fields.
- Response: The updated product record.

### 4. Delete Product

- Method: `api.deleteProduct(id)`
- Parameters: Target record `id`.
- Response: `{ success: true }`.

### 5. Batch Delete Products

- Method: `api.deleteProducts(ids)`
- Parameters: Array of target numeric `ids`.
- Response: `{ success: true }`.

### 6. Meta Helpers

- `api.getCategories()`: Returns the static array of product categories.
- `api.getBrands()`: Returns the static array of supported brand names.

## TanStack Query Integration

Methods from `src/services/api.js` are consumed via React Query hooks inside `src/hooks/useProducts.js`:

- Query Key Convention: `['products', filters]` caches data against current search, category, status, brand, and pagination params.
- Automated Invalidation: All mutation hooks (`useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`, `useDeleteProducts`) call `queryClient.invalidateQueries({ queryKey: ['products'] })` to synchronize the UI immediately.
