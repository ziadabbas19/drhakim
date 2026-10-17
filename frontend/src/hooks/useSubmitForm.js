import { useForm } from './useForm.js';
import { useToast } from './useToast.js';

export const useSubmitForm = ({ initialValues, schema, submit, onSaved }) => {
  const toast = useToast();

  return useForm({
    initialValues,
    schema,
    onSubmit: async (values) => {
      const response = await submit(values);
      toast.success(response.message);
      onSaved?.(response);
    },
  });
};
