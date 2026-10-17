import { useCallback, useRef, useState } from 'react';
import { ConfirmContext } from '../hooks/useConfirm.js';
import { useI18n } from '../hooks/useI18n.js';
import { Button } from './Button.jsx';
import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({ title, message, confirmLabel, onConfirm, onCancel }) => {
  const { t } = useI18n();

  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="sm"
      footer={(dismiss) => (
        <>
          <Button variant="ghost" onClick={() => dismiss(onCancel)}>
            {t('confirm.cancel')}
          </Button>
          <Button variant="danger" onClick={() => dismiss(onConfirm)} autoFocus>
            {confirmLabel ?? t('confirm.confirm')}
          </Button>
        </>
      )}
    >
      <div className="leading-relaxed text-ink-muted">{message}</div>
    </Modal>
  );
};

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
