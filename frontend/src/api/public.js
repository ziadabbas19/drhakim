import { client } from './client.js';

export const publicApi = {
  about: {
    get: () => client.get('/about'),
  },
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
  reviews: {
    list: (params) => client.get('/reviews', { params }),
    highlights: (limit) => client.get('/reviews/highlights', { params: { limit } }),
    summary: () => client.get('/reviews/summary'),
    create: (review) => client.post('/reviews', review),
  },
};
