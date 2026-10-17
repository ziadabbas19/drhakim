import { useI18n } from '../hooks/useI18n.js';
import { Alert } from './Alert.jsx';
import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';
import { Loader } from './Loader.jsx';

const isEmptyList = (data) => Array.isArray(data) && data.length === 0;

// A page's main content keeps the space it will need while loading, so what follows it
// (call to action, footer) does not jump down when it arrives.
const RESERVED_SPACE_CLASS = 'min-h-[70dvh]';

export const AsyncContent = ({
  isLoading,
  error,
  data,
  onRetry,
  emptyMessage,
  emptyAction,
  reserveSpace = false,
  children,
}) => {
  const { t } = useI18n();

  if (error) {
    return (
      <Alert
        tone="error"
        action={
          onRetry && (
            <Button size="sm" variant="secondary" onClick={onRetry}>
              {t('common.retry')}
            </Button>
          )
        }
      >
        {error.message}
      </Alert>
    );
  }
  if (data == null) return isLoading ? <Loader className={reserveSpace ? RESERVED_SPACE_CLASS : undefined} /> : null;
  if (isEmptyList(data)) return <EmptyState message={emptyMessage} action={emptyAction} />;
  return children(data);
};
