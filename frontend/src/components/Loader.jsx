import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

export const Loader = ({ fullPage = false, className }) => {
  const { t } = useI18n();

  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-3 text-ink-subtle',
        fullPage ? 'min-h-dvh' : 'py-10',
        className,
      )}
    >
      <Icon name="loader" className="size-6 text-primary motion-safe:animate-spin" />
      <span className="text-sm font-semibold">{t('common.loading')}</span>
    </div>
  );
};
