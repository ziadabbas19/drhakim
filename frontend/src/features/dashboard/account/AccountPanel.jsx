import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { DetailList } from '../../../components/DetailList.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { ChangePasswordForm } from '../../auth/ChangePasswordForm.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { RoleBadge } from '../RoleBadge.jsx';

export const AccountPanel = () => {
  const { user } = useAuth();

  return (
    <>
      <PanelHeader title="حسابي" description="بيانات حسابك وتغيير كلمة المرور." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardHeader title="بيانات الحساب" />
          <DetailList
            className="sm:grid-cols-1"
            items={[
              { label: 'الاسم', value: user.fullName },
              { label: 'البريد الإلكتروني', value: user.email, ltr: true },
              { label: 'الصلاحية', value: <RoleBadge role={user.role} /> },
            ]}
          />
        </Card>
        <Card className="space-y-4">
          <CardHeader title="تغيير كلمة المرور" />
          <ChangePasswordForm />
        </Card>
      </div>
    </>
  );
};
