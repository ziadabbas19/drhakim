import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Browser features the simulated browser (jsdom) does not provide.
const noMatch = (query) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
});
window.matchMedia = noMatch;
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
  localStorage.clear();
});
