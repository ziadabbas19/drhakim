import { dashboardApi } from '../../../api/dashboard.js';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { IconTile } from '../../../components/IconTile.jsx';
import { MAX_PAGE_SIZE } from '../../../config/constants.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { ActiveBadge, ActiveToggleButton } from '../ActiveControls.jsx';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { EditButton, ReorderButtons, RowActions } from '../RowActions.jsx';
import { useActiveToggle } from '../useActiveToggle.js';
import { useRecordModal } from '../useRecordModal.js';
import { useReorder } from '../useReorder.js';
import { ServiceFormModal } from './ServiceFormModal.jsx';

export const ServicesPanel = () => {
  const { t, pick } = useI18n();
  const services = usePaginatedList(dashboardApi.services.list, { pageSize: MAX_PAGE_SIZE });
  const serviceModal = useRecordModal(services.reload);
  const move = useReorder({
    items: services.items,
    reorder: dashboardApi.services.reorder,
    onSuccess: services.reload,
  });

  const toggleActive = useActiveToggle({
    update: dashboardApi.services.update,
    describeDeactivation: (service) => ({
      title: t('dashboard.services.deactivate.title'),
      message: t('dashboard.services.deactivate.message', { name: pick(service, 'title') }),
    }),
    onSuccess: services.reload,
  });

  const columns = [
    {
      key: 'order',
      header: t('dashboard.services.columns.order'),
      render: (service) => (
        <ReorderButtons index={services.items.indexOf(service)} count={services.items.length} onMove={move} />
      ),
    },
    {
      key: 'title',
      header: t('dashboard.services.columns.service'),
      render: (service) => (
        <div className="flex items-center gap-3">
          <IconTile name={service.icon} size="sm" />
          <div className="min-w-0">
            <p className="font-bold text-ink-strong">{pick(service, 'title')}</p>
            <p className="max-w-md truncate text-xs text-ink-subtle">{pick(service, 'description')}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'featured',
      header: t('dashboard.services.columns.featured'),
      render: (service) =>
        service.isFeatured ? (
          <Badge tone="brand">{t('dashboard.services.featured')}</Badge>
        ) : (
          <span className="text-ink-subtle">—</span>
        ),
    },
    {
      key: 'status',
      header: t('dashboard.services.columns.status'),
      render: (service) => <ActiveBadge isActive={service.isActive} activeLabel={t('common.visible')} />,
    },
    {
      key: 'actions',
      header: '',
      render: (service) => (
        <RowActions>
          <EditButton onClick={() => serviceModal.open(service)} />
          <ActiveToggleButton isActive={service.isActive} onClick={() => toggleActive(service)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PanelHeader
        title={t('dashboard.services.title')}
        description={t('dashboard.services.description')}
        actions={
          <Button icon="plus" onClick={() => serviceModal.open()}>
            {t('dashboard.services.add')}
          </Button>
        }
      />
      <PaginatedTable list={services} columns={columns} emptyMessage={t('dashboard.services.empty')} />
      {serviceModal.isOpen && (
        <ServiceFormModal
          service={serviceModal.record}
          onClose={serviceModal.close}
          onSaved={serviceModal.handleSaved}
        />
      )}
    </>
  );
};
