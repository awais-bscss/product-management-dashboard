import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
export default function CustomSelect({ value, onChange, options = [], placeholder = 'Select…', id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const normalized = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const selected = normalized.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }} id={id}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          height: 36,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          padding: '0 10px',
          border: `1px solid ${open ? 'var(--border-focus)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          background: 'var(--bg-subtle)',
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: 13,
          fontFamily: 'var(--font)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border .15s, box-shadow .15s',
          boxShadow: open ? '0 0 0 3px rgba(102,126,234,.12)' : 'none',
          textAlign: 'left',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.color && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
          )}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={13}
          color="var(--text-muted)"
          style={{ flexShrink: 0, transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 400,
            background: 'var(--bg-white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '4px',
            listStyle: 'none',
            maxHeight: 220,
            overflowY: 'auto',
          }}
        >
          {placeholder && (
            <li
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect('')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                background: !value ? 'var(--bg-hover)' : 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = !value ? 'var(--bg-hover)' : 'transparent'}
            >
              {placeholder}
            </li>
          )}
          {normalized.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                background: value === opt.value ? 'var(--accent-light)' : 'transparent',
                fontWeight: value === opt.value ? 600 : 400,
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = value === opt.value ? 'var(--accent-light)' : 'transparent'; }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {opt.color && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.color, flexShrink: 0 }} />
                )}
                {opt.label}
              </span>
              {value === opt.value && <Check size={13} color="var(--accent)" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
