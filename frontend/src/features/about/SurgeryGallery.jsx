import { useState } from 'react';
import { Badge } from '../../components/Badge.jsx';
import { Card } from '../../components/Card.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Lightbox } from '../../components/Lightbox.jsx';
import { MediaImage } from '../../components/ResponsiveImage.jsx';
import { SegmentedControl } from '../../components/SegmentedControl.jsx';
import { OPTION_GROUPS } from '../../config/constants.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useOptionLabel } from '../../hooks/useOptions.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { cn } from '../../utils/cn.js';

const ALL = 'all';
const CARD_IMAGE_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

const SurgeryCard = ({ surgery, onOpen }) => {
  const { t } = useI18n();
  const optionLabel = useOptionLabel();
  const [cover] = surgery.gallery;
  const image = (
    <MediaImage
      media={cover}
      fallbackIcon="images"
      sizes={CARD_IMAGE_SIZES}
      className={cn('rounded-t-2xl', cover ? 'aspect-4/3' : 'aspect-5/2')}
    />
  );

  return (
    <Card as="article" className="lift relative flex h-full flex-col p-0 sm:p-0">
      {cover ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={t('about.surgeries.viewImages', { title: surgery.title })}
          className="relative block rounded-t-2xl"
        >
          {image}
          <span className="absolute bottom-3 inset-e-3 inline-flex items-center gap-1 rounded-full bg-overlay/80 px-2.5 py-1 text-xs font-bold text-on-overlay">
            <Icon name="zoom" className="size-3.5" />
            {t('about.surgeries.imageCount', { count: surgery.gallery.length })}
          </span>
        </button>
      ) : (
        image
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {surgery.category && (
          <Badge tone="brand" className="self-start">
            {optionLabel('surgeryCategory', surgery.category)}
          </Badge>
        )}
        <h3 className="text-lg font-extrabold text-ink-strong">{surgery.title}</h3>
        {surgery.body && <p className="text-sm leading-relaxed text-ink-muted">{surgery.body}</p>}
      </div>
    </Card>
  );
};

// Filter chips appear only for specialties that have items; the grid animates again on each filter.
export const SurgeryGallery = ({ surgeries }) => {
  const { t } = useI18n();
  const optionLabel = useOptionLabel();
  const [category, setCategory] = useState(ALL);
  const [openSurgery, setOpenSurgery] = useState(null);

  const presentCategories = OPTION_GROUPS.surgeryCategory.filter((value) =>
    surgeries.some((surgery) => surgery.category === value),
  );
  const filters = [
    { value: ALL, label: t('about.surgeries.all') },
    ...presentCategories.map((value) => ({ value, label: optionLabel('surgeryCategory', value) })),
  ];
  const visible = category === ALL ? surgeries : surgeries.filter((surgery) => surgery.category === category);

  return (
    <div className="space-y-8">
      {presentCategories.length > 1 && (
        <SegmentedControl
          label={t('about.surgeries.filterLabel')}
          options={filters}
          value={category}
          onChange={setCategory}
        />
      )}
      {visible.length ? (
        <Stagger key={category} variant="scale" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((surgery) => (
            <SurgeryCard key={surgery.id} surgery={surgery} onOpen={() => setOpenSurgery(surgery)} />
          ))}
        </Stagger>
      ) : (
        <EmptyState message={t('about.surgeries.empty')} icon="images" />
      )}
      {openSurgery && (
        <Lightbox images={openSurgery.gallery} title={openSurgery.title} onClose={() => setOpenSurgery(null)} />
      )}
    </div>
  );
};
