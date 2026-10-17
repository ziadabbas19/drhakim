import { useI18n } from '../hooks/useI18n.js';
import { Icon } from './Icon.jsx';

export const EmptyState = ({ message, icon = 'inbox', action }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface-muted px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-surface text-ink-subtle shadow-sm">
        <Icon name={icon} className="size-6" />
      </span>
      <p className="font-semibold text-ink-muted">{message ?? t('common.empty')}</p>
      {action}
    </div>
  );
};
