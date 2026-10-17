import { Link } from 'react-router';
import { doctor } from '../config/content.js';
import { PATHS } from '../config/navigation.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

export const Logo = ({ inverted = false }) => (
  <Link to={PATHS.home} className="flex min-w-0 items-center gap-2.5">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-brand-800 text-white shadow-sm">
      <Icon name="ear" className="size-5" />
    </span>
    <span className="min-w-0 leading-tight">
      <span className={cn('block truncate text-base font-extrabold', inverted ? 'text-white' : 'text-brand-950')}>
        {doctor.name}
      </span>
      <span className={cn('block truncate text-xs', inverted ? 'text-brand-100' : 'text-slate-500')}>
        {doctor.title}
      </span>
    </span>
  </Link>
);
