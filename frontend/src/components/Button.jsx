import { cn } from '../utils/cn.js';
import { EXTERNAL_LINK_PROPS } from '../utils/links.js';
import { Icon } from './Icon.jsx';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-60';

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700',
  secondary: 'border border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ghostDanger: 'text-red-600 hover:bg-red-50 hover:text-red-700',
  ghostSuccess: 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  whatsapp: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800',
  light: 'bg-white text-brand-800 shadow-sm hover:bg-brand-50',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-6 py-3.5 text-base sm:text-lg',
  icon: 'size-9 shrink-0',
};

export const Button = ({
  as,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  external = false,
  className,
  children,
  ...props
}) => {
  const Component = as ?? (props.href ? 'a' : 'button');
  const isButton = Component === 'button';

  return (
    <Component
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...(isButton && { type: 'button' })}
      {...(external && EXTERNAL_LINK_PROPS)}
      {...props}
      {...(isButton && { disabled: isLoading || props.disabled })}
    >
      {isLoading ? (
        <Icon name="loader" className="size-4.5 animate-spin" />
      ) : (
        icon && <Icon name={icon} className="size-4.5" />
      )}
      {children}
    </Component>
  );
};
