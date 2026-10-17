import { useId, useRef, useState } from 'react';
import { Button } from '../../components/Button.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';

// Drop files here or choose them from the device; several at once.
export const MediaDropzone = ({ limits, progress, onFiles, compact = false }) => {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const hintId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const isUploading = progress !== null && progress !== undefined;

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (!isUploading) onFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center',
        compact ? 'p-4 sm:flex-row sm:justify-between sm:text-start' : 'px-6 py-10',
        isDragging ? 'border-primary bg-primary-faint' : 'border-line-strong bg-surface-muted',
      )}
    >
      <div className={cn('flex items-center gap-3', !compact && 'flex-col')}>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface text-primary shadow-sm">
          <Icon
            name={isUploading ? 'loader' : 'upload'}
            className={cn('size-6', isUploading && 'motion-safe:animate-spin')}
          />
        </span>
        <div className="space-y-1">
          <p className="font-bold text-ink-strong" aria-live="polite">
            {isUploading ? t('media.dropzone.uploading', { percent: progress }) : t('media.dropzone.title')}
          </p>
          {limits && (
            <p id={hintId} className="text-xs text-ink-subtle">
              {t('media.dropzone.hint', { size: limits.maxMegabytes, count: limits.maxFiles })}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="secondary"
        icon="imagePlus"
        disabled={isUploading || !limits}
        aria-describedby={limits ? hintId : undefined}
        onClick={() => inputRef.current?.click()}
      >
        {t('media.dropzone.action')}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={limits?.mimeTypes.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="media-file-input"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
};
