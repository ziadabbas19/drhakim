import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createCloudinaryProvider, signParams } from '../src/storage/cloudinary.provider.js';
import { detectImageType } from '../src/utils/image.js';
import { localize } from '../src/utils/localize.js';
import { createImage } from './support/images.js';

const CLOUDINARY = { cloudName: 'demo-cloud', apiKey: 'key-123', apiSecret: 'secret-456', folder: 'dr-hakim' };

const fakeCloudinary = (response) => {
  const calls = [];
  const request = async (url, { body }) => {
    calls.push({ url, form: body });
    return new Response(JSON.stringify(response.body), { status: response.status ?? 200 });
  };
  return { calls, provider: createCloudinaryProvider(CLOUDINARY, request) };
};

describe('Cloudinary storage', () => {
  test('signs parameters the way Cloudinary documents', () => {
    const params = { eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop', public_id: 'sample_image', timestamp: 1315060510 };
    assert.equal(signParams(params, 'abcd'), 'bfd09f95f331f558cbd1320e67aa8d488770583e');
  });

  test('uploads one signed file and builds resized delivery URLs', async () => {
    const { calls, provider } = fakeCloudinary({ body: { public_id: 'dr-hakim/abc' } });
    const result = await provider.upload({
      key: 'abc',
      buffer: Buffer.from('webp'),
      mimeType: 'image/webp',
      width: 1600,
      variants: [{ width: 480, render: () => assert.fail('smaller copies are produced by Cloudinary') }],
    });

    const [{ url, form }] = calls;
    assert.equal(url, 'https://api.cloudinary.com/v1_1/demo-cloud/image/upload');
    assert.equal(form.get('public_id'), 'dr-hakim/abc');
    assert.equal(form.get('api_key'), 'key-123');
    assert.equal(
      form.get('signature'),
      signParams({ public_id: 'dr-hakim/abc', timestamp: form.get('timestamp') }, CLOUDINARY.apiSecret),
    );
    assert.equal(await form.get('file').text(), 'webp');

    assert.equal(result.storageKey, 'dr-hakim/abc');
    assert.equal(result.url, 'https://res.cloudinary.com/demo-cloud/image/upload/f_auto,q_auto/dr-hakim/abc');
    assert.deepEqual(result.variants, [
      {
        width: 480,
        url: 'https://res.cloudinary.com/demo-cloud/image/upload/c_limit,w_480,f_auto,q_auto/dr-hakim/abc',
      },
      { width: 1600, url: result.url },
    ]);
  });

  test('removes files through the signed destroy endpoint', async () => {
    const { calls, provider } = fakeCloudinary({ body: { result: 'ok' } });
    await provider.remove('dr-hakim/abc');
    assert.equal(calls[0].url, 'https://api.cloudinary.com/v1_1/demo-cloud/image/destroy');
    assert.equal(calls[0].form.get('public_id'), 'dr-hakim/abc');
    assert.equal(calls[0].form.get('invalidate'), 'true');
  });

  test('reports Cloudinary errors as a storage failure', async () => {
    const { provider } = fakeCloudinary({ status: 401, body: { error: { message: 'Invalid signature' } } });
    const originalError = console.error;
    console.error = () => {};
    try {
      await assert.rejects(provider.remove('dr-hakim/abc'), { status: 502 });
    } finally {
      console.error = originalError;
    }
  });
});

describe('Image type detection', () => {
  test('reads the type from the file bytes', async () => {
    for (const format of ['jpeg', 'png', 'webp']) {
      assert.equal(detectImageType(await createImage({ format })), `image/${format}`);
    }
  });

  test('rejects other formats and non-images', async () => {
    assert.equal(detectImageType(await createImage({ format: 'gif' })), null);
    assert.equal(detectImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null);
    assert.equal(detectImageType(Buffer.alloc(4)), null);
  });
});

describe('Localizing responses', () => {
  const clinic = {
    id: 1,
    nameAr: 'عيادة',
    nameEn: 'Clinic',
    cityAr: 'طنطا',
    cityEn: '',
    phone: '0400000000',
    coverImage: { url: '/a.webp', altAr: 'صورة', altEn: null },
    gallery: [{ url: '/b.webp', altAr: 'ب', altEn: 'B' }],
  };

  test('collapses language pairs, including nested objects and lists', () => {
    assert.deepEqual(localize([clinic], 'en'), [
      {
        id: 1,
        name: 'Clinic',
        city: 'طنطا',
        phone: '0400000000',
        coverImage: { url: '/a.webp', alt: 'صورة' },
        gallery: [{ url: '/b.webp', alt: 'B' }],
      },
    ]);
  });

  test('uses Arabic for the default language', () => {
    assert.equal(localize(clinic, 'ar').name, 'عيادة');
  });

  test('leaves fields without a pair untouched', () => {
    assert.deepEqual(localize({ calendar: 1, titleAr: 'عنوان' }, 'en'), { calendar: 1, titleAr: 'عنوان' });
  });
});
