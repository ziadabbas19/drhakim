import { useAction } from '../../hooks/useAction.js';

const swapIds = (items, from, to) => {
  const ids = items.map((item) => item.id);
  [ids[from], ids[to]] = [ids[to], ids[from]];
  return ids;
};

// Moves one item up or down and saves the whole order in one request, which the API applies atomically.
export const useReorder = ({ items, reorder, onSuccess }) => {
  const run = useAction();
  return (index, direction) => run(() => reorder(swapIds(items, index, index + direction)), { onSuccess });
};
