import { useNavigate } from 'react-router';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { AuthCard } from '../features/auth/AuthCard.jsx';
import { ChangePasswordForm } from '../features/auth/ChangePasswordForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function ChangePasswordPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isForced = user.mustChangePassword;

  return (
    <AuthCard title="تعيين كلمة مرور جديدة" description={`مرحبًا ${user.fullName}`}>
      <Seo title="تغيير كلمة المرور" noIndex />
      {isForced && (
        <Alert tone="warning">
          لحماية حسابك يجب استبدال كلمة المرور المؤقتة بكلمة مرور خاصة بك قبل استخدام لوحة التحكم.
        </Alert>
      )}
      <ChangePasswordForm
        currentPasswordLabel={isForced ? 'كلمة المرور المؤقتة' : 'كلمة المرور الحالية'}
        onChanged={() => navigate(PATHS.dashboard, { replace: true })}
      />
      <Button variant="ghost" size="sm" icon="logout" className="w-full" onClick={logout}>
        تسجيل الخروج
      </Button>
    </AuthCard>
  );
}
