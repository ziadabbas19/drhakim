import { useCallback, useEffect, useState } from 'react';
import { useI18n } from './useI18n.js';

// Content comes back in the selected language, so switching languages fetches it again.
export const useFetch = (fetcher, deps = []) => {
  const { lang } = useI18n();
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setState((current) => ({ ...current, error: null, isLoading: true }));

    fetcher()
      .then((response) => isCurrent && setState({ data: response.data, error: null, isLoading: false }))
      .catch((error) => isCurrent && setState({ data: null, error, isLoading: false }));

    return () => {
      isCurrent = false;
    };
  }, [...deps, lang, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  const setData = useCallback(
    (update) =>
      setState((current) => ({ ...current, data: typeof update === 'function' ? update(current.data) : update })),
    [],
  );

  return { ...state, reload, setData };
};
