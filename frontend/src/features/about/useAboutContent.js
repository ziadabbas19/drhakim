import { publicApi } from '../../api/public.js';
import { useFetch } from '../../hooks/useFetch.js';

// Profile, lists, and galleries managed from the dashboard, in the selected language. Once loaded,
// every list is present, possibly empty (see aboutContentOf).
export const useAboutContent = () => useFetch(publicApi.about.get, []);
