// Storage can be unavailable (private browsing, blocked site data), so every access is guarded.
const attempt = (action) => {
  try {
    return action();
  } catch {
    return null;
  }
};

export const createStorage = (key) => ({
  get: () => attempt(() => localStorage.getItem(key)),
  set: (value) => attempt(() => localStorage.setItem(key, value)),
  clear: () => attempt(() => localStorage.removeItem(key)),
});
