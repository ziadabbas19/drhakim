const STORAGE_KEY = 'dr-hakim:token';

const attempt = (action) => {
  try {
    return action();
  } catch {
    return null;
  }
};

export const tokenStorage = {
  get: () => attempt(() => localStorage.getItem(STORAGE_KEY)),
  set: (token) => attempt(() => localStorage.setItem(STORAGE_KEY, token)),
  clear: () => attempt(() => localStorage.removeItem(STORAGE_KEY)),
};
