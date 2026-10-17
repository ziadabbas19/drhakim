import { cn } from '../utils/cn.js';
import { EXTERNAL_LINK_PROPS } from '../utils/links.js';
import { Icon } from './Icon.jsx';

const BASE =
  'press inline-flex items-center justify-center gap-2 rounded-xl font-bold disabled:pointer-events-none disabled:opacity-60';

const VARIANTS = {
  primary: 'bg-primary text-on-primary shadow-sm hover:bg-primary-hover',
  secondary: 'border border-primary-line bg-surface text-primary-ink hover:bg-primary-faint',
  ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink-strong',
  ghostDanger: 'text-danger-ink hover:bg-danger-soft',
  ghostSuccess: 'text-success-ink hover:bg-success-soft',
  danger: 'bg-danger text-on-danger shadow-sm hover:bg-danger-hover',
  whatsapp: 'bg-whatsapp text-on-whatsapp shadow-sm hover:bg-whatsapp-hover',
  // For dark brand backgrounds such as the call-to-action banner.
  light: 'bg-on-inverse text-inverse shadow-sm hover:bg-on-inverse/90',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-6 py-3.5 text-base sm:text-lg',
  icon: 'size-9 shrink-0',
};

// `compact` shows only the icon on wide screens, keeping the text label for screen readers and
// as a tooltip (used where a table row has several actions).
export const Button = ({
  as,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  external = false,
  compact = false,
  className,
  children,
  ...props
}) => {
  const Component = as ?? (props.href ? 'a' : 'button');
  const isButton = Component === 'button';
  const isCompact = compact && icon && typeof children === 'string';

  return (
    <Component
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...(isButton && { type: 'button' })}
      {...(external && EXTERNAL_LINK_PROPS)}
      {...(isCompact && { title: children })}
      {...props}
      {...(isButton && { disabled: isLoading || props.disabled })}
    >
      {isLoading ? (
        <Icon name="loader" className="size-4.5 motion-safe:animate-spin" />
      ) : (
        icon && <Icon name={icon} className="size-4.5" />
      )}
      {isCompact ? <span className="md:sr-only">{children}</span> : children}
    </Component>
  );
};
