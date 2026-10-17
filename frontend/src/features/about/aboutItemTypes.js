// The About page lists and the fields each one uses (mirrors the rules in the API's
// about.validator.js). Labels live under dashboard.about.types.<type> in the translation files.
// Field kinds: text and textarea are bilingual; plain is language-neutral (e.g. "+18").
export const ABOUT_ITEM_TYPES = Object.freeze({
  qualification: {
    icon: 'graduation',
    fields: [
      { name: 'title', kind: 'text', required: true },
      { name: 'subtitle', kind: 'text', required: true },
    ],
  },
  timeline: {
    icon: 'calendar',
    fields: [
      { name: 'title', kind: 'text', required: true },
      { name: 'subtitle', kind: 'text', required: true },
      { name: 'body', kind: 'text' },
    ],
  },
  membership: {
    icon: 'badge',
    fields: [{ name: 'title', kind: 'text', required: true }],
  },
  stat: {
    icon: 'award',
    fields: [
      { name: 'value', kind: 'plain', required: true, hint: true },
      { name: 'title', kind: 'text', required: true },
    ],
  },
  surgery: {
    icon: 'images',
    reminder: 'consentReminder',
    fields: [
      { name: 'title', kind: 'text', required: true },
      { name: 'body', kind: 'textarea' },
      { name: 'category', kind: 'category' },
      { name: 'gallery', kind: 'gallery' },
    ],
  },
});

const EMPTY_BY_KIND = {
  text: (name) => ({ [`${name}Ar`]: '', [`${name}En`]: '' }),
  textarea: (name) => ({ [`${name}Ar`]: '', [`${name}En`]: '' }),
  plain: (name) => ({ [name]: '' }),
  category: (name) => ({ [name]: '' }),
  gallery: (name) => ({ [name]: [] }),
};

export const emptyAboutItem = (type) =>
  Object.assign({}, ...ABOUT_ITEM_TYPES[type].fields.map(({ name, kind }) => EMPTY_BY_KIND[kind](name)));
