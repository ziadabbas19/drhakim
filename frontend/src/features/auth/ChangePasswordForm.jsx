import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';
import { PASSWORD_LENGTH } from '../../config/constants.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useSubmitForm } from '../../hooks/useSubmitForm.js';
import { changePasswordSchema } from '../../validators/auth.js';

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const ChangePasswordForm = ({ currentPasswordLabel, onChanged }) => {
  const { t } = useI18n();
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
        label={currentPasswordLabel ?? t('auth.changePassword.current')}
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
        {...form.register('currentPassword')}
      />
      <FormField
        label={t('auth.changePassword.new')}
        type="password"
        dir="ltr"
        autoComplete="new-password"
        hint={t('auth.changePassword.newHint', { min: PASSWORD_LENGTH.min })}
        required
        {...form.register('newPassword')}
      />
      <FormField
        label={t('auth.changePassword.confirm')}
        type="password"
        dir="ltr"
        autoComplete="new-password"
        required
        {...form.register('confirmPassword')}
      />
      <Button type="submit" icon="key" isLoading={form.isSubmitting}>
        {t('auth.changePassword.submit')}
      </Button>
    </Form>
  );
};
