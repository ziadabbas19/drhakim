import { dashboardApi } from '../../../api/dashboard.js';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Icon } from '../../../components/Icon.jsx';
import { IconTile } from '../../../components/IconTile.jsx';
import { MAX_PAGE_SIZE } from '../../../config/constants.js';
import { useAction } from '../../../hooks/useAction.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { ActiveBadge, ActiveToggleButton } from '../ActiveControls.jsx';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { EditButton, RowActions } from '../RowActions.jsx';
import { useActiveToggle } from '../useActiveToggle.js';
import { useRecordModal } from '../useRecordModal.js';
import { ServiceFormModal } from './ServiceFormModal.jsx';

const swapIds = (items, from, to) => {
  const ids = items.map((item) => item.id);
  [ids[from], ids[to]] = [ids[to], ids[from]];
  return ids;
};

export const ServicesPanel = () => {
  const run = useAction();
  const services = usePaginatedList(dashboardApi.services.list, { pageSize: MAX_PAGE_SIZE });
  const serviceModal = useRecordModal(services.reload);

  const toggleActive = useActiveToggle({
    update: dashboardApi.services.update,
    describeDeactivation: (service) => ({
      title: 'إيقاف الخدمة',
      message: `سيتم إخفاء "${service.title}" من صفحات الموقع، ويمكنك تفعيلها مرة أخرى في أي وقت.`,
    }),
    onSuccess: services.reload,
  });

  const move = (index, direction) =>
    run(() => dashboardApi.services.reorder(swapIds(services.items, index, index + direction)), {
      onSuccess: services.reload,
    });

  const columns = [
    {
      key: 'order',
      header: 'الترتيب',
      render: (service) => {
        const index = services.items.indexOf(service);
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" aria-label="تحريك لأعلى" disabled={index === 0} onClick={() => move(index, -1)}>
              <Icon name="arrowUp" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="تحريك لأسفل"
              disabled={index === services.items.length - 1}
              onClick={() => move(index, 1)}
            >
              <Icon name="arrowDown" />
            </Button>
          </div>
        );
      },
    },
    {
      key: 'title',
      header: 'الخدمة',
      render: (service) => (
        <div className="flex items-center gap-3">
          <IconTile name={service.icon} size="sm" />
          <div className="min-w-0">
            <p className="font-bold text-slate-800">{service.title}</p>
            <p className="max-w-md truncate text-xs text-slate-500">{service.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'featured',
      header: 'الرئيسية',
      render: (service) => (service.isFeatured ? <Badge tone="brand">مميزة</Badge> : <span className="text-slate-400">—</span>),
    },
    { key: 'status', header: 'الحالة', render: (service) => <ActiveBadge isActive={service.isActive} activeLabel="ظاهرة" /> },
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
        title="الخدمات والعمليات"
        description="الخدمات التي تظهر للمرضى في الموقع وترتيب عرضها."
        actions={
          <Button icon="plus" onClick={() => serviceModal.open()}>
            إضافة خدمة
          </Button>
        }
      />
      <PaginatedTable list={services} columns={columns} emptyMessage="لم تتم إضافة خدمات بعد" />
      {serviceModal.isOpen && (
        <ServiceFormModal service={serviceModal.record} onClose={serviceModal.close} onSaved={serviceModal.handleSaved} />
      )}
    </>
  );
};
