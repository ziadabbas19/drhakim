import { createContext, use } from 'react';

export const SiteSettingsContext = createContext({ settings: {}, isLoading: false, error: null, reload: () => {} });

export const useSiteSettings = () => use(SiteSettingsContext);
