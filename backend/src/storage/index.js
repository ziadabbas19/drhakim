import { env } from '../config/env.js';
import { createCloudinaryProvider } from './cloudinary.provider.js';
import { createLocalProvider } from './local.provider.js';

// Every provider implements the same interface:
//   upload({ key, buffer, mimeType, width, variants }) -> { storageKey, url, variants: [{ width, url }] }
//   remove(storageKey)
const factories = {
  local: () => createLocalProvider({ uploadsDir: env.storage.uploadsDir }),
  cloudinary: () => createCloudinaryProvider(env.storage.cloudinary),
};

const instances = new Map();

// Each image remembers the provider it was stored with, so it can be removed from the right place.
export const getStorage = (name = env.storage.provider) => {
  if (!instances.has(name)) instances.set(name, factories[name]());
  return instances.get(name);
};
