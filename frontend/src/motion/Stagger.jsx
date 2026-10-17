import { Children } from 'react';
import { useRevealRef } from './useRevealRef.js';

// Later items wait at most this many steps, so long lists still appear quickly.
const MAX_STAGGER_STEPS = 8;

// Reveals its children one after another when the group scrolls into view.
// Each child is wrapped in `itemAs` (e.g. li for lists), which also takes `itemClassName`.
export const Stagger = ({
  as: Component = 'div',
  itemAs: Item = 'div',
  variant = 'up',
  className,
  itemClassName,
  children,
  ...props
}) => {
  const ref = useRevealRef();
  return (
    <Component ref={ref} className={className} {...props}>
      {Children.toArray(children).map((child, index) => (
        <Item
          key={child.key ?? index}
          data-reveal={variant}
          className={itemClassName}
          style={{ '--reveal-index': Math.min(index, MAX_STAGGER_STEPS) }}
        >
          {child}
        </Item>
      ))}
    </Component>
  );
};
