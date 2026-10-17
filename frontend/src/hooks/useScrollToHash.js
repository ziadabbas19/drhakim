import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Scrolls to #id once the content it refers to has loaded (links such as /about#reviews).
export const useScrollToHash = (id, isReady) => {
  const { hash } = useLocation();

  useEffect(() => {
    if (isReady && hash === `#${id}`) document.getElementById(id)?.scrollIntoView();
  }, [id, hash, isReady]);
};
