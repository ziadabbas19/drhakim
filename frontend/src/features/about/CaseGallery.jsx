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

const CaseCard = ({ item, onOpen }) => {
  const { t } = useI18n();
  const optionLabel = useOptionLabel();
  const [cover] = item.gallery;
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
          aria-label={t('about.cases.viewImages', { title: item.title })}
          className="relative block rounded-t-2xl"
        >
          {image}
          <span className="absolute bottom-3 inset-e-3 inline-flex items-center gap-1 rounded-full bg-overlay/80 px-2.5 py-1 text-xs font-bold text-on-overlay">
            <Icon name="zoom" className="size-3.5" />
            {t('about.cases.imageCount', { count: item.gallery.length })}
          </span>
        </button>
      ) : (
        image
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {item.category && (
          <Badge tone="brand" className="self-start">
            {optionLabel('surgeryCategory', item.category)}
          </Badge>
        )}
        <h3 className="text-lg font-extrabold text-ink-strong">{item.title}</h3>
        {item.body && <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>}
      </div>
    </Card>
  );
};

// Photo lists of the About page (surgeries, before and after), as cards that open the photos.
// Filter chips appear only for specialties that have items; the grid animates again on each filter.
export const CaseGallery = ({ items }) => {
  const { t } = useI18n();
  const optionLabel = useOptionLabel();
  const [category, setCategory] = useState(ALL);
  const [openItem, setOpenItem] = useState(null);

  const presentCategories = OPTION_GROUPS.surgeryCategory.filter((value) =>
    items.some((item) => item.category === value),
  );
  const filters = [
    { value: ALL, label: t('about.cases.all') },
    ...presentCategories.map((value) => ({ value, label: optionLabel('surgeryCategory', value) })),
  ];
  const visible = category === ALL ? items : items.filter((item) => item.category === category);

  return (
    <div className="space-y-8">
      {presentCategories.length > 1 && (
        <SegmentedControl
          label={t('about.cases.filterLabel')}
          options={filters}
          value={category}
          onChange={setCategory}
        />
      )}
      {visible.length ? (
        <Stagger key={category} variant="scale" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <CaseCard key={item.id} item={item} onOpen={() => setOpenItem(item)} />
          ))}
        </Stagger>
      ) : (
        <EmptyState message={t('about.cases.empty')} icon="images" />
      )}
      {openItem && <Lightbox images={openItem.gallery} title={openItem.title} onClose={() => setOpenItem(null)} />}
    </div>
  );
};
