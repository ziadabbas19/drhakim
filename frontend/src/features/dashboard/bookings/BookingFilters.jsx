import { Button } from '../../../components/Button.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { SearchField } from '../../../components/SearchField.jsx';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { todayInCairo } from '../../../utils/date.js';
import { useClinicOptions } from '../clinics/useClinicOptions.js';
import { FilterBar, bindFilter, withAllOption } from '../FilterBar.jsx';

export const BookingFilters = ({ filters, onChange }) => {
  const { t } = useI18n();
  const clinicOptions = useClinicOptions();
  const statusOptions = useOptions('bookingStatus');
  const bind = bindFilter(filters, onChange);

  return (
    <FilterBar>
      <SearchField
        label={t('dashboard.bookings.filters.search')}
        placeholder={t('dashboard.bookings.filters.searchPlaceholder')}
        name="search"
        value={filters.search ?? ''}
        onChange={onChange}
      />
      <FormField
        label={t('dashboard.bookings.filters.clinic')}
        as="select"
        options={withAllOption(t('dashboard.bookings.filters.allClinics'), clinicOptions)}
        {...bind('clinicId')}
      />
      <FormField
        label={t('dashboard.bookings.filters.status')}
        as="select"
        options={withAllOption(t('dashboard.bookings.filters.allStatuses'), statusOptions)}
        {...bind('status')}
      />
      <div className="space-y-1.5">
        <FormField label={t('dashboard.bookings.filters.day')} type="date" {...bind('date')} />
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onChange('date', todayInCairo())}>
            {t('dashboard.bookings.filters.today')}
          </Button>
          {filters.date && (
            <Button variant="ghost" size="sm" onClick={() => onChange('date', '')}>
              {t('dashboard.bookings.filters.allDays')}
            </Button>
          )}
        </div>
      </div>
    </FilterBar>
  );
};
