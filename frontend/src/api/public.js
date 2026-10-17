import { client } from './client.js';

export const publicApi = {
  clinics: {
    list: () => client.get('/clinics'),
    availableDates: (clinicId) => client.get(`/clinics/${clinicId}/available-dates`),
  },
  bookings: {
    slots: (clinicId, date) => client.get('/bookings/slots', { params: { clinicId, date } }),
    create: (booking) => client.post('/bookings', booking),
  },
  services: {
    list: () => client.get('/services'),
  },
  settings: {
    get: () => client.get('/settings'),
  },
};
