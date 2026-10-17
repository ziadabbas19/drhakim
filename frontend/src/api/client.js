import axios from 'axios';
import { tokenStorage } from './tokenStorage.js';

const REFRESHED_TOKEN_HEADER = 'x-access-token';
const PASSWORD_CHANGE_REQUIRED = 'PASSWORD_CHANGE_REQUIRED';
const NETWORK_ERROR_MESSAGE = 'تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت وحاول مرة أخرى';

class ApiRequestError extends Error {
  constructor({ message, status, data }) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.fields = data?.fields ?? null;
    this.code = data?.code ?? null;
  }
}

const sessionHandlers = { onExpired: () => {}, onPasswordChangeRequired: () => {} };

export const registerSessionHandlers = (handlers) => Object.assign(sessionHandlers, handlers);

const withoutEmptyValues = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined));

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15_000,
});

client.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.params) config.params = withoutEmptyValues(config.params);
  return config;
});

client.interceptors.response.use(
  (response) => {
    const refreshedToken = response.headers[REFRESHED_TOKEN_HEADER];
    if (refreshedToken) tokenStorage.set(refreshedToken);
    return response.data;
  },
  (error) => {
    const { response, config } = error;
    const requestError = new ApiRequestError({
      message: response?.data?.message ?? NETWORK_ERROR_MESSAGE,
      status: response?.status,
      data: response?.data?.data,
    });

    if (response?.status === 401 && config?.headers?.Authorization) sessionHandlers.onExpired();
    if (requestError.code === PASSWORD_CHANGE_REQUIRED) sessionHandlers.onPasswordChangeRequired();

    return Promise.reject(requestError);
  },
);
