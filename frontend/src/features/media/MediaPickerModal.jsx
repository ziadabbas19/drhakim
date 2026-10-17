import { useState } from 'react';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { MediaDropzone } from './MediaDropzone.jsx';
import { MEDIA_GRID_CLASS } from './MediaPanel.jsx';
import { MediaTile } from './MediaTile.jsx';
import { useMediaLibrary } from './useMediaLibrary.js';
import { useMediaUpload } from './useMediaUpload.js';

const contains = (selection, media) => selection.some(({ id }) => id === media.id);

// Pick from the library or upload new images on the spot; new uploads are selected right away.
export const MediaPickerModal = ({ multiple, initialSelection, onConfirm, onClose }) => {
  const { t } = useI18n();
  const library = useMediaLibrary();
  const [selection, setSelection] = useState(initialSelection);

  const toggle = (media) =>
    setSelection((current) => {
      if (!multiple) return [media];
      return contains(current, media) ? current.filter(({ id }) => id !== media.id) : [...current, media];
    });

  const { upload, progress } = useMediaUpload({
    limits: library.limits,
    onUploaded: (created) => {
      library.reload();
      setSelection((current) => (multiple ? [...current, ...created] : created.slice(0, 1)));
    },
  });

  return (
    <Modal
      size="xl"
      title={multiple ? t('media.picker.titleMany') : t('media.picker.title')}
      onClose={onClose}
      footer={(dismiss) => (
        <>
          <p className="me-auto text-sm font-semibold text-ink-muted" aria-live="polite">
            {t('media.picker.selected', { count: selection.length })}
          </p>
          <Button variant="ghost" onClick={() => dismiss()}>
            {t('common.cancel')}
          </Button>
          <Button
            icon="check"
            disabled={!multiple && !selection.length}
            onClick={() => dismiss(() => onConfirm(selection))}
          >
            {multiple ? t('media.picker.confirm') : t('media.picker.confirmOne')}
          </Button>
        </>
      )}
    >
      <div className="space-y-5">
        <MediaDropzone compact limits={library.limits} progress={progress} onFiles={upload} />
        <AsyncContent {...library} onRetry={library.reload}>
          {() =>
            library.items.length ? (
              <div className="space-y-4">
                <ul className={MEDIA_GRID_CLASS}>
                  {library.items.map((media) => (
                    <li key={media.id}>
                      <MediaTile media={media} isSelected={contains(selection, media)} onSelect={toggle} />
                    </li>
                  ))}
                </ul>
                {library.pagination && <Pagination {...library.pagination} />}
              </div>
            ) : (
              <EmptyState message={t('media.empty')} icon="images" />
            )
          }
        </AsyncContent>
      </div>
    </Modal>
  );
};
