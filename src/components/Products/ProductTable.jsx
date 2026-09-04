import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { openModal } from '../../store/uiSlice';

const STATUS_LABELS = {
  published:   'Published',
  inactive:    'Inactive',
  draft:       'Draft',
  'out-stock': 'Out of Stock',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${status}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function RowMenu({ product }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const h = () => setOpen(false);
    window.addEventListener('scroll', h, true);
    return () => window.removeEventListener('scroll', h, true);
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <button
        ref={btnRef}
        className="btn btn-outline btn-icon btn-sm"
        onClick={handleToggle}
        aria-label="Row options"
        id={`row-menu-${product.id}`}
      >
        <MoreVertical size={13} />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          className="dropdown-menu"
          style={{
            position: 'fixed',
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9000,
          }}
        >
          <button
            className="dropdown-item"
            onClick={() => { dispatch(openModal({ type: 'edit', product })); setOpen(false); }}
          >
            <Edit2 size={13} /> Edit
          </button>
          <div className="dropdown-divider" />
          <button
            className="dropdown-item danger"
            onClick={() => { dispatch(openModal({ type: 'delete', product })); setOpen(false); }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

export default function ProductTable({ products, selectedIds, onSelect, onSelectAll }) {
  const allSelected = products.length > 0 && products.every(p => selectedIds.includes(p.id));

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                className="table-checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(allSelected ? [] : products.map(p => p.id))}
                id="select-all-checkbox"
              />
            </th>
            <th>Product Name</th>
            <th>ID &amp; Create Date</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th style={{ width: 80, textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} id={`product-row-${p.id}`}>
              <td>
                <input
                  type="checkbox"
                  className="table-checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => onSelect(p.id)}
                  id={`check-row-${p.id}`}
                />
              </td>
              <td>
                <div>
                  <div className="table-product-name">{p.name}</div>
                  <div className="table-product-cat">{p.category} · {p.brand}</div>
                </div>
              </td>
              <td>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  #{String(p.id).padStart(6, '0')}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{p.createdAt}</div>
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>${Number(p.price || 0).toLocaleString()}</div>
                {Number(p.originalPrice) > Number(p.price) && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ${Number(p.originalPrice || 0).toLocaleString()}
                  </div>
                )}
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>{Number(p.stock || 0).toLocaleString()}</span>
              </td>
              <td>
                <StatusBadge status={p.status} />
              </td>
              <td style={{ textAlign: 'center' }}>
                <RowMenu product={p} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
