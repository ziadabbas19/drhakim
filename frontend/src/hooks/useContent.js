import { contentFor } from '../config/content.js';
import { useI18n } from './useI18n.js';

export const useContent = () => contentFor(useI18n().lang);
