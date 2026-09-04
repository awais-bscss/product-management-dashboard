import { X } from 'lucide-react';

const DECISIONS = [
  {
    number: '1',
    title: 'Local UI State',
    tool: 'useState',
    examples: 'Dropdown menus (CustomSelect, RowMenu), search input buffer before debounce, refresh spin animation, and State Decision Doc toggle.',
    reason: 'Tightly scoped to single components. No need to share across the component tree.',
  },
  {
    number: '2',
    title: 'Shared / Global UI State',
    tool: 'Redux Toolkit',
    examples: 'Active modal (add, edit, delete, bulkDelete), editing product payload, bulk selectedIds (auto-cleared on filter/page change), toast notifications, and dark/light theme.',
    reason: 'Needs to be accessed and modified across multiple unrelated components without prop-drilling.',
  },
  {
    number: '3',
    title: 'URL / Filter State',
    tool: 'useSearchParams + Redux (filtersSlice)',
    examples: 'search query, category, brand, status tab, and page number.',
    reason: 'Makes filters bookmarkable, shareable, and ensures filters and active page persist on browser reload and history navigation.',
  },
  {
    number: '4',
    title: 'Server / Cache State',
    tool: 'TanStack Query',
    examples: 'Product list caching, background refetching, and optimistic create/update/delete/bulk-delete mutations with automatic rollback.',
    reason: 'Server state can go stale or fail. TanStack Query provides caching, deduping, and optimistic updates out of the box.',
  },
  {
    number: '5',
    title: 'Form State',
    tool: 'React Hook Form',
    examples: 'Product name, category, brand, price, originalPrice, stock, status, and description in ProductModal.',
    reason: 'Form state is local to the modal dialog. React Hook Form manages validation and avoids re-rendering the modal on every keystroke.',
  },
];

const TABLE_ROWS = [
  ['Local UI',     'useState',                       'Component'],
  ['Global UI',    'Redux Toolkit (ui + theme)',     'Redux Store'],
  ['URL Filters',  'useSearchParams + filtersSlice', 'URL + Redux'],
  ['Server State', 'TanStack Query',                 'Query Cache'],
  ['Form State',   'React Hook Form',                'ProductModal'],
];

export default function StateDocumentModal({ onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="state-doc-title"
        style={{ maxWidth: 660 }}
      >
        <div className="modal-header">
          <h2 className="modal-title" id="state-doc-title">State Decision Document</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px 28px', gap: 0 }}>

          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            Week 7 · Product Management CRUD Assignment
          </p>

          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24 }}>
            This document outlines which state management tool is used for each type of state,
            and the rationale behind each decision.
          </p>

          {DECISIONS.map((d) => (
            <div key={d.number} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {d.number}. {d.title} <span style={{ fontWeight: 400, color: 'var(--accent)' }}>({d.tool})</span>
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 2 }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Examples: </strong>
                {d.examples}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Why: </strong>
                {d.reason}
              </p>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Summary</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)' }}>
                  {['State Type', 'Tool Used', 'Lives In'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontSize: 11.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map(([type, tool, loc], i, arr) => (
                  <tr key={type}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>{type}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>{tool}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>{loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Week 7 · Product Management CRUD Assignment</span>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
