import { once } from 'node:events';
import { after, before } from 'node:test';
import { app } from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { TEST_USERS } from './users.js';

let baseUrl;
let markReady;
// Top-level before() hooks start together, so requests wait until the server is listening.
const serverReady = new Promise((resolve) => {
  markReady = resolve;
});

// Starts the API on a free port for the current test file and stops it afterwards.
export const useTestServer = () => {
  let server;
  before(async () => {
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    markReady();
  });
  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await sequelize.close();
  });
};

export const serverUrl = (path) => `${baseUrl}${path}`;

const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  return response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text;
};

export const request = async (method, path, { token, body, form, query = {}, headers = {} } = {}) => {
  await serverReady;
  const url = new URL(serverUrl(`/api${path}`));
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);

  const response = await fetch(url, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
  });
  return { status: response.status, headers: response.headers, body: await parseBody(response) };
};

export const api = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, options),
  put: (path, options) => request('PUT', path, options),
  patch: (path, options) => request('PATCH', path, options),
  delete: (path, options) => request('DELETE', path, options),
};

export const loginAs = async (role) => {
  const { email, password } = TEST_USERS[role];
  const { body } = await api.post('/auth/login', { body: { email, password } });
  return body.data.token;
};
