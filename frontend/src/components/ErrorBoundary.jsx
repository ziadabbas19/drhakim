import { Component } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { Button } from './Button.jsx';
import { Container } from './Container.jsx';
import { EmptyState } from './EmptyState.jsx';

const reloadPage = () => window.location.reload();

const CrashMessage = ({ scope }) => {
  const { t } = useI18n();
  const message = (
    <div role="alert">
      <EmptyState
        icon="warning"
        message={scope === 'page' ? t('errors.crash.page') : t('errors.crash.section')}
        action={
          <Button size="sm" variant="secondary" icon="reload" onClick={reloadPage}>
            {t('errors.crash.reload')}
          </Button>
        }
      />
    </div>
  );

  return scope === 'page' ? <Container className="py-16">{message}</Container> : message;
};

class Boundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previous) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

// If its content fails while rendering, only that content is replaced by a friendly message with
// a reload button; the rest of the page keeps working. A new `resetKey` (e.g. the path) tries again.
export const ErrorBoundary = ({ scope = 'section', resetKey, children }) => (
  <Boundary resetKey={resetKey} fallback={<CrashMessage scope={scope} />}>
    {children}
  </Boundary>
);
