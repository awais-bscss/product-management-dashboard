import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  setSearch, setCategory, setBrand, setStatus,
  setPage, setFiltersFromUrl, resetFilters, selectFilters,
} from '../store/filtersSlice';

export function useFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingUrlRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search)   params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.brand)    params.set('brand', filters.brand);
    if (filters.status)   params.set('status', filters.status);
    if (filters.page > 1) params.set('page', String(filters.page));

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      isUpdatingUrlRef.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }

    const p = parseInt(searchParams.get('page'), 10);
    const fromUrl = {
      search:   searchParams.get('search')   || '',
      category: searchParams.get('category') || '',
      brand:    searchParams.get('brand')    || '',
      status:   searchParams.get('status')   || '',
      page:     !isNaN(p) && p > 0 ? p : 1,
    };

    if (
      fromUrl.search !== filters.search ||
      fromUrl.category !== filters.category ||
      fromUrl.brand !== filters.brand ||
      fromUrl.status !== filters.status ||
      fromUrl.page !== filters.page
    ) {
      dispatch(setFiltersFromUrl(fromUrl));
    }
  }, [searchParams]);

  const updateSearch   = (v) => dispatch(setSearch(v));
  const updateCategory = (v) => dispatch(setCategory(v));
  const updateBrand    = (v) => dispatch(setBrand(v));
  const updateStatus   = (v) => dispatch(setStatus(v));
  const updatePage     = (v) => dispatch(setPage(v));
  const reset          = ()  => dispatch(resetFilters());

  return { filters, updateSearch, updateCategory, updateBrand, updateStatus, updatePage, reset };
}
