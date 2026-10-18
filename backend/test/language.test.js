import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { CLINICS, DOCTOR_PHONE, SERVICES } from '../src/seeders/content.js';
import { api, loginAs, useTestServer } from './support/api.js';

useTestServer();

let token;
before(async () => {
  token = await loginAs('owner');
});

const findById = (items, id) => items.find((item) => item.id === id);

describe('Content language', () => {
  test('public content is Arabic by default', async () => {
    const { status, headers, body } = await api.get('/clinics');
    assert.equal(status, 200);
    assert.equal(headers.get('content-language'), 'ar');
    assert.equal(body.data[0].name, CLINICS[0].nameAr);
    assert.equal(body.data[0].city, CLINICS[0].cityAr);
    assert.equal('nameAr' in body.data[0], false);
    assert.equal('nameEn' in body.data[0], false);
  });

  test('?lang=en returns English', async () => {
    const { headers, body } = await api.get('/clinics', { query: { lang: 'en' } });
    assert.equal(headers.get('content-language'), 'en');
    assert.equal(body.data[0].name, CLINICS[0].nameEn);
    assert.equal(body.data[0].address, CLINICS[0].addressEn);
  });

  test('the Accept-Language header selects the language when ?lang is absent', async () => {
    const { body } = await api.get('/services', { headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
    assert.equal(body.data[0].title, SERVICES[0].titleEn);
  });

  test('?lang takes priority over the header', async () => {
    const { body } = await api.get('/services', { query: { lang: 'ar' }, headers: { 'Accept-Language': 'en' } });
    assert.equal(body.data[0].title, SERVICES[0].titleAr);
  });

  test('unsupported languages fall back to Arabic', async () => {
    const byQuery = await api.get('/services', { query: { lang: 'fr' } });
    const byHeader = await api.get('/services', { headers: { 'Accept-Language': 'fr-FR' } });
    for (const { headers, body } of [byQuery, byHeader]) {
      assert.equal(headers.get('content-language'), 'ar');
      assert.equal(body.data[0].title, SERVICES[0].titleAr);
    }
  });

  test('English falls back to Arabic when it is empty', async () => {
    const created = await api.post('/admin/clinics', {
      token,
      body: {
        nameAr: 'عيادة طنطا',
        nameEn: '   ',
        cityAr: 'طنطا',
        addressAr: 'شارع البحر، طنطا',
        phone: '0403333333',
        slotDurationMinutes: 15,
      },
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.clinic.nameEn, '');

    const { body } = await api.get('/clinics', { query: { lang: 'en' } });
    const clinic = findById(body.data, created.body.data.clinic.id);
    assert.equal(clinic.name, 'عيادة طنطا');
    assert.equal(clinic.city, 'طنطا');
  });

  test('admin endpoints return both languages', async () => {
    const { body } = await api.get('/admin/services', { token, query: { lang: 'en' } });
    const [service] = body.data.items;
    assert.equal(service.titleAr, SERVICES[0].titleAr);
    assert.equal(service.titleEn, SERVICES[0].titleEn);
    assert.equal('title' in service, false);
  });

  test('settings text is bilingual', async () => {
    const saved = await api.put('/admin/settings', {
      token,
      body: { workingHoursNoteAr: 'الحجز مسبقًا', workingHoursNoteEn: 'Please book ahead' },
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.workingHoursNoteEn, 'Please book ahead');

    const english = await api.get('/settings', { query: { lang: 'en' } });
    const arabic = await api.get('/settings');
    assert.equal(english.body.data.workingHoursNote, 'Please book ahead');
    assert.equal(arabic.body.data.workingHoursNote, 'الحجز مسبقًا');
    assert.equal(english.body.data.doctorPhone, DOCTOR_PHONE);

    await api.put('/admin/settings', { token, body: { workingHoursNoteEn: '' } });
    const fallback = await api.get('/settings', { query: { lang: 'en' } });
    assert.equal(fallback.body.data.workingHoursNote, 'الحجز مسبقًا');
  });

  test('public settings do not expose the About profile', async () => {
    const { body } = await api.get('/settings');
    assert.equal('bio' in body.data, false);
    assert.equal('headline' in body.data, false);
  });
});

describe('Messages', () => {
  test('validation messages follow the language', async () => {
    const arabic = await api.post('/bookings', { body: {} });
    assert.equal(arabic.status, 400);
    assert.equal(arabic.body.message, 'حقل العيادة مطلوب');
    assert.equal(arabic.body.data.fields.phone, 'حقل رقم الموبايل مطلوب');

    const english = await api.post('/bookings', { body: {}, query: { lang: 'en' } });
    assert.equal(english.body.message, 'Clinic is required');
    assert.equal(english.body.data.fields.phone, 'Mobile number is required');
    assert.equal(english.body.data.fields.patientName, 'Patient name is required');
  });

  test('custom rule messages are translated', async () => {
    const { body } = await api.post('/bookings', {
      query: { lang: 'en' },
      body: { phone: '0123', date: '2026-02-30' },
    });
    assert.equal(body.data.fields.phone, 'The mobile number must have 11 digits and start with 010, 011, 012 or 015');
    assert.equal(body.data.fields.date, 'The date is not valid');
  });

  test('success messages follow the language', async () => {
    const english = await api.put('/admin/settings', { token, query: { lang: 'en' }, body: { email: '' } });
    const arabic = await api.put('/admin/settings', { token, body: { email: '' } });
    assert.equal(english.body.message, 'Saved successfully');
    assert.equal(arabic.body.message, 'تم الحفظ بنجاح');
  });

  test('errors with parameters name the weekday in the request language', async () => {
    const { body: clinics } = await api.get('/admin/clinics', { token });
    const overlapping = [
      { dayOfWeek: 6, startTime: '10:00', endTime: '13:00' },
      { dayOfWeek: 6, startTime: '12:00', endTime: '15:00' },
    ];
    const path = `/admin/clinics/${clinics.data.items[0].id}/schedule`;
    const english = await api.put(path, { token, query: { lang: 'en' }, body: { ranges: overlapping } });
    const arabic = await api.put(path, { token, body: { ranges: overlapping } });
    assert.equal(english.status, 400);
    assert.equal(english.body.message, 'Some working hours overlap on Saturday');
    assert.equal(arabic.body.message, 'توجد فترات عمل متداخلة يوم السبت');
  });
});

describe('Bilingual validation', () => {
  test('Arabic is required and English is optional', async () => {
    const missingArabic = await api.post('/admin/services', {
      token,
      query: { lang: 'en' },
      body: { titleEn: 'Hearing aids', descriptionEn: 'Choosing and fitting hearing aids', icon: 'ear' },
    });
    assert.equal(missingArabic.status, 400);
    assert.equal(missingArabic.body.data.fields.titleAr, 'Title (Arabic) is required');
    assert.equal(missingArabic.body.data.fields.descriptionAr, 'Description (Arabic) is required');

    const arabicOnly = await api.post('/admin/services', {
      token,
      body: { titleAr: 'سماعات الأذن', descriptionAr: 'اختيار وضبط سماعات الأذن المناسبة لكل حالة', icon: 'ear' },
    });
    assert.equal(arabicOnly.status, 201);
    assert.equal(arabicOnly.body.data.titleEn, null);

    const clearedEnglish = await api.patch(`/admin/services/${arabicOnly.body.data.id}`, {
      token,
      body: { titleEn: '' },
    });
    assert.equal(clearedEnglish.status, 200);
  });

  test('English is validated when it is given', async () => {
    const { status, body } = await api.post('/admin/services', {
      token,
      query: { lang: 'en' },
      body: { titleAr: 'خدمة', titleEn: 'x', descriptionAr: 'وصف الخدمة بالتفصيل', icon: 'ear' },
    });
    assert.equal(status, 400);
    assert.equal(body.data.fields.titleEn, 'Title (English) must be at least 2 characters');
  });
});

describe('Caching', () => {
  test('public content is cache-friendly', async () => {
    const first = await api.get('/services');
    assert.match(first.headers.get('cache-control'), /public/);
    assert.match(first.headers.get('vary'), /Accept-Language/i);
    assert.ok(first.headers.get('etag'));

    // A hand-set If-None-Match makes fetch add Cache-Control: no-cache unless one is given; a
    // browser revalidating from its own cache does not.
    const revalidated = await api.get('/services', {
      headers: { 'If-None-Match': first.headers.get('etag'), 'Cache-Control': 'max-age=0' },
    });
    assert.equal(revalidated.status, 304);
  });

  test('availability, sessions, and admin responses are never cached', async () => {
    const { body: clinics } = await api.get('/clinics');
    const responses = await Promise.all([
      api.get(`/clinics/${clinics.data[0].id}/available-dates`),
      api.get('/admin/services', { token }),
      api.get('/auth/me', { token }),
    ]);
    for (const { headers } of responses) assert.equal(headers.get('cache-control'), 'no-store');
  });
});
