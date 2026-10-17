import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from '../hooks/useToast.js';
import { Alert } from './Alert.jsx';

const TOAST_DURATION_MS = 4500;
const MAX_VISIBLE_TOASTS = 3;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const show = useCallback((tone, message) => {
    const id = (nextId.current += 1);
    setToasts((current) => [...current, { id, tone, message }].slice(-MAX_VISIBLE_TOASTS));
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), TOAST_DURATION_MS);
  }, []);

  const toast = useMemo(
    () => ({ success: (message) => show('success', message), error: (message) => show('error', message) }),
    [show],
  );

  return (
    <ToastContext value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-2 px-4"
      >
        {toasts.map(({ id, tone, message }) => (
          <Alert key={id} tone={tone} className="pointer-events-auto shadow-soft">
            {message}
          </Alert>
        ))}
      </div>
    </ToastContext>
  );
};
