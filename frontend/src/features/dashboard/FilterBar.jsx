// Shared pieces of the dashboard's list filters.
export const FilterBar = ({ children }) => (
  <div className="mb-5 grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
    {children}
  </div>
);

export const withAllOption = (label, options) => [{ value: '', label }, ...options];

// Value and change handler for a select bound to one filter.
export const bindFilter = (filters, onChange) => (name) => ({
  value: filters[name] ?? '',
  onChange: (event) => onChange(name, event.target.value),
});
