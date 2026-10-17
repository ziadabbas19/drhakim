import { createContext, use } from 'react';

export const I18nContext = createContext(null);

export const useI18n = () => use(I18nContext);
