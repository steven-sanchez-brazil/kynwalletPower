import type { Navigation } from './Navigation';
export function createBrowserNavigation(): Navigation {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  return {
    getPath: () => window.location.pathname,
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener('popstate', notify);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener('popstate', notify);
      };
    },
    navigate(path, mode = 'push') {
      if (mode === 'replace') window.history.replaceState(null, '', path);
      else window.history.pushState(null, '', path);
      notify();
    },
  };
}
