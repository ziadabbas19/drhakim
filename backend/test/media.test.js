import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { api, loginAs, serverUrl, useTestServer } from './support/api.js';
import { createImage, imageForm } from './support/images.js';

useTestServer();

let token;
before(async () => {
  token = await loginAs('owner');
});

const ENGLISH = { lang: 'en' };

const upload = (files, query = ENGLISH) => api.post('/admin/media', { token, form: imageForm(files), query });

const imageFile = async ({ format = 'png', type = `image/${format}`, name = `photo.${format}`, ...size } = {}) => ({
  buffer: await createImage({ format, ...size }),
  name,
  type,
});

const uploadOne = async (options) => (await upload([await imageFile(options)])).body.data[0];

describe('Media upload', () => {
  test('staff cannot use the media library', async () => {
    const staff = await loginAs('staff');
    assert.equal((await api.get('/admin/media', { token: staff })).status, 403);
    const uploadAttempt = await api.post('/admin/media', { token: staff, form: imageForm([await imageFile()]) });
    assert.equal(uploadAttempt.status, 403);
  });

  test('stores a resized WebP with responsive sizes and a placeholder', async () => {
    const { status, body } = await upload([await imageFile({ width: 3000, height: 1500 })]);
    assert.equal(status, 201);
    assert.equal(body.message, 'Images uploaded successfully');

    const [media] = body.data;
    assert.equal(media.mimeType, 'image/webp');
    assert.deepEqual([media.width, media.height], [2000, 1000]);
    assert.deepEqual(
      media.variants.map(({ width }) => width),
      [480, 960, 1440, 2000],
    );
    assert.match(media.placeholder, /^data:image\/webp;base64,/);
    assert.equal(media.usageCount, 0);
    assert.equal(media.provider, 'local');

    for (const variant of media.variants) {
      const file = await fetch(serverUrl(variant.url));
      assert.equal(file.status, 200);
      assert.equal(file.headers.get('content-type'), 'image/webp');
      assert.match(file.headers.get('cache-control'), /immutable/);
    }
  });

  test('small images are not enlarged', async () => {
    const media = await uploadOne({ width: 400, height: 300 });
    assert.deepEqual([media.width, media.height], [400, 300]);
    assert.deepEqual(media.variants, [{ width: 400, url: media.url }]);
  });

  test('accepts JPEG, PNG, and WebP files in one upload', async () => {
    const files = await Promise.all(['jpeg', 'png', 'webp'].map((format) => imageFile({ format })));
    const { status, body } = await upload(files);
    assert.equal(status, 201);
    assert.equal(body.data.length, 3);
  });

  test('rejects other image types', async () => {
    const { status, body } = await upload([await imageFile({ format: 'gif' })]);
    assert.equal(status, 400);
    assert.equal(body.message, 'Only JPEG, PNG or WebP images are allowed');
  });

  test('checks the file content, not its name or declared type', async () => {
    const disguisedText = { buffer: Buffer.from('this is not an image at all'), name: 'photo.png', type: 'image/png' };
    const disguisedGif = { ...(await imageFile({ format: 'gif' })), name: 'photo.jpg', type: 'image/jpeg' };

    for (const file of [disguisedText, disguisedGif]) {
      const { status, body } = await upload([file]);
      assert.equal(status, 400);
      assert.equal(body.message, 'The file content is not a valid JPEG, PNG or WebP image');
    }
  });

  test('rejects a damaged image that only looks right', async () => {
    const valid = await createImage({ format: 'png' });
    const truncated = Buffer.concat([valid.subarray(0, 40), Buffer.alloc(200)]);
    const { status, body } = await upload([{ buffer: truncated, name: 'photo.png', type: 'image/png' }]);
    assert.equal(status, 400);
    assert.equal(body.message, 'The image could not be read, make sure the file is a valid image');
  });

  test('rejects files over the size limit', async () => {
    const tooLarge = { buffer: Buffer.alloc(1.2 * 1024 * 1024, 1), name: 'large.png', type: 'image/png' };
    const english = await upload([tooLarge]);
    const arabic = await upload([tooLarge], {});
    assert.equal(english.status, 413);
    assert.equal(english.body.message, 'Each image must be 1 MB or smaller');
    assert.equal(arabic.body.message, 'حجم الصورة يجب ألا يزيد عن 1 ميجابايت');
  });

  test('requires at least one file', async () => {
    const { status, body } = await upload([]);
    assert.equal(status, 400);
    assert.equal(body.message, 'Please choose at least one image');
  });

  test('alt text is edited in both languages, Arabic required', async () => {
    const media = await uploadOne();
    const englishOnly = await api.patch(`/admin/media/${media.id}`, {
      token,
      query: ENGLISH,
      body: { altEn: 'Clinic' },
    });
    assert.equal(englishOnly.status, 400);
    assert.equal(englishOnly.body.data.fields.altAr, 'Alt text (Arabic) is required');

    const saved = await api.patch(`/admin/media/${media.id}`, { token, body: { altAr: 'واجهة العيادة', altEn: '' } });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.altAr, 'واجهة العيادة');
  });
});

describe('Media in use', () => {
  test('an image used on the site cannot be deleted without confirmation', async () => {
    const media = await uploadOne();
    const { body: clinics } = await api.get('/admin/clinics', { token });
    const clinic = clinics.data.items[0];

    const saved = await api.patch(`/admin/clinics/${clinic.id}`, {
      token,
      body: { coverImageId: media.id, galleryIds: [media.id] },
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.clinic.coverImage.id, media.id);
    assert.deepEqual(
      saved.body.data.clinic.gallery.map(({ id }) => id),
      [media.id],
    );

    const { body: library } = await api.get('/admin/media', { token, query: { limit: 100 } });
    assert.equal(library.data.items.find(({ id }) => id === media.id).usageCount, 2);
    assert.deepEqual(library.data.limits, {
      maxMegabytes: 1,
      maxFiles: 10,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    const blocked = await api.delete(`/admin/media/${media.id}`, { token, query: ENGLISH });
    assert.equal(blocked.status, 409);
    assert.match(blocked.body.message, /used in 2 place/);
    assert.deepEqual(
      blocked.body.data.usages
        .map(({ ownerType, slot, owner }) => [ownerType, slot, owner.nameAr, owner.nameEn])
        .toSorted(),
      [
        ['clinic', 'coverImage', clinic.nameAr, clinic.nameEn],
        ['clinic', 'gallery', clinic.nameAr, clinic.nameEn],
      ],
    );

    const forced = await api.delete(`/admin/media/${media.id}`, { token, query: { force: 'true' } });
    assert.equal(forced.status, 200);

    const { body: updated } = await api.get(`/admin/clinics/${clinic.id}`, { token });
    assert.equal(updated.data.coverImage, null);
    assert.deepEqual(updated.data.gallery, []);
    assert.equal((await fetch(serverUrl(media.url))).status, 404);
  });

  test('an unused image is deleted together with its files', async () => {
    const media = await uploadOne({ width: 1000, height: 800 });
    const removed = await api.delete(`/admin/media/${media.id}`, { token });
    assert.equal(removed.status, 200);
    for (const variant of media.variants) assert.equal((await fetch(serverUrl(variant.url))).status, 404);
  });

  test('a gallery can be emptied', async () => {
    const media = await uploadOne();
    const { body: clinics } = await api.get('/admin/clinics', { token });
    const clinicId = clinics.data.items[1].id;
    await api.patch(`/admin/clinics/${clinicId}`, { token, body: { galleryIds: [media.id] } });

    const cleared = await api.patch(`/admin/clinics/${clinicId}`, { token, body: { galleryIds: [] } });
    assert.equal(cleared.status, 200);
    assert.deepEqual(cleared.body.data.clinic.gallery, []);
  });

  test('unknown images cannot be attached', async () => {
    const { body: services } = await api.get('/admin/services', { token });
    const { status, body } = await api.patch(`/admin/services/${services.data.items[0].id}`, {
      token,
      query: ENGLISH,
      body: { imageId: '00000000-0000-4000-8000-000000000000' },
    });
    assert.equal(status, 400);
    assert.equal(body.message, 'One of the selected images is not in the media library');
  });

  test('public responses include images with alt text in the requested language', async () => {
    const media = await uploadOne();
    await api.patch(`/admin/media/${media.id}`, { token, body: { altAr: 'غرفة الكشف' } });
    const { body: services } = await api.get('/admin/services', { token });
    const service = services.data.items[0];
    await api.patch(`/admin/services/${service.id}`, { token, body: { imageId: media.id } });

    const fallback = await api.get('/services', { query: ENGLISH });
    const publicImage = fallback.body.data.find(({ id }) => id === service.id).image;
    assert.equal(publicImage.alt, 'غرفة الكشف');
    assert.equal('altAr' in publicImage, false);
    assert.ok(publicImage.variants.length);

    await api.patch(`/admin/media/${media.id}`, { token, body: { altAr: 'غرفة الكشف', altEn: 'Examination room' } });
    const english = await api.get('/services', { query: ENGLISH });
    assert.equal(english.body.data.find(({ id }) => id === service.id).image.alt, 'Examination room');

    await api.patch(`/admin/services/${service.id}`, { token, body: { imageId: null } });
    const cleared = await api.get('/services');
    assert.equal(cleared.body.data.find(({ id }) => id === service.id).image, null);
  });
});
