import { AsyncContent } from '../../components/AsyncContent.jsx';
import { DataTable } from '../../components/DataTable.jsx';

export const PaginatedTable = ({ list, columns, emptyMessage }) => (
  <AsyncContent {...list} onRetry={list.reload}>
    {() => (
      <DataTable
        columns={columns}
        rows={list.items}
        pagination={list.pagination}
        isRefreshing={list.isLoading}
        emptyMessage={emptyMessage}
      />
    )}
  </AsyncContent>
);
