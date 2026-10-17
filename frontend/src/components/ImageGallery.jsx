import { useState } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { Stagger } from '../motion/Stagger.jsx';
import { cn } from '../utils/cn.js';
import { Lightbox } from './Lightbox.jsx';
import { ResponsiveImage } from './ResponsiveImage.jsx';

// Thumbnails that open the lightbox.
export const ImageGallery = ({ images, alt, sizes = '(min-width: 640px) 33vw, 50vw', className }) => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Stagger as="ul" itemAs="li" variant="scale" className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={t('lightbox.open', { current: index + 1, total: images.length })}
            className="lift relative block w-full rounded-xl"
          >
            <ResponsiveImage media={image} alt={alt} sizes={sizes} className="aspect-4/3 rounded-xl" />
          </button>
        ))}
      </Stagger>
      {openIndex !== null && <Lightbox images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />}
    </>
  );
};
