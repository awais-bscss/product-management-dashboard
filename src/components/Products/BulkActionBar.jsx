import { useSelector, useDispatch } from 'react-redux';
import { Trash2, X } from 'lucide-react';
import { clearSelection, openModal } from '../../store/uiSlice';

export default function BulkActionBar() {
  const dispatch = useDispatch();
  const selectedIds = useSelector(s => s.ui.selectedIds);

  if (!selectedIds.length) return null;

  return (
    <div className="bulk-bar" role="status" aria-live="polite" id="bulk-action-bar">
      <span className="bulk-bar-count">{selectedIds.length} selected</span>
      <div className="bulk-bar-actions">
        <button
          className="bulk-action-btn danger"
          onClick={() => dispatch(openModal({ type: 'bulkDelete' }))}
          id="bulk-delete-btn"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
      <button
        className="bulk-close-btn"
        onClick={() => dispatch(clearSelection())}
        aria-label="Clear selection"
      >
        <X size={15} />
      </button>
    </div>
  );
}
