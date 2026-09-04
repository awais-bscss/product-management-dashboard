import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { addToast, clearSelection } from '../store/uiSlice';

const PRODUCTS_KEY = 'products';

export function useProducts(filters) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, filters],
    queryFn: () => api.getProducts(filters),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => api.createProduct(data),

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_KEY] });
      const snapshot = queryClient.getQueriesData({ queryKey: [PRODUCTS_KEY] });

      queryClient.setQueriesData({ queryKey: [PRODUCTS_KEY] }, (old) => {
        if (!old) return old;
        const optimistic = { id: Date.now(), ...newProduct, createdAt: new Date().toISOString() };
        return { ...old, items: [optimistic, ...old.items], total: old.total + 1 };
      });

      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      dispatch(addToast({ message: 'Failed to create product', type: 'error' }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      dispatch(addToast({ message: 'Product created successfully!', type: 'success' }));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => api.updateProduct(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_KEY] });
      const snapshot = queryClient.getQueriesData({ queryKey: [PRODUCTS_KEY] });

      queryClient.setQueriesData({ queryKey: [PRODUCTS_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map(p => p.id === id ? { ...p, ...data } : p),
        };
      });

      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      dispatch(addToast({ message: 'Failed to update product', type: 'error' }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      dispatch(addToast({ message: 'Product updated!', type: 'success' }));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => api.deleteProduct(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_KEY] });
      const snapshot = queryClient.getQueriesData({ queryKey: [PRODUCTS_KEY] });

      queryClient.setQueriesData({ queryKey: [PRODUCTS_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter(p => p.id !== id),
          total: old.total - 1,
        };
      });

      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      dispatch(addToast({ message: 'Failed to delete product', type: 'error' }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      dispatch(addToast({ message: 'Product deleted', type: 'default' }));
    },
  });
}

export function useDeleteProducts() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (ids) => api.deleteProducts(ids),

    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_KEY] });
      const snapshot = queryClient.getQueriesData({ queryKey: [PRODUCTS_KEY] });

      queryClient.setQueriesData({ queryKey: [PRODUCTS_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter(p => !ids.includes(p.id)),
          total: old.total - ids.length,
        };
      });

      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      dispatch(addToast({ message: 'Bulk delete failed', type: 'error' }));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      dispatch(clearSelection());
      dispatch(addToast({ message: `${ids.length} products deleted`, type: 'default' }));
    },
  });
}
