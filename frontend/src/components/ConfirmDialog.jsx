import { useCallback, useRef, useState } from 'react';
import { ConfirmContext } from '../hooks/useConfirm.js';
import { Button } from './Button.jsx';
import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({ title, message, confirmLabel = 'تأكيد', onConfirm, onCancel }) => (
  <Modal
    title={title}
    onClose={onCancel}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onCancel}>
          تراجع
        </Button>
        <Button variant="danger" onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="leading-relaxed text-slate-600">{message}</p>
  </Modal>
);

export const ConfirmProvider = ({ children }) => {
  const [options, setOptions] = useState(null);
  const resolveRef = useRef(null);

  const settle = useCallback((confirmed) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  // A new request cancels any dialog still open, so no caller is left waiting.
  const confirm = useCallback((nextOptions) => {
    resolveRef.current?.(false);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(nextOptions);
    });
  }, []);

  return (
    <ConfirmContext value={confirm}>
      {children}
      {options && <ConfirmDialog {...options} onConfirm={() => settle(true)} onCancel={() => settle(false)} />}
    </ConfirmContext>
  );
};
