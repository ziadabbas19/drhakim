import { useAction } from '../../hooks/useAction.js';
import { useI18n } from '../../hooks/useI18n.js';

export const useActiveToggle = ({ update, describeDeactivation, onSuccess }) => {
  const { t } = useI18n();
  const run = useAction();

  return (record) =>
    run(() => update(record.id, { isActive: !record.isActive }), {
      confirmation: record.isActive && { confirmLabel: t('common.deactivate'), ...describeDeactivation(record) },
      onSuccess,
    });
};
