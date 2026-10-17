import { useCallback } from 'react';

// Starts revealing slightly before an element reaches the bottom edge of the screen.
const OBSERVER_OPTIONS = Object.freeze({ rootMargin: '0px 0px -8% 0px', threshold: 0 });
const VISIBLE_ATTRIBUTE = 'data-visible';

const showElement = (element) => element.setAttribute(VISIBLE_ATTRIBUTE, '');

let sharedObserver;

const getObserver = () => {
  sharedObserver ??= new IntersectionObserver((entries, observer) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      showElement(target);
      observer.unobserve(target);
    }
  }, OBSERVER_OPTIONS);
  return sharedObserver;
};

// One observer for every animated element on the page; each element is revealed once.
// The visible state is a DOM attribute read by CSS, so revealing never re-renders React.
export const useRevealRef = () =>
  useCallback((element) => {
    if (!element) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      showElement(element);
      return undefined;
    }
    const observer = getObserver();
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);
