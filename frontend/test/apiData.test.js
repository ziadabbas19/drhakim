import assert from 'node:assert/strict';
import { describe, test } from 'vitest';
import { aboutContentOf } from '../src/features/about/aboutContent.js';
import { ABOUT_ITEM_TYPES } from '../src/features/about/aboutItemTypes.js';
import { pageOf } from '../src/utils/shape.js';

const EMPTY_GROUPS = Object.fromEntries(Object.keys(ABOUT_ITEM_TYPES).map((type) => [type, []]));
const EMPTY_PROFILE = { heroImage: null, portrait: null, aboutGallery: [] };

describe('Reading API data', () => {
  test('About content always has every group and every image slot', () => {
    for (const data of [undefined, null, '', [], {}, { profile: null, items: null }, { items: [] }]) {
      assert.deepEqual(aboutContentOf(data), { profile: EMPTY_PROFILE, items: EMPTY_GROUPS }, JSON.stringify(data));
    }
  });

  test('About content keeps what the API sends and drops groups the site no longer shows', () => {
    const content = aboutContentOf({
      profile: { headline: 'عنوان', aboutGallery: null },
      items: { surgery: [{ id: 1, title: 'جراحة', gallery: null }], testimonial: [{ id: 2 }] },
    });
    assert.deepEqual(content.profile, { ...EMPTY_PROFILE, headline: 'عنوان' });
    assert.deepEqual(content.items.surgery, [{ id: 1, title: 'جراحة', gallery: [] }]);
    assert.equal('testimonial' in content.items, false);
  });

  test('a page of a list always has items and a total', () => {
    assert.deepEqual(pageOf(undefined), { items: [], total: 0 });
    assert.deepEqual(pageOf({ items: 'oops' }), { items: [], total: 0 });
    assert.deepEqual(pageOf({ items: [{ id: 1 }], total: 7, offset: 0 }), { items: [{ id: 1 }], total: 7, offset: 0 });
  });
});
