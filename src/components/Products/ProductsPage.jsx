import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Plus, Sun, Moon, FileText,
  Search, RefreshCw, Package,
} from 'lucide-react';

import { openModal, toggleSelect, selectAll, clearSelection } from '../../store/uiSlice';

import { toggleTheme, selectTheme } from '../../store/themeSlice';
import { useFilters } from '../../hooks/useFilters';
import { useProducts } from '../../hooks/useProducts';
import { api } from '../../services/api';
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';
import StateDocumentModal from './StateDocumentModal';
import BulkActionBar from './BulkActionBar';
import Pagination from '../ui/Pagination';
import ProductTableSkeleton from './ProductTableSkeleton';
import { PRODUCT_TABS, STATUS_TAB_MAP } from '../../utils/constants';
import CustomSelect from '../ui/CustomSelect';
import { useDebounce } from '../../hooks/useDebounce';


export default function ProductsPage() {
  const dispatch = useDispatch();

  const selectedIds  = useSelector(s => s.ui.selectedIds);
  const isModalOpen  = useSelector(s => s.ui.modal !== null);
  const themeMode    = useSelector(selectTheme);
  const [stateDocOpen, setStateDocOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen || stateDocOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen, stateDocOpen]);

  const { filters, updateSearch, updateCategory, updateBrand, updateStatus, updatePage, reset } = useFilters();
  const { data, isLoading, isFetching, error, refetch } = useProducts(filters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateSearch(debouncedSearch);
    }
  }, [debouncedSearch, filters.search, updateSearch]);

  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    refetch();
    setTimeout(() => setIsRotating(false), 950);
  };

  useEffect(() => {
    dispatch(clearSelection());
  }, [filters.page, filters.search, filters.category, filters.brand, filters.status, dispatch]);

  useEffect(() => {
    if (data?.totalPages && data.totalPages > 0 && filters.page > data.totalPages) {
      updatePage(data.totalPages);
    }
  }, [data?.totalPages, filters.page, updatePage]);

  const categories = api.getCategories();
  const brands = api.getBrands();

  const handleSelect = (id) => dispatch(toggleSelect(id));
  const handleSelectAll = (ids) => dispatch(selectAll(ids));

  const activeTab = Object.entries(STATUS_TAB_MAP).find(([, v]) => v === filters.status)?.[0] || 'All';

  const handleTabChange = (tab) => {
    updateStatus(STATUS_TAB_MAP[tab]);
  };

  const products = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="page" id="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage inventory, pricing and availability across your store</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline btn-icon"
            onClick={() => dispatch(toggleTheme())}
            id="theme-toggle-btn"
            title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            style={{ borderRadius: 'var(--radius)' }}
          >
            {themeMode === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <button
            className="btn btn-outline"
            onClick={() => setStateDocOpen(true)}
            id="state-doc-btn"
            title="View State Decision Document"
          >
            <FileText size={14} /> State Decision Doc
          </button>

          <button
            className="btn btn-primary"
            onClick={() => dispatch(openModal({ type: 'add' }))}
            id="add-product-btn"
          >
            <Plus size={14} /> Add product
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search size={14} className="s-icon" />
          <input
            id="product-search"
            type="text"
            placeholder="Search by name, brand, category or ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {(filters.search || filters.category || filters.brand) && (
          <button className="btn btn-outline btn-sm" onClick={reset} id="clear-filters-btn" style={{ height: 36 }}>
            Clear filters
          </button>
        )}

        <div className="toolbar-right">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleRefresh}
            id="refresh-btn"
            style={{ height: 36 }}
            title="Refresh"
          >
            <RefreshCw size={13} className={isRotating || isFetching ? 'icon-rotate' : ''} />
            <span>Refresh</span>
          </button>

          <div style={{ width: 140 }}>
            <CustomSelect
              id="category-filter"
              value={filters.category}
              onChange={updateCategory}
              options={categories}
              placeholder="Category"
            />
          </div>

          <div style={{ width: 150 }}>
            <CustomSelect
              id="brand-filter"
              value={filters.brand}
              onChange={updateBrand}
              options={brands}
              placeholder="Brand"
            />
          </div>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {PRODUCT_TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => handleTabChange(tab)}
            id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '20px', background: 'var(--red-light)', borderRadius: 'var(--radius)', border: '1px solid #fca5a5', color: 'var(--red)', marginBottom: 16 }}>
          Failed to load products. <button onClick={() => refetch()} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {isLoading ? (
        <ProductTableSkeleton />
      ) : products.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <Package size={48} className="empty-state-icon" />
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-desc">
              {filters.search || filters.category || filters.brand || filters.status
                ? 'Try adjusting your filters.'
                : 'Add your first product to get started.'}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => dispatch(openModal({ type: 'add' }))}
              style={{ marginTop: 8 }}
            >
              <Plus size={14} /> Add product
            </button>
          </div>
        </div>
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      {!isLoading && total > 0 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          limit={filters.limit}
          onPage={updatePage}
        />
      )}

      <ProductModal />
      <DeleteModal />
      {stateDocOpen && <StateDocumentModal onClose={() => setStateDocOpen(false)} />}

      <BulkActionBar />
    </div>
  );
}
