import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useForm } from '../../hooks/useForm.js';
import { useI18n } from '../../hooks/useI18n.js';
import { loginSchema } from '../../validators/auth.js';

export const LoginForm = () => {
  const { t } = useI18n();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: '', password: '' },
    schema: loginSchema,
    onSubmit: login,
  });

  return (
    <Form form={form}>
      <FormField
        label={t('auth.email')}
        type="email"
        dir="ltr"
        inputMode="email"
        autoComplete="username"
        required
        {...form.register('email')}
      />
      <FormField
        label={t('auth.password')}
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
        {...form.register('password')}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={form.isSubmitting}>
        {t('auth.login.submit')}
      </Button>
    </Form>
  );
};
