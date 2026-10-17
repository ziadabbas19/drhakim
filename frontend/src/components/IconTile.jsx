import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { tile: 'size-10 rounded-xl', icon: 'size-5' },
  md: { tile: 'size-12 rounded-2xl', icon: 'size-6' },
  lg: { tile: 'size-14 rounded-2xl', icon: 'size-7' },
};

export const IconTile = ({ name, size = 'md', className }) => (
  <span
    className={cn('grid shrink-0 place-items-center bg-primary-soft text-primary-ink', SIZES[size].tile, className)}
  >
    <Icon name={name} className={SIZES[size].icon} />
  </span>
);
