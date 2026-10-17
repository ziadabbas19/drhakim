import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { DARK_SCHEME_QUERY, DEFAULT_THEME, PREFERENCE_KEYS, THEMES } from '../config/preferences.js';
import { ThemeContext } from '../hooks/useTheme.js';
import { createStorage } from '../utils/storage.js';

const themeStorage = createStorage(PREFERENCE_KEYS.theme);

const readPreference = () => {
  const stored = themeStorage.get();
  return THEMES.includes(stored) ? stored : DEFAULT_THEME;
};

const darkScheme = window.matchMedia(DARK_SCHEME_QUERY);

const subscribeToScheme = (onChange) => {
  darkScheme.addEventListener('change', onChange);
  return () => darkScheme.removeEventListener('change', onChange);
};

const prefersDark = () => darkScheme.matches;

// The same token drives the browser UI color, so it matches the page in both themes.
const syncBrowserColor = () => {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-canvas').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreferenceState] = useState(readPreference);
  const systemIsDark = useSyncExternalStore(subscribeToScheme, prefersDark);
  const resolved = preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved;
    syncBrowserColor();
  }, [resolved]);

  const setPreference = useCallback((next) => {
    themeStorage.set(next);
    setPreferenceState(next);
  }, []);

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
};
