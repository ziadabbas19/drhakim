import { useCallback } from 'react';
import { useConfirm } from './useConfirm.js';
import { useToast } from './useToast.js';

export const useAction = () => {
  const confirm = useConfirm();
  const toast = useToast();

  return useCallback(
    async (action, { confirmation, onSuccess } = {}) => {
      if (confirmation && !(await confirm(confirmation))) return null;
      try {
        const response = await action();
        if (response?.message) toast.success(response.message);
        onSuccess?.(response);
        return response;
      } catch (error) {
        toast.error(error.message);
        return null;
      }
    },
    [confirm, toast],
  );
};
