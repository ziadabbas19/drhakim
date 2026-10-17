import { useEffect, useId, useRef } from 'react';
import { cn } from '../utils/cn.js';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
};

export const Modal = ({ title, description, onClose, footer, size = 'md', children }) => {
  const dialogRef = useRef(null);
  const pressStartedOnBackdrop = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  // Close only when the whole click happened on the backdrop, not when a text selection ends there.
  const handlePointerDown = (event) => {
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  };

  const handleClick = (event) => {
    if (pressStartedOnBackdrop.current && event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn('m-auto w-[calc(100%-2rem)] rounded-2xl bg-white text-slate-800 shadow-soft', SIZES[size])}
    >
      <div className="flex max-h-[88dvh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-extrabold text-brand-950">
              {title}
            </h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="إغلاق">
            <Icon name="close" />
          </Button>
        </header>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
};
