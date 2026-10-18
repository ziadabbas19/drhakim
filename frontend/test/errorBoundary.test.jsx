import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ErrorBoundary } from '../src/components/ErrorBoundary.jsx';
import { I18nProvider } from '../src/i18n/I18nProvider.jsx';
import { text } from './support/site.jsx';

const Broken = () => {
  throw new Error('render failed');
};

const renderInside = (ui) => render(<I18nProvider>{ui}</I18nProvider>);

describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  test('replaces content that fails with a friendly message and a reload button', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload });

    renderInside(
      <>
        <ErrorBoundary scope="page">
          <Broken />
        </ErrorBoundary>
        <p>still here</p>
      </>,
    );

    expect(screen.getByRole('alert').textContent).toContain(text('errors.crash.page'));
    expect(screen.getByText('still here')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: text('errors.crash.reload') }));
    expect(reload).toHaveBeenCalledOnce();
  });

  test('tries again when its reset key changes, for example after navigating', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const Page = () => {
      const [path, setPath] = useState('/broken');
      return (
        <>
          <button type="button" onClick={() => setPath('/fine')}>
            navigate
          </button>
          <ErrorBoundary resetKey={path}>{path === '/broken' ? <Broken /> : <p>fine page</p>}</ErrorBoundary>
        </>
      );
    };
    renderInside(<Page />);

    expect(screen.getByRole('alert').textContent).toContain(text('errors.crash.section'));
    fireEvent.click(screen.getByRole('button', { name: 'navigate' }));
    expect(screen.getByText('fine page')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
