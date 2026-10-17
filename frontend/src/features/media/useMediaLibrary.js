import { dashboardApi } from '../../api/dashboard.js';
import { MEDIA_PAGE_SIZE } from '../../config/constants.js';
import { usePaginatedList } from '../../hooks/usePaginatedList.js';

// The library page by page, newest first, with the upload limits the API enforces.
export const useMediaLibrary = () => {
  const library = usePaginatedList(dashboardApi.media.list, { pageSize: MEDIA_PAGE_SIZE });
  return { ...library, limits: library.data?.limits ?? null };
};
