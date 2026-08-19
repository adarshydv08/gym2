import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = idCounter++;
    const toast = { id, message, type: opts.type || 'info', timeout: opts.timeout ?? 4000 };
    setToasts(t => [toast, ...t]);
    if (toast.timeout > 0) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), toast.timeout);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);
  return (
    <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => removeToast(t.id)} style={{ minWidth: 240, maxWidth: 360, background: 'rgba(16,24,32,0.9)', color: '#fff', padding: '0.75rem 1rem', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.4)', cursor: 'pointer', borderLeft: `4px solid ${t.type === 'error' ? '#ff6b6b' : t.type === 'success' ? '#86efac' : '#7dd3fc'}` }}>
          <div style={{ fontSize: 14, lineHeight: '18px' }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastContext;
