import { Link } from 'react-router';
import { PATHS } from '../config/navigation.js';
import { useContent } from '../hooks/useContent.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

export const Logo = ({ inverted = false }) => {
  const { doctor } = useContent();

  return (
    <Link to={PATHS.home} className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-hero-from to-hero-to text-on-inverse shadow-sm">
        <Icon name="ear" className="size-5" />
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
