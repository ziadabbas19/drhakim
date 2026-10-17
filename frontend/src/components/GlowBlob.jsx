import { cn } from '../utils/cn.js';

export const GlowBlob = ({ className }) => (
  <div aria-hidden="true" className={cn('absolute size-72 rounded-full bg-glow blur-3xl', className)} />
);
