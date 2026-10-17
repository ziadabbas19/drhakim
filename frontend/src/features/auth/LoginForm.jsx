import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useForm } from '../../hooks/useForm.js';
import { loginSchema } from '../../validators/auth.js';

export const LoginForm = () => {
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: '', password: '' },
    schema: loginSchema,
    onSubmit: login,
  });

  return (
    <Form form={form}>
      <FormField
        label="البريد الإلكتروني"
        type="email"
        dir="ltr"
        inputMode="email"
        autoComplete="username"
        required
        {...form.register('email')}
      />
      <FormField
        label="كلمة المرور"
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
        {...form.register('password')}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={form.isSubmitting}>
        تسجيل الدخول
      </Button>
    </Form>
  );
};
