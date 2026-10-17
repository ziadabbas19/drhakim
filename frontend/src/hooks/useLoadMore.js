import { useCallback, useEffect, useState } from 'react';
import { PAGE_SIZE } from '../config/constants.js';

// A list that grows with "load more". `data` stays null until the first page arrives, like useFetch.
export const useLoadMore = (fetchPage, { pageSize = PAGE_SIZE } = {}) => {
  const [state, setState] = useState({ items: [], total: null, isLoading: true, error: null });

  const loadFrom = useCallback(
    async (offset) => {
      setState((current) => ({ ...current, isLoading: true, error: null }));
      try {
        const { data } = await fetchPage({ limit: pageSize, offset });
        setState((current) => ({
          items: offset ? [...current.items, ...data.items] : data.items,
          total: data.total,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setState((current) => ({ ...current, isLoading: false, error }));
      }
    },
    [fetchPage, pageSize],
  );

  useEffect(() => {
    loadFrom(0);
  }, [loadFrom]);

  return {
    ...state,
    data: state.total === null ? null : state.items,
    hasMore: state.total !== null && state.items.length < state.total,
    loadMore: () => loadFrom(state.items.length),
    reload: () => loadFrom(0),
  };
};
