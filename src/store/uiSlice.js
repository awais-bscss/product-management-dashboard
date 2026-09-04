import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedIds: [],
    modal: null,
    editingProduct: null,
    toasts: [],
  },
  reducers: {
    toggleSelect(state, action) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAll(state, action) {
      state.selectedIds = action.payload;
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    openModal(state, action) {
      state.modal = action.payload.type;
      state.editingProduct = action.payload.product || null;
    },
    closeModal(state) {
      state.modal = null;
      state.editingProduct = null;
    },
    addToast(state, action) {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      state.toasts.push({ id, ...action.payload });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  toggleSelect, selectAll, clearSelection,
  openModal, closeModal, addToast, removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
