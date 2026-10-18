import { aboutContentOf } from '../features/about/aboutContent.js';
import { listOf, objectOf, pageOf } from '../utils/shape.js';
import { client } from './client.js';

// Public content is put in the shape the pages read here, once, so a missing list or field
// shows as empty on the site instead of breaking a page.
const readAs = (shape) => (reply) => ({ ...reply, data: shape(reply.data) });

const reviewSummaryOf = (data) => {
  const { count, average } = objectOf(data);
  return { count: Number(count) || 0, average: Number(average) || 0 };
};

export const publicApi = {
  about: {
    get: () => client.get('/about').then(readAs(aboutContentOf)),
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
    get: () => client.get('/settings').then(readAs(objectOf)),
  },
  reviews: {
    list: (params) => client.get('/reviews', { params }).then(readAs(pageOf)),
    highlights: (limit) => client.get('/reviews/highlights', { params: { limit } }).then(readAs(listOf)),
    summary: () => client.get('/reviews/summary').then(readAs(reviewSummaryOf)),
    create: (review) => client.post('/reviews', review),
  },
};
