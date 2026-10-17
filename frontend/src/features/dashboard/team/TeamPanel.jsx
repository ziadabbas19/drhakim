import { dashboardApi } from '../../../api/dashboard.js';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { ActiveBadge, ActiveToggleButton } from '../ActiveControls.jsx';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { RoleBadge } from '../RoleBadge.jsx';
import { EditButton, RowActions } from '../RowActions.jsx';
import { useActiveToggle } from '../useActiveToggle.js';
import { useRecordModal } from '../useRecordModal.js';
import { MemberFormModal } from './MemberFormModal.jsx';
import { ResetPasswordModal } from './ResetPasswordModal.jsx';

export const TeamPanel = () => {
  const { user, refreshUser } = useAuth();
  const team = usePaginatedList(dashboardApi.team.list);
  const isSelf = (member) => member.id === user.id;

  const memberModal = useRecordModal(({ data }) => {
    team.reload();
    if (isSelf(data)) refreshUser();
  });
  const resetModal = useRecordModal(team.reload);

  const toggleActive = useActiveToggle({
    update: dashboardApi.team.update,
    describeDeactivation: (member) => ({
      title: 'إيقاف الحساب',
      message: `لن يتمكن ${member.fullName} من الدخول إلى لوحة التحكم حتى يتم تفعيل حسابه مرة أخرى.`,
    }),
    onSuccess: team.reload,
  });

  const columns = [
    {
      key: 'member',
      header: 'العضو',
      render: (member) => (
        <div>
          <p className="flex items-center gap-2 font-bold text-slate-800">
            {member.fullName}
            {isSelf(member) && <Badge tone="brand">أنت</Badge>}
          </p>
          <p className="text-xs text-slate-500">
            <span dir="ltr">{member.email}</span>
          </p>
        </div>
      ),
    },
    { key: 'role', header: 'الصلاحية', render: (member) => <RoleBadge role={member.role} /> },
    {
      key: 'status',
      header: 'الحالة',
      render: (member) => (
        <div className="flex flex-wrap gap-1.5">
          <ActiveBadge isActive={member.isActive} />
          {member.mustChangePassword && <Badge tone="warning">بانتظار تغيير كلمة المرور</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (member) => (
        <RowActions>
          <EditButton onClick={() => memberModal.open(member)} />
          {!isSelf(member) && (
            <>
              <Button variant="ghost" size="sm" icon="key" onClick={() => resetModal.open(member)}>
                كلمة مرور مؤقتة
              </Button>
              <ActiveToggleButton isActive={member.isActive} onClick={() => toggleActive(member)} />
            </>
          )}
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PanelHeader
        title="فريق العمل"
        description="الحسابات التي يمكنها الدخول إلى لوحة التحكم وصلاحياتها."
        actions={
          <Button icon="plus" onClick={() => memberModal.open()}>
            إضافة عضو
          </Button>
        }
      />
      <PaginatedTable list={team} columns={columns} emptyMessage="لا يوجد أعضاء بعد" />
      {memberModal.isOpen && (
        <MemberFormModal
          member={memberModal.record}
          isSelf={Boolean(memberModal.record && isSelf(memberModal.record))}
          onClose={memberModal.close}
          onSaved={memberModal.handleSaved}
        />
      )}
      {resetModal.isOpen && (
        <ResetPasswordModal member={resetModal.record} onClose={resetModal.close} onSaved={resetModal.handleSaved} />
      )}
    </>
  );
};
