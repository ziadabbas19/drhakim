import { useMemo } from 'react';
import { publicApi } from '../../api/public.js';
import { useFetch } from '../../hooks/useFetch.js';
import { SiteSettingsContext } from '../../hooks/useSiteSettings.js';

export const SiteSettingsProvider = ({ children }) => {
  const { data, isLoading, error, reload } = useFetch(publicApi.settings.get, []);

  const value = useMemo(() => ({ settings: data ?? {}, isLoading, error, reload }), [data, isLoading, error, reload]);

  return <SiteSettingsContext value={value}>{children}</SiteSettingsContext>;
};
