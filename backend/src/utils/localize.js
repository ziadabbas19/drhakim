const ARABIC_SUFFIX = 'Ar';
const ENGLISH_SUFFIX = 'En';

const isBlank = (value) => value === null || value === undefined || String(value).trim() === '';

const pairBase = (key, suffix, object) => {
  const base = key.slice(0, -suffix.length);
  const otherSuffix = suffix === ARABIC_SUFFIX ? ENGLISH_SUFFIX : ARABIC_SUFFIX;
  return base && key.endsWith(suffix) && `${base}${otherSuffix}` in object ? base : null;
};

const localizeObject = (object, lang) => {
  const result = {};
  for (const [key, value] of Object.entries(object)) {
    const base = pairBase(key, ARABIC_SUFFIX, object);
    if (base) {
      const english = object[`${base}${ENGLISH_SUFFIX}`];
      result[base] = lang === 'en' && !isBlank(english) ? english : value;
    } else if (!pairBase(key, ENGLISH_SUFFIX, object)) {
      result[key] = localize(value, lang);
    }
  }
  return result;
};

// Collapses every nameAr/nameEn pair into `name` in the requested language. English falls back
// to Arabic when it is empty. Works on model instances, arrays, and nested includes.
export const localize = (data, lang) => {
  if (Array.isArray(data)) return data.map((item) => localize(item, lang));
  if (data === null || typeof data !== 'object' || data instanceof Date) return data;
  if (typeof data.toJSON === 'function') return localize(data.toJSON(), lang);
  return localizeObject(data, lang);
};
