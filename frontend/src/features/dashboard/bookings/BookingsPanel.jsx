import { dashboardApi } from '../../../api/dashboard.js';
import { PhoneLink } from '../../../components/PhoneLink.jsx';
import { BOOKING_STATUS } from '../../../config/constants.js';
import { useAction } from '../../../hooks/useAction.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { formatDate, formatTime } from '../../../utils/date.js';
import { formatNumber } from '../../../utils/number.js';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { DeleteButton, RowActions } from '../RowActions.jsx';
import { BookingFilters } from './BookingFilters.jsx';
import { StatusSelect } from './StatusSelect.jsx';

export const BookingsPanel = () => {
  const run = useAction();
  const bookings = usePaginatedList(dashboardApi.bookings.list);

  const changeStatus = (booking, status) =>
    run(() => dashboardApi.bookings.updateStatus(booking.id, status), {
      confirmation: status === BOOKING_STATUS.CANCELLED && {
        title: 'إلغاء الحجز',
        message: `سيتم إلغاء حجز ${booking.patientName} وإتاحة الموعد لمرضى آخرين. هل تريد المتابعة؟`,
        confirmLabel: 'إلغاء الحجز',
      },
      onSuccess: bookings.reload,
    });

  const remove = (booking) =>
    run(() => dashboardApi.bookings.remove(booking.id), {
      confirmation: {
        title: 'حذف الحجز نهائيًا',
        message: `هل تريد حذف حجز ${booking.patientName} (${booking.referenceCode})؟ لا يمكن التراجع عن الحذف.`,
        confirmLabel: 'حذف',
      },
      onSuccess: bookings.reload,
    });

  const columns = [
    {
      key: 'referenceCode',
      header: 'رقم الحجز',
      render: (booking) => (
        <span dir="ltr" className="font-mono font-bold text-slate-700">
          {booking.referenceCode}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'المريض',
      render: (booking) => (
        <div className="space-y-0.5">
          <p className="font-bold text-slate-800">
            {booking.patientName}
            {booking.age !== null && <span className="font-normal text-slate-500"> · {formatNumber(booking.age)} سنة</span>}
          </p>
          <PhoneLink phone={booking.phone} className="font-semibold" />
          {booking.notes && (
            <p className="max-w-xs truncate text-xs text-slate-500" title={booking.notes}>
              {booking.notes}
            </p>
          )}
        </div>
      ),
    },
    { key: 'clinic', header: 'العيادة', render: (booking) => booking.clinic?.name },
    {
      key: 'appointment',
      header: 'الموعد',
      render: (booking) => (
        <div>
          <p className="font-bold text-slate-800">{formatDate(booking.date, 'medium')}</p>
          <p className="text-slate-500">{formatTime(booking.time)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
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
      <PanelHeader title="الحجوزات" description="متابعة حجوزات المرضى وتحديث حالتها في كل العيادات." />
      <BookingFilters filters={bookings.filters} onChange={bookings.setFilter} />
      <PaginatedTable list={bookings} columns={columns} emptyMessage="لا توجد حجوزات مطابقة للبحث" />
    </>
  );
};
