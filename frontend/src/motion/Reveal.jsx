import { useRevealRef } from './useRevealRef.js';

// Variants (see styles/motion.css): up, start, end, scale, fade, and rise (movement only, for
// above-the-fold text that should be visible from the first paint). start/end follow the text direction.
export const Reveal = ({ as: Component = 'div', variant = 'up', delay = 0, style, children, ...props }) => {
  const ref = useRevealRef();
  return (
    <Component
      ref={ref}
      data-reveal={variant}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...props}
    >
      {children}
    </Component>
  );
};
