import { useRovingFocus } from '../hooks/useRovingFocus.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

// A single-choice group (radiogroup), e.g. the theme switch or the gallery filter.
// With `iconOnly`, labels are announced to screen readers and shown as tooltips.
export const SegmentedControl = ({ label, options, value, onChange, iconOnly = false, className }) => {
  const selectedIndex = options.findIndex((option) => option.value === value);
  const itemProps = useRovingFocus({
    count: options.length,
    selectedIndex,
    onSelect: (index) => onChange(options[index].value),
  });

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex flex-wrap gap-0.5 rounded-xl border border-line bg-surface-muted p-0.5', className)}
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            title={iconOnly ? option.label : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              'press inline-flex items-center gap-1.5 rounded-lg text-sm font-bold',
              iconOnly ? 'p-1.5' : 'px-3 py-1.5',
              isSelected ? 'bg-surface text-primary-ink shadow-sm' : 'text-ink-muted hover:text-ink-strong',
            )}
            {...itemProps(index)}
          >
            {option.icon && <Icon name={option.icon} className="size-4.5" />}
            <span className={iconOnly ? 'sr-only' : undefined}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
