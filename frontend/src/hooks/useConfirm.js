import { createContext, use } from 'react';

export const ConfirmContext = createContext(() => Promise.resolve(false));

export const useConfirm = () => use(ConfirmContext);
