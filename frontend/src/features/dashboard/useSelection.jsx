import { useState } from 'react';

const CHECKBOX_CLASS = 'size-4 accent-primary';

// Rows picked for a bulk action. Only rows currently listed count as selected.
export const useSelection = (items) => {
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const selected = items.filter((item) => selectedIds.has(item.id));
  const allSelected = items.length > 0 && selected.length === items.length;

  return {
    selected,
    allSelected,
    isSelected: (item) => selectedIds.has(item.id),
    toggle: (item) =>
      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      }),
    toggleAll: () => setSelectedIds(allSelected ? new Set() : new Set(items.map((item) => item.id))),
    clear: () => setSelectedIds(new Set()),
  };
};

// A checkbox column for DataTable. On phones each card shows only its own checkbox.
export const selectionColumn = (selection, { selectAllLabel, rowLabel }) => ({
  key: 'select',
  header: (
    <input
      type="checkbox"
      aria-label={selectAllLabel}
      checked={selection.allSelected}
      onChange={selection.toggleAll}
      className={CHECKBOX_CLASS}
    />
  ),
  mobileHeader: '',
  render: (item) => (
    <input
      type="checkbox"
      aria-label={rowLabel(item)}
      checked={selection.isSelected(item)}
      onChange={() => selection.toggle(item)}
      className={CHECKBOX_CLASS}
    />
  ),
});
