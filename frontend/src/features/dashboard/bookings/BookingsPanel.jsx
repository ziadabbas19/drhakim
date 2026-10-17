import { dashboardApi } from '../../../api/dashboard.js';
import { Ltr } from '../../../components/Ltr.jsx';
import { PhoneLink } from '../../../components/PhoneLink.jsx';
import { BOOKING_STATUS } from '../../../config/constants.js';
import { useAction } from '../../../hooks/useAction.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { DeleteButton, RowActions } from '../RowActions.jsx';
import { BookingFilters } from './BookingFilters.jsx';
import { StatusSelect } from './StatusSelect.jsx';

export const BookingsPanel = () => {
  const { t, pick } = useI18n();
  const format = useFormat();
  const run = useAction();
  const bookings = usePaginatedList(dashboardApi.bookings.list);

  const changeStatus = (booking, status) =>
    run(() => dashboardApi.bookings.updateStatus(booking.id, status), {
      confirmation: status === BOOKING_STATUS.CANCELLED && {
        title: t('dashboard.bookings.cancel.title'),
        message: t('dashboard.bookings.cancel.message', { name: booking.patientName }),
        confirmLabel: t('dashboard.bookings.cancel.confirm'),
      },
      onSuccess: bookings.reload,
    });

  const remove = (booking) =>
    run(() => dashboardApi.bookings.remove(booking.id), {
      confirmation: {
        title: t('dashboard.bookings.remove.title'),
        message: t('dashboard.bookings.remove.message', { name: booking.patientName, code: booking.referenceCode }),
        confirmLabel: t('common.delete'),
      },
      onSuccess: bookings.reload,
    });

  const columns = [
    {
      key: 'referenceCode',
      header: t('dashboard.bookings.columns.reference'),
      render: (booking) => (
        <span className="font-mono font-bold text-ink">
          <Ltr>{booking.referenceCode}</Ltr>
        </span>
      ),
    },
    {
      key: 'patient',
      header: t('dashboard.bookings.columns.patient'),
      render: (booking) => (
        <div className="space-y-0.5">
          <p className="font-bold text-ink-strong">
            {booking.patientName}
            {booking.age !== null && (
              <span className="font-normal text-ink-subtle"> · {t('common.years', { count: booking.age })}</span>
            )}
          </p>
          <PhoneLink phone={booking.phone} className="font-semibold" />
          {booking.notes && (
            <p className="max-w-xs truncate text-xs text-ink-subtle" title={booking.notes}>
              {booking.notes}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'clinic',
      header: t('dashboard.bookings.columns.clinic'),
      render: (booking) => pick(booking.clinic, 'name'),
    },
    {
      key: 'appointment',
      header: t('dashboard.bookings.columns.appointment'),
      render: (booking) => (
        <div>
          <p className="font-bold text-ink-strong">{format.date(booking.date, 'medium')}</p>
          <p className="text-ink-subtle">{format.time(booking.time)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('dashboard.bookings.columns.status'),
      render: (booking) => <StatusSelect value={booking.status} onChange={(status) => changeStatus(booking, status)} />,
    },
    {
      key: 'actions',
      header: '',
      render: (booking) => (
        <RowActions>
          <DeleteButton onClick={() => remove(booking)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PanelHeader title={t('dashboard.bookings.title')} description={t('dashboard.bookings.description')} />
      <BookingFilters filters={bookings.filters} onChange={bookings.setFilter} />
      <PaginatedTable list={bookings} columns={columns} emptyMessage={t('dashboard.bookings.empty')} />
    </>
  );
};
