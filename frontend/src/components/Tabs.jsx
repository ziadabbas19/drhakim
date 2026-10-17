import { useId } from 'react';
import { useRovingFocus } from '../hooks/useRovingFocus.js';
import { PageTransition } from '../motion/PageTransition.jsx';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

// Tab list with a single panel for the selected tab.
export const Tabs = ({ label, tabs, value, onChange, children }) => {
  const id = useId();
  const selectedIndex = tabs.findIndex((tab) => tab.value === value);
  const itemProps = useRovingFocus({
    count: tabs.length,
    selectedIndex,
    onSelect: (index) => onChange(tabs[index].value),
  });
  const tabId = (tabValue) => `${id}-tab-${tabValue}`;

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-surface-muted p-1.5"
      >
        {tabs.map((tab, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={tab.value}
              id={tabId(tab.value)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${id}-panel`}
              onClick={() => onChange(tab.value)}
              className={cn(
                'press flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold whitespace-nowrap',
                isSelected
                  ? 'bg-surface text-primary-ink shadow-sm'
                  : 'text-ink-muted hover:bg-surface hover:text-ink-strong',
              )}
              {...itemProps(index)}
            >
              {tab.icon && <Icon name={tab.icon} className="size-4.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={tabId(value)}>
        <PageTransition transitionKey={value}>{children}</PageTransition>
      </div>
    </div>
  );
};
