import { useAction } from '../../hooks/useAction.js';

export const useActiveToggle = ({ update, describeDeactivation, onSuccess }) => {
  const run = useAction();

  return (record) =>
    run(() => update(record.id, { isActive: !record.isActive }), {
      confirmation: record.isActive && { confirmLabel: 'إيقاف', ...describeDeactivation(record) },
      onSuccess,
    });
};
