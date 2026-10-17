import { dashboardApi } from '../../../api/dashboard.js';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Ltr } from '../../../components/Ltr.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useI18n } from '../../../hooks/useI18n.js';
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
  const { t } = useI18n();
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
      title: t('dashboard.team.deactivate.title'),
      message: t('dashboard.team.deactivate.message', { name: member.fullName }),
    }),
    onSuccess: team.reload,
  });

  const columns = [
    {
      key: 'member',
      header: t('dashboard.team.columns.member'),
      render: (member) => (
        <div>
          <p className="flex items-center gap-2 font-bold text-ink-strong">
            {member.fullName}
            {isSelf(member) && <Badge tone="brand">{t('common.you')}</Badge>}
          </p>
          <p className="text-xs text-ink-subtle">
            <Ltr>{member.email}</Ltr>
          </p>
        </div>
      ),
    },
    { key: 'role', header: t('dashboard.team.columns.role'), render: (member) => <RoleBadge role={member.role} /> },
    {
      key: 'status',
      header: t('dashboard.team.columns.status'),
      render: (member) => (
        <div className="flex flex-wrap gap-1.5">
          <ActiveBadge isActive={member.isActive} />
          {member.mustChangePassword && <Badge tone="warning">{t('dashboard.team.pendingPassword')}</Badge>}
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
                {t('dashboard.team.temporaryPassword')}
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
        title={t('dashboard.team.title')}
        description={t('dashboard.team.description')}
        actions={
          <Button icon="plus" onClick={() => memberModal.open()}>
            {t('dashboard.team.add')}
          </Button>
        }
      />
      <PaginatedTable list={team} columns={columns} emptyMessage={t('dashboard.team.empty')} />
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
