import { useRef } from 'react';
import { useI18n } from './useI18n.js';

// Arrow-key navigation for radio groups and tab lists. One item is tabbable; arrows move and
// select, and left/right follow the reading direction (in Arabic, the left arrow moves forward).
export const useRovingFocus = ({ count, selectedIndex, onSelect }) => {
  const { dir } = useI18n();
  const items = useRef([]);
  const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backwardKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const targetFor = (key, position) => {
    if (key === forwardKey || key === 'ArrowDown') return position + 1;
    if (key === backwardKey || key === 'ArrowUp') return position - 1;
    if (key === 'Home') return 0;
    if (key === 'End') return count - 1;
    return null;
  };

  return (position) => ({
    ref: (element) => {
      items.current[position] = element;
    },
    tabIndex: position === tabbableIndex ? 0 : -1,
    onKeyDown: (event) => {
      const target = targetFor(event.key, position);
      if (target === null) return;
      event.preventDefault();
      const next = (target + count) % count;
      onSelect(next);
      items.current[next]?.focus();
    },
  });
};
