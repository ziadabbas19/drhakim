import { client } from './client.js';

const resource = (path) => ({
  list: (params) => client.get(path, { params }),
  create: (data) => client.post(path, data),
  replace: (id, data) => client.put(`${path}/${id}`, data),
  update: (id, data) => client.patch(`${path}/${id}`, data),
});

const team = resource('/admin/team');

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
  services: {
    ...resource('/admin/services'),
    reorder: (ids) => client.put('/admin/services/order', { ids }),
  },
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
};
