import { DEFAULT_LANGUAGE, LANGUAGES, isLanguage } from '../config/languages.js';
import { PREFERENCE_KEYS } from '../config/preferences.js';
import { createStorage } from '../utils/storage.js';
import { translate } from './translate.js';

const languageStorage = createStorage(PREFERENCE_KEYS.language);

const storedLanguage = languageStorage.get();
let currentLanguage = isLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;

// Read outside React, e.g. by the API client, so it is updated before any re-render.
export const getLanguage = () => currentLanguage;

export const translateCurrent = (key, params) => translate(currentLanguage, key, params);

export const applyLanguage = (lang) => {
  currentLanguage = lang;
  languageStorage.set(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGUAGES[lang].dir;
};
