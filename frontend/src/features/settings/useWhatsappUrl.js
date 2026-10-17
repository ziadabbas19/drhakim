import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { getWhatsappUrl } from './contactChannels.js';

export const useWhatsappUrl = () => getWhatsappUrl(useSiteSettings().settings);
