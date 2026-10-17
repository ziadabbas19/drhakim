import { client } from './client.js';

export const authApi = {
  login: (credentials) => client.post('/auth/login', credentials),
  me: () => client.get('/auth/me'),
  changePassword: (passwords) => client.post('/auth/change-password', passwords),
};
