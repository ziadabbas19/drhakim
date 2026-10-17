import { useCallback, useState } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

const toSrcSet = (variants = []) => variants.map(({ url, width }) => `${url} ${width}w`).join(', ');

// A library image: the browser picks the right size from srcset, the intrinsic width and height
// reserve its space, and a blurred copy shows until it loads. `priority` is for the image at the
// top of the page, which loads immediately instead of lazily.
export const ResponsiveImage = ({ media, alt = '', sizes = '100vw', priority = false, className, imgClassName }) => {
  const { pick } = useI18n();
  const [isLoaded, setIsLoaded] = useState(priority);
  const markLoadedIfCached = useCallback((image) => {
    if (image?.complete) setIsLoaded(true);
  }, []);
  const srcSet = toSrcSet(media.variants);

  return (
    <span
      className={cn('block overflow-hidden bg-surface-sunken bg-cover bg-center', className)}
      style={media.placeholder ? { backgroundImage: `url("${media.placeholder}")` } : undefined}
    >
      <img
        ref={markLoadedIfCached}
        src={media.url}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        width={media.width}
        height={media.height}
        alt={pick(media, 'alt') || alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        data-image-state={isLoaded ? 'loaded' : 'loading'}
        onLoad={() => setIsLoaded(true)}
        className={cn('size-full object-cover', imgClassName)}
      />
    </span>
  );
};

// Shown until a real image is added from the dashboard.
export const ImagePlaceholder = ({ icon = 'image', label, className }) => (
  <span
    role={label ? 'img' : undefined}
    aria-label={label}
    className={cn(
      'grid place-items-center bg-linear-to-br from-surface-tint to-primary-soft text-primary-ink',
      className,
    )}
  >
    <Icon name={icon} className="size-10" strokeWidth={1.5} />
  </span>
);

export const MediaImage = ({ media, fallbackIcon, alt, className, ...imageProps }) =>
  media ? (
    <ResponsiveImage media={media} alt={alt} className={className} {...imageProps} />
  ) : (
    <ImagePlaceholder icon={fallbackIcon} label={alt} className={className} />
  );
