import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { api, loginAs, useTestServer } from './support/api.js';

useTestServer();

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

const setSchedule = async (clinicId, ranges) =>
  api.put(`/admin/clinics/${clinicId}/schedule`, { token: await loginAs('owner'), body: { ranges } });

const findBookableSlot = async (clinicId) => {
  const { body: dates } = await api.get(`/clinics/${clinicId}/available-dates`);
  const { date } = dates.data.find(({ freeSlots }) => freeSlots > 0);
  const { body: slots } = await api.get('/bookings/slots', { query: { clinicId, date } });
  return { date, time: slots.data.find(({ isBooked }) => !isBooked).time };
};

describe('Core API', () => {
  test('health check', async () => {
    const { status, body } = await api.get('/health');
    assert.equal(status, 200);
    assert.equal(body.data.status, 'ok');
  });

  test('owners receive the media and content permissions, staff do not', async () => {
    const owner = await api.get('/auth/me', { token: await loginAs('owner') });
    const staff = await api.get('/auth/me', { token: await loginAs('staff') });
    assert.ok(owner.body.data.permissions.includes('media:manage'));
    assert.ok(owner.body.data.permissions.includes('content:manage'));
    assert.deepEqual(staff.body.data.permissions, ['bookings:manage', 'clinics:view']);
  });

  test('seeded clinics have no hours yet, so no day can be booked online', async () => {
    const { body: clinics } = await api.get('/clinics');
    for (const clinic of clinics.data) {
      assert.deepEqual(clinic.schedules, []);
      const { body: dates } = await api.get(`/clinics/${clinic.id}/available-dates`);
      assert.deepEqual(dates.data, []);
    }
  });

  test('a booking is confirmed with the clinic in the requested language', async () => {
    const { body: clinics } = await api.get('/clinics');
    const clinicId = clinics.data[0].id;
    const hours = EVERY_DAY.map((dayOfWeek) => ({ dayOfWeek, startTime: '09:00', endTime: '21:00' }));
    assert.equal((await setSchedule(clinicId, hours)).status, 200);
    const slot = await findBookableSlot(clinicId);
    const booking = { clinicId, ...slot, patientName: 'Test Patient', phone: '01012345678' };

    const created = await api.post('/bookings', { query: { lang: 'en' }, body: booking });
    assert.equal(created.status, 201);
    assert.equal(created.body.message, 'Your booking has been registered');
    assert.match(created.body.data.referenceCode, /^HK-[A-Z0-9]{6}$/);
    assert.equal(created.body.data.clinic.name, 'El-Santa Clinic');

    const duplicate = await api.post('/bookings', { body: booking });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.message, 'عذرًا، هذا الموعد تم حجزه للتو. من فضلك اختر موعدًا آخر');

    const { body: bookings } = await api.get('/admin/bookings', {
      token: await loginAs('staff'),
      query: { search: created.body.data.referenceCode },
    });
    const [listed] = bookings.data.items;
    assert.equal(listed.clinic.nameAr, 'عيادة السنطة');
    assert.equal(listed.clinic.nameEn, 'El-Santa Clinic');

    await setSchedule(clinicId, []);
  });

  test('staff keep read-only access to clinics', async () => {
    const token = await loginAs('staff');
    const { body: clinics } = await api.get('/admin/clinics', { token });
    assert.ok(clinics.data.items.length >= 2);
    const edit = await api.patch(`/admin/clinics/${clinics.data.items[0].id}`, { token, body: { isActive: false } });
    assert.equal(edit.status, 403);
  });
});
