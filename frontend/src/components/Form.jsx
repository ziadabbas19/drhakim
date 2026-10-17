import { Alert } from './Alert.jsx';

export const Form = ({ form, id, className = 'space-y-4', children }) => (
  <form id={id} onSubmit={form.handleSubmit} noValidate className={className}>
    {form.submitError && <Alert tone="error">{form.submitError}</Alert>}
    {children}
  </form>
);
