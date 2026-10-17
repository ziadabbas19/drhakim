import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { OPTION_GROUPS } from '../src/config/constants.js';
import { MEDIA_OWNERS } from '../src/config/mediaSlots.js';
import { PUBLIC_LINKS } from '../src/config/navigation.js';
import { THEMES } from '../src/config/preferences.js';
import { ABOUT_ITEM_TYPES } from '../src/features/about/aboutItemTypes.js';
import ar from '../src/i18n/ar.js';
import en from '../src/i18n/en.js';
import { translate } from '../src/i18n/translate.js';

const SOURCE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

const isPlural = (node) => node && typeof node === 'object' && 'other' in node;

const flatten = (node, prefix = '') =>
  Object.entries(node).flatMap(([name, value]) => {
    const key = prefix ? `${prefix}.${name}` : name;
    return typeof value === 'string' || isPlural(value) ? [key] : flatten(value, key);
  });

const lookup = (dictionary, key) => key.split('.').reduce((node, part) => node?.[part], dictionary);

const sourceFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === 'i18n' ? [] : sourceFiles(full);
      return /\.jsx?$/.test(entry.name) ? [full] : [];
    }),
  );
  return nested.flat();
};

// Literal keys passed to t('...'); keys built at runtime are covered by the dictionary checks.
const usedKeys = async () => {
  const keys = new Set();
  for (const file of await sourceFiles(SOURCE_DIR)) {
    const source = await readFile(file, 'utf8');
    for (const [, key] of source.matchAll(/\bt\(\s*'([\w.]+)'/g)) keys.add(key);
  }
  return keys;
};

describe('Translations', () => {
  test('Arabic and English define the same keys', () => {
    assert.deepEqual(flatten(en).toSorted(), flatten(ar).toSorted());
  });

  test('plural entries only use known categories and always define "other"', () => {
    for (const key of flatten(ar)) {
      for (const dictionary of [ar, en]) {
        const entry = lookup(dictionary, key);
        if (!isPlural(entry)) continue;
        for (const category of Object.keys(entry)) assert.ok(PLURAL_CATEGORIES.has(category), `${key}.${category}`);
      }
    }
  });

  test('every key used in the source exists in both languages', async () => {
    const missing = [...(await usedKeys())].filter(
      (key) => lookup(ar, key) === undefined || lookup(en, key) === undefined,
    );
    assert.deepEqual(missing, []);
  });

  test('keys built from configuration exist in both languages', () => {
    const keys = [
      ...PUBLIC_LINKS.map(({ label }) => label),
      ...Object.entries(OPTION_GROUPS).flatMap(([group, values]) => values.map((value) => `options.${group}.${value}`)),
      ...THEMES.map((theme) => `preferences.themes.${theme}`),
      ...Object.entries(MEDIA_OWNERS).flatMap(([owner, slots]) =>
        Object.keys(slots).map((slot) => `media.usage.${owner}.${slot}`),
      ),
      ...Object.entries(ABOUT_ITEM_TYPES).flatMap(([type, { fields, reminder }]) => [
        `dashboard.about.types.${type}.label`,
        `dashboard.about.types.${type}.item`,
        ...(reminder ? [`dashboard.about.${reminder}`] : []),
        ...fields.flatMap(({ name, hint }) => [
          `dashboard.about.types.${type}.fields.${name}`,
          ...(hint ? [`dashboard.about.types.${type}.fields.${name}Hint`] : []),
        ]),
      ]),
    ];
    const missing = keys.filter((key) => lookup(ar, key) === undefined || lookup(en, key) === undefined);
    assert.deepEqual(missing, []);
  });

  test('both languages use the same placeholders', () => {
    const placeholders = (value) =>
      [JSON.stringify(value ?? '')].flatMap((text) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map(([, name]) => name));
    for (const key of flatten(ar)) {
      const arabic = new Set(placeholders(lookup(ar, key)));
      const english = new Set(placeholders(lookup(en, key)));
      assert.deepEqual([...english].toSorted(), [...arabic].toSorted(), key);
    }
  });

  test('plurals and numbers follow the language', () => {
    assert.equal(translate('ar', 'common.minutes', { count: 3 }), '3 دقائق');
    assert.equal(translate('ar', 'common.minutes', { count: 20 }), '20 دقيقة');
    assert.equal(translate('en', 'common.minutes', { count: 1 }), '1 minute');
    assert.equal(translate('en', 'pagination.summary', { from: 1, to: 20, total: 1500 }), 'Showing 1–20 of 1,500');
  });

  test('missing keys fall back to the key itself', () => {
    assert.equal(translate('en', 'does.not.exist'), 'does.not.exist');
  });
});
