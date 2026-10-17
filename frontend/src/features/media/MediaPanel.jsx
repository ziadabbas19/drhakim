import { AsyncContent } from '../../components/AsyncContent.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { PanelHeader } from '../dashboard/PanelHeader.jsx';
import { useRecordModal } from '../dashboard/useRecordModal.js';
import { MediaAltModal } from './MediaAltModal.jsx';
import { MediaDropzone } from './MediaDropzone.jsx';
import { MediaTile } from './MediaTile.jsx';
import { useMediaLibrary } from './useMediaLibrary.js';
import { useMediaRemoval } from './useMediaRemoval.js';
import { useMediaUpload } from './useMediaUpload.js';

export const MEDIA_GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

export const MediaPanel = () => {
  const { t } = useI18n();
  const library = useMediaLibrary();
  const { upload, progress } = useMediaUpload({ limits: library.limits, onUploaded: library.reload });
  const remove = useMediaRemoval({ onRemoved: library.reload });
  const altModal = useRecordModal(library.reload);

  return (
    <>
      <PanelHeader title={t('media.title')} description={t('media.description')} />
      <div className="space-y-6">
        <MediaDropzone limits={library.limits} progress={progress} onFiles={upload} />
        <AsyncContent {...library} onRetry={library.reload}>
          {() =>
            library.items.length ? (
              <div className="space-y-4">
                <Stagger as="ul" itemAs="li" variant="fade" className={MEDIA_GRID_CLASS}>
                  {library.items.map((media) => (
                    <MediaTile
                      key={media.id}
                      media={media}
                      actions={
                        <>
                          <Button variant="ghost" size="sm" icon="text" onClick={() => altModal.open(media)}>
                            {t('media.editAlt')}
                          </Button>
                          <Button variant="ghostDanger" size="sm" icon="trash" onClick={() => remove(media)}>
                            {t('common.delete')}
                          </Button>
                        </>
                      }
                    />
                  ))}
                </Stagger>
                {library.pagination && <Pagination {...library.pagination} />}
              </div>
            ) : (
              <EmptyState message={t('media.empty')} icon="images" />
            )
          }
        </AsyncContent>
      </div>
      {altModal.isOpen && (
        <MediaAltModal media={altModal.record} onClose={altModal.close} onSaved={altModal.handleSaved} />
      )}
    </>
  );
};
