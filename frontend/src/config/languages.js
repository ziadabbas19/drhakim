// Arabic is the default language. Display locales keep Western digits, matching phone numbers.
export const LANGUAGES = Object.freeze({
  ar: { dir: 'rtl', locale: 'ar-EG-u-nu-latn', ogLocale: 'ar_EG', nativeName: 'العربية' },
  en: { dir: 'ltr', locale: 'en-US', ogLocale: 'en_US', nativeName: 'English' },
});

export const DEFAULT_LANGUAGE = 'ar';

export const isLanguage = (value) => Object.hasOwn(LANGUAGES, value ?? '');

export const otherLanguage = (lang) => Object.keys(LANGUAGES).find((code) => code !== lang);
