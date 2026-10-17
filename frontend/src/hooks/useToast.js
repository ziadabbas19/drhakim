import { createContext, use } from 'react';

export const ToastContext = createContext({ success: () => {}, error: () => {} });

export const useToast = () => use(ToastContext);
