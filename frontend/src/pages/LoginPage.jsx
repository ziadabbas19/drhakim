import { Navigate, useLocation } from 'react-router';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { AuthCard } from '../features/auth/AuthCard.jsx';
import { LoginForm } from '../features/auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useI18n } from '../hooks/useI18n.js';

export default function LoginPage() {
  const { t } = useI18n();
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (isReady && user) {
    return <Navigate to={location.state?.from?.pathname ?? PATHS.dashboard} replace />;
  }

  return (
    <AuthCard title={t('auth.login.title')} description={t('auth.login.description')}>
      <Seo title={t('auth.login.pageTitle')} noIndex />
      <LoginForm />
    </AuthCard>
  );
}
