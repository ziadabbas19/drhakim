import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { LANGUAGES } from '../config/languages.js';
import { I18nContext } from '../hooks/useI18n.js';
import { applyLanguage, getLanguage } from './language.js';
import { pickLocalized, translate } from './translate.js';

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(getLanguage);

  useLayoutEffect(() => applyLanguage(lang), [lang]);

  const setLanguage = useCallback((next) => {
    applyLanguage(next);
    setLang(next);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      ...LANGUAGES[lang],
      setLanguage,
      t: (key, params) => translate(lang, key, params),
      pick: (record, field) => pickLocalized(record, field, lang),
    }),
    [lang, setLanguage],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
};
