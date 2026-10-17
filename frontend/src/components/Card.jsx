import { cn } from '../utils/cn.js';

export const Card = ({ as: Component = 'div', className, children, ...props }) => (
  <Component className={cn('rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6', className)} {...props}>
    {children}
  </Component>
);
