import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';
import { PASSWORD_LENGTH } from '../../config/constants.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useSubmitForm } from '../../hooks/useSubmitForm.js';
import { changePasswordSchema } from '../../validators/auth.js';

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const ChangePasswordForm = ({ currentPasswordLabel = 'كلمة المرور الحالية', onChanged }) => {
  const { changePassword } = useAuth();

  const form = useSubmitForm({
    initialValues: EMPTY_PASSWORDS,
    schema: changePasswordSchema,
    submit: changePassword,
    onSaved: () => {
      form.reset();
      onChanged?.();
    },
  });

  return (
    <Form form={form}>
      <FormField
        label={currentPasswordLabel}
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
        {...form.register('currentPassword')}
      />
      <FormField
        label="كلمة المرور الجديدة"
        type="password"
        dir="ltr"
        autoComplete="new-password"
        hint={`${PASSWORD_LENGTH.min} أحرف على الأقل، ويفضّل أن تجمع بين الحروف والأرقام والرموز`}
        required
        {...form.register('newPassword')}
      />
      <FormField
        label="تأكيد كلمة المرور الجديدة"
        type="password"
        dir="ltr"
        autoComplete="new-password"
        required
        {...form.register('confirmPassword')}
      />
      <Button type="submit" icon="key" isLoading={form.isSubmitting}>
        حفظ كلمة المرور
      </Button>
    </Form>
  );
};
