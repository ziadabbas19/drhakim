import { cn } from '../utils/cn.js';
import { ImagePlaceholder, ResponsiveImage } from './ResponsiveImage.jsx';

// The doctor's photo, as chosen in the dashboard. A cut-out (transparent background) stands on a
// soft shape in the brand colours, its lower edge fading into it, and floats gently once its
// entrance has finished (see .float-after-reveal in styles/motion.css). Any other photo fills a
// rounded frame. The cut-out keeps its own proportions, so any transparent PNG fits.
export const Portrait = ({ media, alt, sizes, priority = false, className }) => {
  if (!media) return <ImagePlaceholder icon="user" label={alt} className={cn('rounded-[2.5rem]', className)} />;

  if (!media.hasTransparency) {
    return (
      <ResponsiveImage
        media={media}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cn('rounded-[2.5rem] shadow-soft', className)}
      />
    );
  }

  return (
    <div data-portrait="cutout" className={cn('relative isolate', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-x-[6%] top-[18%] bottom-0 -z-10 rounded-[2.5rem] bg-linear-to-br from-hero-from via-hero-via to-hero-to shadow-soft"
      />
      <span aria-hidden="true" className="absolute inset-x-[20%] top-[4%] -z-10 h-1/2 rounded-full bg-glow blur-2xl" />
      <ResponsiveImage
        media={media}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className="float-after-reveal size-full"
        imgClassName="object-contain object-bottom mask-b-from-85%"
      />
    </div>
  );
};
