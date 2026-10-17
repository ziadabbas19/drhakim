import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

// Longer than the closing animation; covers browsers that skip animation events.
const CLOSE_FALLBACK_MS = 400;

// Plays the closing animation from styles/motion.css, then calls `done`. With reduced motion the
// dialog has no animation, so it closes immediately.
export const useDialogDismiss = (dialogRef, onClose) => {
  const isClosing = useRef(false);

  return useCallback(
    (done = onClose) => {
      const dialog = dialogRef.current;
      if (!dialog || isClosing.current) return;
      if (getComputedStyle(dialog).animationName === 'none') {
        done();
        return;
      }
      isClosing.current = true;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        done();
      };
      dialog.setAttribute('data-closing', '');
      dialog.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, CLOSE_FALLBACK_MS);
    },
    [dialogRef, onClose],
  );
};

export const useModalDialog = (onClose) => {
  const dialogRef = useRef(null);
  const pressStartedOnBackdrop = useRef(false);
  const dismiss = useDialogDismiss(dialogRef, onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const dialogProps = {
    ref: dialogRef,
    // React passes Escape from a dialog opened on top of this one up to this handler too.
    onCancel: (event) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      dismiss();
    },
    // Close only when the whole click happened on the backdrop, not when a text selection ends there.
    onPointerDown: (event) => {
      pressStartedOnBackdrop.current = event.target === event.currentTarget;
    },
    onClick: (event) => {
      if (pressStartedOnBackdrop.current && event.target === event.currentTarget) dismiss();
    },
  };

  return { dialogRef, dialogProps, dismiss };
};

// Dialogs render at the end of <body>, so one opened from inside a form is never part of that form.
export const DialogPortal = ({ children }) => createPortal(children, document.body);

// `footer` may be a function receiving `dismiss`, so its buttons can close with the animation.
export const Modal = ({ title, description, onClose, footer, size = 'md', children }) => {
  const { t } = useI18n();
  const titleId = useId();
  const { dialogProps, dismiss } = useModalDialog(onClose);

  return (
    <DialogPortal>
      <dialog
        {...dialogProps}
        aria-labelledby={titleId}
        className={cn('m-auto w-[calc(100%-2rem)] rounded-2xl border border-line shadow-soft', SIZES[size])}
      >
        <div className="flex max-h-[88dvh] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="space-y-1">
              <h2 id={titleId} className="text-lg font-extrabold text-ink-strong">
                {title}
              </h2>
              {description && <p className="text-sm text-ink-subtle">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => dismiss()} aria-label={t('common.close')}>
              <Icon name="close" />
            </Button>
          </header>
          <div className="overflow-y-auto px-5 py-5">{children}</div>
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">
              {typeof footer === 'function' ? footer(dismiss) : footer}
            </footer>
          )}
        </div>
      </dialog>
    </DialogPortal>
  );
};
