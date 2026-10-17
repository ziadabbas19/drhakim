import { getFormatters } from '../utils/date.js';
import { useI18n } from './useI18n.js';

// Dates, times, and numbers in the selected language.
export const useFormat = () => getFormatters(useI18n().locale);
