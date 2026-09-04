import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import filtersReducer from './filtersSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filters: filtersReducer,
    theme: themeReducer,
  },
});
