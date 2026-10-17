import { useRef, useState } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';
import { DialogPortal, useModalDialog } from './Modal.jsx';

const SWIPE_THRESHOLD_PX = 50;

const OVERLAY_BUTTON =
  'press grid size-11 place-items-center rounded-full bg-on-overlay/10 text-on-overlay hover:bg-on-overlay/20';

const largestUrl = (image) => image.variants?.at(-1)?.url ?? image.url;

// Full-screen viewer. Arrow keys and swipes follow the reading direction: in Arabic the next
// photo is to the left. The native modal dialog keeps keyboard focus inside and closes on Escape.
// `title` is the caption for photos without alt text.
export const Lightbox = ({ images, startIndex = 0, title, onClose }) => {
  const { t, pick, dir } = useI18n();
  const { dialogProps, dismiss } = useModalDialog(onClose);
  const [{ index, step }, setPosition] = useState({ index: startIndex, step: 1 });
  const swipeStart = useRef(null);
  const total = images.length;
  const image = images[index];
  const caption = pick(image, 'alt') || title;
  const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backwardKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  const go = (direction) =>
    setPosition((current) => ({ index: (current.index + direction + total) % total, step: direction }));

  const handleKeyDown = (event) => {
    if (total < 2) return;
    if (event.key === forwardKey) go(1);
    if (event.key === backwardKey) go(-1);
  };

  const handlePointerUp = (event) => {
    if (swipeStart.current === null || total < 2) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;
    const towardsStart = dir === 'rtl' ? distance > 0 : distance < 0;
    go(towardsStart ? 1 : -1);
  };

  return (
    <DialogPortal>
      <dialog
        {...dialogProps}
        data-variant="lightbox"
        aria-label={t('lightbox.label')}
        onKeyDown={handleKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-overlay text-on-overlay"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between gap-4 p-3 sm:p-4">
            <p aria-live="polite" className="text-sm font-bold">
              {t('lightbox.counter', { current: index + 1, total })}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dismiss()}
              aria-label={t('common.close')}
              className={OVERLAY_BUTTON}
            >
              <Icon name="close" />
            </button>
          </header>

          <div
            className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 pb-4 select-none sm:px-16"
            onPointerDown={(event) => {
              swipeStart.current = event.clientX;
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <figure
              key={image.id}
              className="slide-in flex max-h-full flex-col items-center gap-3"
              style={{ '--slide-from': step }}
            >
              <img
                src={largestUrl(image)}
                width={image.width}
                height={image.height}
                alt={caption}
                draggable={false}
                className="h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-lg object-contain"
              />
              {caption && <figcaption className="max-w-prose text-center text-sm">{caption}</figcaption>}
            </figure>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t('lightbox.previous')}
                  className={cn(OVERLAY_BUTTON, 'absolute inset-s-2 top-1/2 -translate-y-1/2 sm:inset-s-4')}
                >
                  <Icon name="chevronPrevious" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t('lightbox.next')}
                  className={cn(OVERLAY_BUTTON, 'absolute inset-e-2 top-1/2 -translate-y-1/2 sm:inset-e-4')}
                >
                  <Icon name="chevronNext" />
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </DialogPortal>
  );
};
