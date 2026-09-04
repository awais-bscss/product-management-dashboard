import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { X, AlertCircle } from 'lucide-react';
import { closeModal } from '../../store/uiSlice';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { api } from '../../services/api';
import CustomSelect from '../ui/CustomSelect';

const STATUSES = [
  { value: 'published',  label: 'Published',    color: '#10b981' },
  { value: 'inactive',   label: 'Inactive',     color: '#ef4444' },
  { value: 'draft',      label: 'Draft',        color: '#9ca3af' },
  { value: 'out-stock',  label: 'Out of Stock', color: '#f59e0b' },
];

const DEFAULT_FORM = {
  name: '',
  category: '',
  brand: '',
  price: '',
  originalPrice: '',
  stock: '',
  status: 'draft',
  description: '',
};

function Field({ label, error, children }) {
  const hasAsterisk = label.endsWith(' *');
  const labelText = hasAsterisk ? label.slice(0, -2) : label;

  return (
    <div className="form-group">
      <label className="form-label">
        {labelText} {hasAsterisk && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
      {error && (
        <span style={{ fontSize: 11.5, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

export default function ProductModal() {
  const dispatch = useDispatch();
  const { modal, editingProduct } = useSelector(s => s.ui);
  const isEdit = modal === 'edit';

  const categories = api.getCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_FORM,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const currentStatus = watch('status');

  useEffect(() => {
    if (isEdit && editingProduct) {
      reset({
        name:          editingProduct.name          || '',
        category:      editingProduct.category      || '',
        brand:         editingProduct.brand         || '',
        price:         editingProduct.price !== undefined ? String(editingProduct.price) : '',
        originalPrice: editingProduct.originalPrice !== undefined ? String(editingProduct.originalPrice) : '',
        stock:         editingProduct.stock !== undefined ? String(editingProduct.stock) : '',
        status:        editingProduct.status        || 'draft',
        description:   editingProduct.description   || '',
      });
    } else {
      reset(DEFAULT_FORM);
    }
  }, [modal, editingProduct, isEdit, reset]);

  if (modal !== 'add' && modal !== 'edit') return null;

  const onSubmit = async (values) => {
    const data = {
      ...values,
      name:          values.name?.trim() || '',
      brand:         values.brand?.trim() || '',
      price:         Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : Number(values.price),
      stock:         Number(values.stock),
    };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      dispatch(closeModal());
    } catch {
      // Error is handled by mutation onError callback
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && dispatch(closeModal())}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ maxWidth: 580 }}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="modal-title" style={{ marginBottom: 2 }}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              {isEdit ? 'Update the product details below' : 'Fill in the details to add a new product'}
            </p>
          </div>
          <button
            className="modal-close"
            onClick={() => dispatch(closeModal())}
            aria-label="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body" style={{ gap: 14 }}>

            <Field label="Product Name *" error={errors.name?.message}>
              <input
                id="product-name"
                className="form-input"
                placeholder="e.g. MacBook Pro M3"
                {...register('name', {
                  required: 'Product name is required',
                  validate: (v) => !!v.trim() || 'Product name is required',
                })}
                autoFocus
              />
            </Field>

            <div className="form-row">
              <Field label="Category *" error={errors.category?.message}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <CustomSelect
                      id="product-category"
                      value={field.value}
                      onChange={field.onChange}
                      options={categories}
                      placeholder="Select category"
                    />
                  )}
                />
              </Field>

              <Field label="Brand *" error={errors.brand?.message}>
                <input
                  id="product-brand"
                  className="form-input"
                  placeholder="e.g. Apple"
                  {...register('brand', {
                    required: 'Brand is required',
                    validate: (v) => !!v.trim() || 'Brand is required',
                  })}
                />
              </Field>
            </div>

            <div className="form-row">
              <Field label="Selling Price ($) *" error={errors.price?.message}>
                <input
                  id="product-price"
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price', {
                    required: 'Enter a valid price',
                    validate: (v) => (!isNaN(Number(v)) && Number(v) >= 0 && v !== '') || 'Enter a valid price',
                  })}
                />
              </Field>

              <Field label="Original Price ($)" error={errors.originalPrice?.message}>
                <input
                  id="product-original-price"
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register('originalPrice', {
                    validate: (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0) || 'Enter a valid original price',
                  })}
                />
              </Field>
            </div>

            <div className="form-row">
              <Field label="Stock Quantity *" error={errors.stock?.message}>
                <input
                  id="product-stock"
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('stock', {
                    required: 'Enter a valid stock quantity',
                    validate: (v) => (!isNaN(Number(v)) && Number(v) >= 0 && v !== '') || 'Enter a valid stock quantity',
                  })}
                />
              </Field>

              <Field label="Status">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      id="product-status"
                      value={field.value}
                      onChange={field.onChange}
                      options={STATUSES}
                      placeholder="Select status"
                    />
                  )}
                />
              </Field>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: -6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Status preview:</span>
              {(() => {
                const s = STATUSES.find(s => s.value === currentStatus);
                return (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 11.5, fontWeight: 600,
                    background: s?.color + '18',
                    color: s?.color,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s?.color, display: 'inline-block' }} />
                    {s?.label}
                  </span>
                );
              })()}
            </div>

            <Field label="Description">
              <textarea
                id="product-description"
                className="form-textarea"
                placeholder="Short product description..."
                {...register('description')}
                style={{ paddingTop: 9, minHeight: 72 }}
              />
            </Field>

          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--red)' }}>*</span> Required fields
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                id="modal-submit-btn"
              >
                {isLoading
                  ? (isEdit ? 'Saving…' : 'Adding…')
                  : (isEdit ? 'Save Changes' : '+ Add Product')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
