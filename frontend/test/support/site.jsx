import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { client } from '../../src/api/client.js';
import { Site } from '../../src/App.jsx';
import { translate } from '../../src/i18n/translate.js';

// The text the site shows in Arabic, its default language.
export const text = (key, params) => translate('ar', key, params);

export const ok = (data) => ({ status: 200, body: { success: true, data, message: null } });
export const failure = (status, message) => ({ status, body: { success: false, data: null, message } });
// What a request gets when it reaches the website instead of the API.
export const htmlPage = () => ({ status: 200, body: '<!doctype html><html><body><div id="root"></div></body></html>' });

const EMPTY_SITE = {
  '/about': ok({ profile: {}, items: {} }),
  '/settings': ok({}),
  '/services': ok([]),
  '/clinics': ok([]),
  '/reviews': ok({ items: [], total: 0, limit: 6, offset: 0 }),
  '/reviews/highlights': ok([]),
  '/reviews/summary': ok({ count: 0, average: 0 }),
};

// Answers the site's API requests by path, through the real API client, so its checks run too.
const fakeApi = (replies) => {
  client.defaults.adapter = async (config) => {
    const { status, body } = replies[config.url] ?? failure(404, 'Not found');
    const response = { data: body, status, statusText: String(status), headers: {}, config, request: {} };
    if (status >= 400) throw Object.assign(new Error(`Request failed with status ${status}`), { response, config });
    return response;
  };
};

// Renders the whole site at `path`, with the API replying as `replies` says (an empty site otherwise).
export const renderSite = (path, replies = {}) => {
  fakeApi({ ...EMPTY_SITE, ...replies });
  return render(<Site Router={MemoryRouter} initialEntries={[path]} />);
};
