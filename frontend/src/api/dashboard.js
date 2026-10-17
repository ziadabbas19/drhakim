import { client } from './client.js';

const resource = (path) => ({
  list: (params) => client.get(path, { params }),
  create: (data) => client.post(path, data),
  replace: (id, data) => client.put(`${path}/${id}`, data),
  update: (id, data) => client.patch(`${path}/${id}`, data),
  remove: (id, params) => client.delete(`${path}/${id}`, { params }),
});

const reorderable = (path) => ({
  ...resource(path),
  reorder: (ids) => client.put(`${path}/order`, { ids }),
});

const team = resource('/admin/team');
const media = resource('/admin/media');

const toFormData = (files) => {
  const form = new FormData();
  for (const file of files) form.append('files', file);
  return form;
};

export const dashboardApi = {
  bookings: {
    list: (params) => client.get('/admin/bookings', { params }),
    updateStatus: (id, status) => client.patch(`/admin/bookings/${id}/status`, { status }),
    remove: (id) => client.delete(`/admin/bookings/${id}`),
  },
  clinics: {
    ...resource('/admin/clinics'),
    get: (id) => client.get(`/admin/clinics/${id}`),
    replaceSchedule: (id, ranges) => client.put(`/admin/clinics/${id}/schedule`, { ranges }),
    listDaysOff: (id) => client.get(`/admin/clinics/${id}/days-off`),
    addDayOff: (id, dayOff) => client.post(`/admin/clinics/${id}/days-off`, dayOff),
    removeDayOff: (id, dayOffId) => client.delete(`/admin/clinics/${id}/days-off/${dayOffId}`),
  },
  services: reorderable('/admin/services'),
  settings: {
    get: () => client.get('/admin/settings'),
    update: (settings) => client.put('/admin/settings', settings),
  },
  team: {
    list: team.list,
    create: team.create,
    update: team.update,
    resetPassword: (id, password) => client.post(`/admin/team/${id}/reset-password`, { password }),
  },
  media: {
    list: media.list,
    update: media.update,
    remove: media.remove,
    upload: (files, onProgress) =>
      client.post('/admin/media', toFormData(files), {
        timeout: 0,
        onUploadProgress: ({ progress }) => onProgress?.(Math.round((progress ?? 0) * 100)),
      }),
  },
  reviews: {
    list: (params) => client.get('/admin/reviews', { params }),
    counts: () => client.get('/admin/reviews/summary'),
    update: (id, changes) => client.patch(`/admin/reviews/${id}`, changes),
    remove: (id) => client.delete(`/admin/reviews/${id}`),
  },
  about: {
    getProfile: () => client.get('/admin/about/profile'),
    updateProfile: (profile) => client.put('/admin/about/profile', profile),
    items: (type) => ({
      ...reorderable(`/admin/about/items/${type}`),
      list: () => client.get(`/admin/about/items/${type}`),
    }),
  },
};
