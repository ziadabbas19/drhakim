import { useCallback, useState } from 'react';
import { PAGE_SIZE } from '../config/constants.js';
import { useFetch } from './useFetch.js';

export const usePaginatedList = (fetchPage, { initialFilters = {}, pageSize = PAGE_SIZE } = {}) => {
  const [query, setQuery] = useState({ ...initialFilters, offset: 0 });
  const list = useFetch(() => fetchPage({ ...query, limit: pageSize }), [JSON.stringify(query)]);

  const setFilter = useCallback((name, value) => setQuery((current) => ({ ...current, [name]: value, offset: 0 })), []);
  const setOffset = useCallback((offset) => setQuery((current) => ({ ...current, offset })), []);

  return {
    ...list,
    items: list.data?.items ?? [],
    filters: query,
    setFilter,
    pagination: list.data && { total: list.data.total, limit: pageSize, offset: query.offset, onChange: setOffset },
  };
};
