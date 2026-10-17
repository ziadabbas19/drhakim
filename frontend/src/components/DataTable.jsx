import { cn } from '../utils/cn.js';
import { EmptyState } from './EmptyState.jsx';
import { Pagination } from './Pagination.jsx';

const renderCell = (column, row) => (column.render ? column.render(row) : row[column.key]);

// Phone cards label each value with its column header; a column can give a different one (or none).
const mobileLabel = (column) => ('mobileHeader' in column ? column.mobileHeader : column.header);

export const DataTable = ({ columns, rows, rowKey = 'id', emptyMessage, pagination, isRefreshing = false }) => {
  if (!rows.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className={cn('space-y-4 transition-opacity', isRefreshing && 'opacity-60')} aria-busy={isRefreshing}>
      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface md:block">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-xs font-bold text-ink-subtle">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 text-start whitespace-nowrap">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row[rowKey]} className="hover:bg-surface-muted">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3 align-middle', column.className)}>
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row[rowKey]} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <dl className="space-y-2.5">
              {columns.map((column) =>
                mobileLabel(column) ? (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-xs font-bold text-ink-subtle">{mobileLabel(column)}</dt>
                    <dd className="min-w-0 text-end text-sm">{renderCell(column, row)}</dd>
                  </div>
                ) : (
                  <dd key={column.key} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                    {renderCell(column, row)}
                  </dd>
                ),
              )}
            </dl>
          </li>
        ))}
      </ul>

      {pagination && <Pagination {...pagination} />}
    </div>
  );
};
