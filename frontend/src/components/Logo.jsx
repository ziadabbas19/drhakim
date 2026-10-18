import { Link } from 'react-router';
import logoMark from '../assets/logo-mark.webp';
import { PATHS } from '../config/navigation.js';
import { useContent } from '../hooks/useContent.js';
import { cn } from '../utils/cn.js';

// The monogram is stored at twice the size it is shown (see scripts/build-icons.mjs).
const MARK_SIZE = Object.freeze({ width: 88, height: 48 });

// The monogram's dark teal letters need a light tile on dark backgrounds: in the dark theme and
// in the footer. The name beside it says what it is, so the image itself has no alt text.
export const Logo = ({ inverted = false }) => {
  const { doctor } = useContent();

  return (
    <Link to={PATHS.home} className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          'shrink-0 rounded-xl p-1',
          inverted ? 'bg-on-inverse ring-1 ring-accent/60' : 'dark:bg-on-inverse dark:ring-1 dark:ring-accent/60',
        )}
      >
        <img src={logoMark} alt="" width={MARK_SIZE.width} height={MARK_SIZE.height} className="h-9 w-auto" />
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={cn('block truncate text-base font-extrabold', inverted ? 'text-on-inverse' : 'text-ink-strong')}
        >
          {doctor.name}
        </span>
        <span className={cn('block truncate text-xs', inverted ? 'text-on-inverse-muted' : 'text-ink-subtle')}>
          {doctor.title}
        </span>
      </span>
    </Link>
  );
};
