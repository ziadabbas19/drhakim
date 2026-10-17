import { PREFERENCE_KEYS } from '../config/preferences.js';
import { createStorage } from '../utils/storage.js';

export const tokenStorage = createStorage(PREFERENCE_KEYS.token);
