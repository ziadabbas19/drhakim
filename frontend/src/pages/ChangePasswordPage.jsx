import { useNavigate } from 'react-router';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { AuthCard } from '../features/auth/AuthCard.jsx';
import { ChangePasswordForm } from '../features/auth/ChangePasswordForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useI18n } from '../hooks/useI18n.js';

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isForced = user.mustChangePassword;

  return (
    <AuthCard
      title={t('auth.changePassword.title')}
      description={t('auth.changePassword.greeting', { name: user.fullName })}
    >
      <Seo title={t('auth.changePassword.pageTitle')} noIndex />
      {isForced && <Alert tone="warning">{t('auth.changePassword.forced')}</Alert>}
      <ChangePasswordForm
        currentPasswordLabel={isForced ? t('auth.changePassword.temporary') : undefined}
        onChanged={() => navigate(PATHS.dashboard, { replace: true })}
      />
      <Button variant="ghost" size="sm" icon="logout" className="w-full" onClick={logout}>
        {t('auth.logout')}
      </Button>
    </AuthCard>
  );
}
