import { Alert } from './Alert.jsx';
import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';
import { Loader } from './Loader.jsx';

const isEmptyList = (data) => Array.isArray(data) && data.length === 0;

export const AsyncContent = ({ isLoading, error, data, onRetry, emptyMessage, children }) => {
  if (error) {
    return (
      <Alert
        tone="error"
        action={
          onRetry && (
            <Button size="sm" variant="secondary" onClick={onRetry}>
              إعادة المحاولة
            </Button>
          )
        }
      >
        {error.message}
      </Alert>
    );
  }
  if (data == null) return isLoading ? <Loader /> : null;
  if (isEmptyList(data)) return <EmptyState message={emptyMessage} />;
  return children(data);
};
