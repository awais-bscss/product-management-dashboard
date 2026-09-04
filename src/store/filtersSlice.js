import { createSlice } from '@reduxjs/toolkit';

function getInitialFiltersFromUrl() {
  if (typeof window === 'undefined' || !window.location.search) {
    return {
      search: '',
      category: '',
      brand: '',
      status: '',
      page: 1,
      limit: 8,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const p = parseInt(params.get('page'), 10);

  return {
    search: params.get('search') || '',
    category: params.get('category') || '',
    brand: params.get('brand') || '',
    status: params.get('status') || '',
    page: !isNaN(p) && p > 0 ? p : 1,
    limit: 8,
  };
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: getInitialFiltersFromUrl(),
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setBrand(state, action) {
      state.brand = action.payload;
      state.page = 1;
    },
    setStatus(state, action) {
      state.status = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setFiltersFromUrl(state, action) {
      return { ...state, ...action.payload };
    },
    resetFilters(state) {
      state.search   = '';
      state.category = '';
      state.brand    = '';
      state.status   = '';
      state.page     = 1;
    },
  },
});

export const {
  setSearch, setCategory, setBrand, setStatus,
  setPage, setFiltersFromUrl, resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
