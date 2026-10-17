import { publicApi } from '../../api/public.js';
import { useFetch } from '../../hooks/useFetch.js';

// Profile, lists, and galleries managed from the dashboard, in the selected language.
export const useAboutContent = () => useFetch(publicApi.about.get, []);
