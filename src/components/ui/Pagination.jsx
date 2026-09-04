import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, total, limit, onPage }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> products
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '...'
            ? <span key={i} style={{ padding: '0 4px', color: 'var(--text-muted)', fontSize: 13 }}>…</span>
            : <button
                key={p}
                className={`page-btn${page === p ? ' active' : ''}`}
                onClick={() => onPage(p)}
              >
                {p}
              </button>
        )}
        <button
          className="page-btn"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
