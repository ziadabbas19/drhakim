import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { DetailList } from '../../../components/DetailList.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { ChangePasswordForm } from '../../auth/ChangePasswordForm.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { RoleBadge } from '../RoleBadge.jsx';

export const AccountPanel = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <>
      <PanelHeader title={t('dashboard.account.title')} description={t('dashboard.account.description')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardHeader title={t('dashboard.account.details')} />
          <DetailList
            className="sm:grid-cols-1"
            items={[
              { label: t('dashboard.account.name'), value: user.fullName },
              { label: t('dashboard.account.email'), value: user.email, ltr: true },
              { label: t('dashboard.account.role'), value: <RoleBadge role={user.role} /> },
            ]}
          />
        </Card>
        <Card className="space-y-4">
          <CardHeader title={t('dashboard.account.changePassword')} />
          <ChangePasswordForm />
        </Card>
      </div>
    </>
  );
};
