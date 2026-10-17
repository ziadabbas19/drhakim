import { Navigate, useLocation } from 'react-router';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { AuthCard } from '../features/auth/AuthCard.jsx';
import { LoginForm } from '../features/auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (isReady && user) {
    return <Navigate to={location.state?.from?.pathname ?? PATHS.dashboard} replace />;
  }

  return (
    <AuthCard title="تسجيل الدخول" description="هذه الصفحة مخصصة لفريق العيادة لإدارة الحجوزات والمواعيد.">
      <Seo title="تسجيل الدخول" noIndex />
      <LoginForm />
    </AuthCard>
  );
}
