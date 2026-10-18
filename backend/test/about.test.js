import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { sequelize } from '../src/models/index.js';
import { SETTING_VALUES } from '../src/seeders/content.js';
import { api, loginAs, useTestServer } from './support/api.js';
import { createImage, imageForm } from './support/images.js';

useTestServer();

let token;
before(async () => {
  token = await loginAs('owner');
});

const ENGLISH = { lang: 'en' };

const PROFILE = {
  headlineAr: 'عنوان تجريبي',
  headlineEn: 'A test headline',
  introAr: 'مقدمة تجريبية',
  introEn: '',
  bioAr: '<p>نبذة قصيرة</p>',
  bioEn: '<p>A short biography</p>',
};

const items = (type) => `/admin/about/items/${type}`;

const createItem = async (type, body) => (await api.post(items(type), { token, body })).body.data;

const publicContent = async (query) => (await api.get('/about', { query })).body.data;

const uploadImages = async (count) => {
  const files = await Promise.all(
    Array.from({ length: count }, async (_, index) => ({
      buffer: await createImage({ width: 800 + index, height: 600 }),
      name: `surgery-${index}.png`,
      type: 'image/png',
    })),
  );
  return (await api.post('/admin/media', { token, form: imageForm(files) })).body.data;
};

describe('About content permissions', () => {
  test('staff cannot read or edit About content', async () => {
    const staff = await loginAs('staff');
    assert.equal((await api.get('/admin/about/profile', { token: staff })).status, 403);
    assert.equal(
      (await api.post(items('stat'), { token: staff, body: { value: '+1', titleAr: 'جائزة' } })).status,
      403,
    );
  });
});

describe('Public About content', () => {
  test('is grouped by list and returned in the requested language', async () => {
    const english = await publicContent(ENGLISH);
    assert.equal(english.profile.headline, SETTING_VALUES.headline.valueEn);
    assert.equal(english.items.qualification[0].subtitle, 'Al-Azhar University');
    assert.equal(english.items.timeline[1].subtitle, 'Mondays, 3 to 5 PM');
    assert.equal('titleAr' in english.items.membership[0], false);

    const arabic = await publicContent();
    assert.equal(arabic.items.timeline[1].body, 'مستشفى الشيخ زايد التخصصي');
  });

  test('statistics, surgeries, and before/after photos start empty', async () => {
    const { items } = await publicContent();
    assert.deepEqual([items.stat, items.surgery, items.result], [[], [], []]);
  });
});

describe('About profile', () => {
  test('the biography is sanitized to safe formatting', async () => {
    const { status, body } = await api.put('/admin/about/profile', {
      token,
      body: {
        ...PROFILE,
        bioAr:
          '<p onclick="steal()">مرحبًا <strong>بكم</strong><script>alert(1)</script></p>' +
          '<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">رابط ضار</a>' +
          '<a href="https://example.com" style="color:red">رابط آمن</a><div>سطر جديد</div>',
      },
    });
    assert.equal(status, 200);
    const { bioAr } = body.data;
    for (const unsafe of ['script', 'onclick', 'onerror', '<img', 'javascript:', 'style=']) {
      assert.equal(bioAr.includes(unsafe), false, `${unsafe} should be removed`);
    }
    assert.match(bioAr, /<strong>بكم<\/strong>/);
    assert.match(bioAr, /<a href="https:\/\/example.com" rel="noopener noreferrer" target="_blank">رابط آمن<\/a>/);
    assert.match(bioAr, /<p>سطر جديد<\/p>/);
  });

  test('an empty biography is rejected', async () => {
    const { status, body } = await api.put('/admin/about/profile', {
      token,
      query: ENGLISH,
      body: { ...PROFILE, bioAr: '<p><br></p>' },
    });
    assert.equal(status, 400);
    assert.equal(body.data.fields.bioAr, 'Biography (Arabic) is required');
  });

  test('profile text falls back to Arabic and images are attached', async () => {
    const [portrait, hero, first, second] = await uploadImages(4);
    const saved = await api.put('/admin/about/profile', {
      token,
      body: { ...PROFILE, portraitId: portrait.id, heroImageId: hero.id, aboutGalleryIds: [second.id, first.id] },
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.portrait.id, portrait.id);

    const { profile } = await publicContent(ENGLISH);
    assert.equal(profile.headline, PROFILE.headlineEn);
    assert.equal(profile.intro, PROFILE.introAr);
    assert.equal(profile.heroImage.id, hero.id);
    assert.deepEqual(
      profile.aboutGallery.map(({ id }) => id),
      [second.id, first.id],
    );

    const cleared = await api.put('/admin/about/profile', { token, body: { ...PROFILE, heroImageId: null } });
    assert.equal(cleared.body.data.heroImage, null);
    assert.equal(cleared.body.data.portrait.id, portrait.id);
  });
});

describe('About lists', () => {
  test('each list has its own required fields', async () => {
    const stat = await api.post(items('stat'), { token, query: ENGLISH, body: { titleAr: 'جائزة' } });
    assert.equal(stat.status, 400);
    assert.equal(stat.body.data.fields.value, 'Value is required');

    const result = await api.post(items('result'), { token, query: ENGLISH, body: { category: 'ear' } });
    assert.equal(result.status, 400);
    assert.equal(result.body.data.fields.titleAr, 'Title (Arabic) is required');

    // The awarding institution and the period are optional until the doctor confirms them.
    for (const type of ['qualification', 'timeline']) {
      const created = await api.post(items(type), { token, body: { titleAr: 'عنوان بدون فترة' } });
      assert.equal(created.status, 201);
      await api.delete(`${items(type)}/${created.body.data.id}`, { token });
    }

    const unknown = await api.post(items('awards'), { token, body: { titleAr: 'جائزة' } });
    assert.equal(unknown.status, 400);
  });

  test('items are added, edited, hidden, reordered, and removed', async () => {
    const first = await createItem('membership', { titleAr: 'جمعية أولى', titleEn: 'First society' });
    const second = await createItem('membership', { titleAr: 'جمعية ثانية' });
    const { body: listed } = await api.get(items('membership'), { token });
    const ids = listed.data.map(({ id }) => id);
    assert.deepEqual(ids.slice(-2), [first.id, second.id]);

    const reordered = await api.put(`${items('membership')}/order`, {
      token,
      body: { ids: [second.id, ...ids.slice(0, -1)] },
    });
    assert.equal(reordered.status, 200);
    assert.deepEqual(
      reordered.body.data.slice(0, 2).map(({ id }) => id),
      [second.id, ids[0]],
    );

    const edited = await api.put(`${items('membership')}/${first.id}`, {
      token,
      body: { titleAr: 'جمعية معدلة', titleEn: 'Edited society' },
    });
    assert.equal(edited.body.data.titleEn, 'Edited society');

    await api.patch(`${items('membership')}/${first.id}`, { token, body: { isActive: false } });
    const publicTitles = (await publicContent(ENGLISH)).items.membership.map(({ title }) => title);
    assert.equal(publicTitles[0], 'جمعية ثانية');
    assert.equal(publicTitles.includes('Edited society'), false);

    const removed = await api.delete(`${items('membership')}/${second.id}`, { token });
    assert.equal(removed.status, 200);
    const remaining = (await api.get(items('membership'), { token })).body.data.map(({ id }) => id);
    assert.equal(remaining.includes(second.id), false);
  });

  test('an item is only reachable through its own list', async () => {
    const membership = await createItem('membership', { titleAr: 'عضوية' });
    const { status } = await api.put(`${items('stat')}/${membership.id}`, {
      token,
      body: { value: '+1', titleAr: 'رقم' },
    });
    assert.equal(status, 404);
  });

  test('testimonials are no longer an About list (patient reviews replace them)', async () => {
    const { status } = await api.post(items('testimonial'), { token, body: { titleAr: 'مريض', bodyAr: 'تجربة' } });
    assert.equal(status, 400);
    assert.equal('testimonial' in (await publicContent()).items, false);

    const [types] = await sequelize.query('SELECT unnest(enum_range(NULL::enum_about_items_type))::text AS type');
    assert.equal(
      types.some(({ type }) => type === 'testimonial'),
      false,
    );
    const [columns] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'about_items' AND column_name = 'has_consent'",
    );
    assert.deepEqual(columns, []);
  });

  for (const type of ['surgery', 'result']) {
    test(`${type} items carry ordered images and a category`, async () => {
      const [first, second] = await uploadImages(2);
      const item = await createItem(type, {
        titleAr: 'عنصر تجريبي',
        titleEn: 'Sample item',
        bodyAr: 'وصف قصير',
        category: 'nose',
        galleryIds: [first.id, second.id],
      });
      assert.deepEqual(
        item.gallery.map(({ id }) => id),
        [first.id, second.id],
      );

      const reordered = await api.patch(`${items(type)}/${item.id}`, {
        token,
        body: { galleryIds: [second.id, first.id] },
      });
      assert.deepEqual(
        reordered.body.data.gallery.map(({ id }) => id),
        [second.id, first.id],
      );

      const listed = (await publicContent(ENGLISH)).items[type].find(({ id }) => id === item.id);
      assert.equal(listed.title, 'Sample item');
      assert.equal(listed.category, 'nose');
      assert.equal(listed.gallery.length, 2);

      const invalidCategory = await api.patch(`${items(type)}/${item.id}`, { token, body: { category: 'heart' } });
      assert.equal(invalidCategory.status, 400);

      await api.delete(`${items(type)}/${item.id}`, { token });
      const { body: library } = await api.get('/admin/media', { token, query: { limit: 100 } });
      assert.equal(library.data.items.find(({ id }) => id === first.id).usageCount, 0);
    });
  }
});
