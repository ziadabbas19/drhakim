import { Badge } from '../../components/Badge.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ResponsiveImage } from '../../components/ResponsiveImage.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';

const TILE_SIZES = '(min-width: 1024px) 12rem, (min-width: 640px) 30vw, 45vw';

// A library image with its details. With `onSelect` the image is a toggle button (the picker);
// otherwise `actions` are shown below it (the library page).
export const MediaTile = ({ media, isSelected = false, onSelect, actions }) => {
  const { t, pick } = useI18n();
  const alt = pick(media, 'alt');
  const preview = <ResponsiveImage media={media} sizes={TILE_SIZES} className="aspect-square rounded-t-xl" />;

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-xl border bg-surface',
        isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-line',
      )}
    >
      {onSelect ? (
        <button
          type="button"
          aria-pressed={isSelected}
          aria-label={t('media.picker.select', { name: alt || t('media.altMissing') })}
          onClick={() => onSelect(media)}
          className="press relative block rounded-t-xl"
        >
          {preview}
          {isSelected && (
            <span className="absolute top-2 inset-e-2 grid size-7 place-items-center rounded-full bg-primary text-on-primary shadow-sm">
              <Icon name="check" className="size-4.5" />
            </span>
          )}
        </button>
      ) : (
        preview
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5 text-xs">
        <p className={cn('line-clamp-2 font-semibold', alt ? 'text-ink' : 'text-ink-subtle italic')}>
          {alt || t('media.altMissing')}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-ink-subtle">
          <span dir="ltr">{t('media.dimensions', { width: media.width, height: media.height })}</span>
          <Badge tone={media.usageCount ? 'brand' : 'neutral'}>
            {t('media.usedIn', { count: media.usageCount ?? 0 })}
          </Badge>
        </div>
        {actions && <div className="mt-auto flex flex-wrap gap-1 pt-1">{actions}</div>}
      </div>
    </div>
  );
};
