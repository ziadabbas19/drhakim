import { cn } from '../utils/cn.js';

export const Container = ({ className, children }) => (
  <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>{children}</div>
);
