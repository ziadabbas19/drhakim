import { useState } from 'react';
import { Button } from '../../components/Button.jsx';
import { FieldShell } from '../../components/FormField.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ImagePlaceholder, ResponsiveImage } from '../../components/ResponsiveImage.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';
import { ReorderButtons } from '../dashboard/RowActions.jsx';
import { MediaPickerModal } from './MediaPickerModal.jsx';

// The image field used across the dashboard. The value is a library image (or null), or an
// ordered list of images with `multiple`. Works with form.register like any other field.
export const ImagePicker = ({ label, hint, error, value, onChange, multiple = false, required, className }) => {
  const { t } = useI18n();
  const [isPicking, setIsPicking] = useState(false);
  const selection = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  const commit = (next) => onChange(multiple ? next : (next[0] ?? null));

  const move = (index, step) => {
    const next = [...selection];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    commit(next);
  };

  const chooseLabel = multiple
    ? t('media.picker.chooseMany')
    : selection.length
      ? t('media.picker.replace')
      : t('media.picker.choose');

  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ labelId, messageId }) => (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={messageId}
          className="space-y-3 rounded-xl border border-line bg-surface-muted p-3"
        >
          {selection.length ? (
            <ul className={cn(multiple && 'grid grid-cols-2 gap-3 sm:grid-cols-4')}>
              {selection.map((media, index) => (
                <li key={media.id} className="space-y-1.5">
                  <ResponsiveImage
                    media={media}
                    sizes="12rem"
                    className={cn('rounded-lg', multiple ? 'aspect-square' : 'aspect-video max-w-xs')}
                  />
                  <div className="flex flex-wrap gap-1">
                    {multiple && <ReorderButtons index={index} count={selection.length} onMove={move} />}
                    <Button
                      variant="ghostDanger"
                      size="icon"
                      aria-label={t('common.remove')}
                      onClick={() => commit(selection.filter(({ id }) => id !== media.id))}
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ImagePlaceholder label={t('media.picker.none')} className="aspect-video max-w-xs rounded-lg" />
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={multiple ? 'imagePlus' : 'image'}
            onClick={() => setIsPicking(true)}
          >
            {chooseLabel}
          </Button>
          {isPicking && (
            <MediaPickerModal
              multiple={multiple}
              initialSelection={selection}
              onConfirm={(next) => {
                commit(next);
                setIsPicking(false);
              }}
              onClose={() => setIsPicking(false)}
            />
          )}
        </div>
      )}
    </FieldShell>
  );
};
