import { useEffect } from 'react';

export default function useNoBackNavigation() {
  const currentLocation = window.location.pathname;
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handlePopState = (event) => {
      if (currentLocation === '/dashboard-page') {
        window.history.go(1);
      }
      else {
        window.history.pushState({ url: window.location.href }, '');
        window.history.pushState(null, null, window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
  }, []);

  return null;
}
