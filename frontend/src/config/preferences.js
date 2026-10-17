import { LANGUAGES } from './languages.js';

export const PREFERENCE_KEYS = Object.freeze({
  language: 'dr-hakim:language',
  theme: 'dr-hakim:theme',
  token: 'dr-hakim:token',
});

export const THEMES = Object.freeze(['light', 'dark', 'system']);

export const DEFAULT_THEME = 'system';

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const directions = Object.fromEntries(Object.entries(LANGUAGES).map(([code, { dir }]) => [code, dir]));

// Inlined into index.html so the saved theme and language apply before the first paint,
// with no flash of the wrong colors or text direction.
export const prepaintScript = `(function () {
  try {
    var root = document.documentElement;
    var theme = localStorage.getItem(${JSON.stringify(PREFERENCE_KEYS.theme)});
    var dark = theme === 'dark' || (theme !== 'light' && matchMedia(${JSON.stringify(DARK_SCHEME_QUERY)}).matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    var lang = localStorage.getItem(${JSON.stringify(PREFERENCE_KEYS.language)});
    var dir = ${JSON.stringify(directions)}[lang];
    if (dir) {
      root.lang = lang;
      root.dir = dir;
    }
  } catch (error) {}
})();`;
