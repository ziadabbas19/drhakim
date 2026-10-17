import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { BOOKING_STATUS_OPTIONS } from '../../../config/constants.js';
import { todayInCairo } from '../../../utils/date.js';
import { useClinicOptions } from '../clinics/useClinicOptions.js';

const SEARCH_DELAY_MS = 400;

const withAllOption = (label, options) => [{ value: '', label }, ...options];

export const BookingFilters = ({ filters, onChange }) => {
  const clinicOptions = useClinicOptions();
  const [search, setSearch] = useState(filters.search ?? '');

  useEffect(() => {
    const term = search.trim();
    if (term === (filters.search ?? '')) return undefined;
    const timer = setTimeout(() => onChange('search', term), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search, filters.search, onChange]);

  const bindFilter = (name) => ({ value: filters[name] ?? '', onChange: (event) => onChange(name, event.target.value) });

  return (
    <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormField
        label="بحث"
        type="search"
        placeholder="اسم أو موبايل أو رقم حجز"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <FormField label="العيادة" as="select" options={withAllOption('كل العيادات', clinicOptions)} {...bindFilter('clinicId')} />
      <FormField
        label="الحالة"
        as="select"
        options={withAllOption('كل الحالات', BOOKING_STATUS_OPTIONS)}
        {...bindFilter('status')}
      />
      <div className="space-y-1.5">
        <FormField label="اليوم" type="date" {...bindFilter('date')} />
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onChange('date', todayInCairo())}>
            حجوزات اليوم
          </Button>
          {filters.date && (
            <Button variant="ghost" size="sm" onClick={() => onChange('date', '')}>
              كل الأيام
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
