import { EmptyState } from '../../components/EmptyState.jsx';
import { ReorderButtons, RowActions } from './RowActions.jsx';

// An ordered list for the dashboard: each row can move up or down (saved through useReorder),
// shows its content, and has its own actions.
export const ReorderableList = ({ items, onMove, renderItem, renderActions, emptyMessage }) => {
  if (!items.length) return <EmptyState message={emptyMessage} />;

  return (
    <ol className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((item, index) => (
        <li key={item.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap">
          <ReorderButtons index={index} count={items.length} onMove={onMove} />
          <div className="min-w-0 flex-1">{renderItem(item)}</div>
          <RowActions>{renderActions(item)}</RowActions>
        </li>
      ))}
    </ol>
  );
};
