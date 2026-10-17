import { DEFAULT_LANGUAGE } from '../config/constants.js';
import ar from './ar.js';
import en from './en.js';

const DICTIONARIES = Object.freeze({ ar, en });

const lookup = (dictionary, key) => key.split('.').reduce((node, part) => node?.[part], dictionary);

// Parameters can be functions of the language, for values such as weekday names.
const interpolate = (template, params, lang) =>
  template.replace(/{{\s*(\w+)\s*}}/g, (placeholder, name) => {
    const value = typeof params[name] === 'function' ? params[name](lang) : params[name];
    return value === undefined ? placeholder : String(value);
  });

// The requested language first, then Arabic for anything not translated yet.
const findTemplate = (lang, key) =>
  [DICTIONARIES[lang], DICTIONARIES[DEFAULT_LANGUAGE]]
    .map((dictionary) => dictionary && lookup(dictionary, key))
    .find((value) => typeof value === 'string');

export const hasTranslation = (lang, key) => findTemplate(lang, key) !== undefined;

// Unknown keys are returned unchanged, so plain text passes through safely.
export const translate = (lang, key, params = {}) => {
  const template = findTemplate(lang, key);
  return template ? interpolate(template, params ?? {}, lang) : key;
};

const toKeyTree = (node, prefix) =>
  Object.fromEntries(
    Object.entries(node).map(([name, value]) => {
      const key = `${prefix}.${name}`;
      return [name, typeof value === 'string' ? key : toKeyTree(value, key)];
    }),
  );

// Message keys mirror the dictionaries, e.g. messages.booking.slotTaken === 'messages.booking.slotTaken'.
export const messages = Object.freeze(toKeyTree(ar.messages, 'messages'));
