import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { closeModal } from '../../store/uiSlice';
import { useDeleteProduct, useDeleteProducts } from '../../hooks/useProducts';

export default function DeleteModal() {
  const dispatch = useDispatch();
  const { modal, editingProduct, selectedIds } = useSelector(s => s.ui);
  const deleteSingleMutation = useDeleteProduct();
  const deleteBulkMutation = useDeleteProducts();

  const isSingle = modal === 'delete' && editingProduct;
  const isBulk = modal === 'bulkDelete' && selectedIds.length > 0;

  if (!isSingle && !isBulk) return null;

  const isPending = isSingle ? deleteSingleMutation.isPending : deleteBulkMutation.isPending;

  const handleDelete = async () => {
    try {
      if (isSingle) {
        await deleteSingleMutation.mutateAsync(editingProduct.id);
      } else if (isBulk) {
        await deleteBulkMutation.mutateAsync(selectedIds);
      }
      dispatch(closeModal());
    } catch {
      // Error handled by mutation onError
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
        aria-labelledby="delete-modal-title"
        style={{ maxWidth: 420 }}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="delete-modal-title">
              {isBulk ? 'Delete Selected Products' : 'Delete Product'}
            </h2>
          </div>
          <button
            className="modal-close"
            onClick={() => dispatch(closeModal())}
            aria-label="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px 22px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {isBulk ? (
              <>
                Are you sure you want to delete <strong>{selectedIds.length}</strong> selected products? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>{editingProduct.name}</strong>? This action cannot be undone.
              </>
            )}
          </p>
        </div>

        <div className="modal-footer" style={{ background: 'var(--bg-subtle)' }}>
          <button
            className="btn btn-outline"
            onClick={() => dispatch(closeModal())}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ background: 'var(--red)', borderColor: 'var(--red)' }}
            onClick={handleDelete}
            disabled={isPending}
            id="confirm-delete-btn"
          >
            {isPending
              ? 'Deleting...'
              : isBulk
                ? `Delete ${selectedIds.length} Products`
                : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
