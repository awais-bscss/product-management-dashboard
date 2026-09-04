import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/uiSlice';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  default: Info,
};

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  const Icon = icons[toast.type] || icons.default;

  return (
    <div className={`toast ${toast.type || ''}`}>
      <Icon size={16} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: .7, display: 'flex', alignItems: 'center' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
