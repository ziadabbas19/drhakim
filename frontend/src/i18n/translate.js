import { DEFAULT_LANGUAGE, LANGUAGES } from '../config/languages.js';
import ar from './ar.js';
import en from './en.js';

const DICTIONARIES = Object.freeze({ ar, en });

const lookup = (dictionary, key) => key.split('.').reduce((node, part) => node?.[part], dictionary);

const numberFormatters = new Map();
const pluralRules = new Map();

const memoized = (cache, lang, create) => {
  if (!cache.has(lang)) cache.set(lang, create());
  return cache.get(lang);
};

const formatParam = (value, lang) =>
  typeof value === 'number'
    ? memoized(numberFormatters, lang, () => new Intl.NumberFormat(LANGUAGES[lang].locale)).format(value)
    : String(value);

// Plural entries are objects keyed by Intl plural category (zero, one, two, few, many, other).
const selectPlural = (entry, lang, count) =>
  entry[memoized(pluralRules, lang, () => new Intl.PluralRules(lang)).select(count)] ?? entry.other;

export const translate = (lang, key, params = {}) => {
  let entry = lookup(DICTIONARIES[lang], key) ?? lookup(DICTIONARIES[DEFAULT_LANGUAGE], key);
  if (entry && typeof entry === 'object' && 'other' in entry) entry = selectPlural(entry, lang, Number(params.count));
  if (typeof entry !== 'string') return key;
  return entry.replace(/{{\s*(\w+)\s*}}/g, (placeholder, name) =>
    params[name] === undefined ? placeholder : formatParam(params[name], lang),
  );
};

export const hasTranslation = (lang, key) => {
  const entry = lookup(DICTIONARIES[lang], key);
  return typeof entry === 'string' || (entry !== null && typeof entry === 'object' && 'other' in entry);
};

// Admin responses carry both languages (nameAr/nameEn); public ones already carry `name`.
export const pickLocalized = (record, field, lang) => {
  const english = record?.[`${field}En`];
  if (lang === 'en' && typeof english === 'string' && english.trim()) return english;
  return record?.[`${field}Ar`] ?? record?.[field] ?? '';
};
