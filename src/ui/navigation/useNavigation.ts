import { useCallback, useEffect, useRef, useState } from 'react';
import type { Destination } from '@/ui/components/NavigationLink/NavigationLink';

type NavigationState = {
  path: string;
  session: number;
  registrationNotice: boolean;
  displayName: string | null;
};

export function useNavigation() {
  const [route, setRoute] = useState<NavigationState>(() => ({
    path: window.location.pathname === '/inicio' ? '/login' : window.location.pathname,
    session: 0,
    registrationNotice: false,
    displayName: null,
  }));
  const current = useRef(route);
  const update = useCallback(
    (path: string, registrationNotice = false, displayName: string | null = null) => {
      if (path === '/inicio' && !displayName) {
        path = '/login';
        window.history.replaceState(null, '', path);
      }
      const next = { path, registrationNotice, displayName, session: current.current.session + 1 };
      // Invalidar antes del commit evita que un resultado pendiente gane a popstate.
      current.current = next;
      setRoute(next);
    },
    [],
  );
  const navigate = useCallback(
    (path: Destination) => {
      window.history.pushState(null, '', path);
      update(path);
    },
    [update],
  );
  const registrationCompleted = (session: number) => {
    if (current.current.session !== session || current.current.path !== '/registro') return;
    window.history.pushState(null, '', '/login');
    update('/login', true);
  };
  const loginCompleted = (session: number, displayName: string) => {
    if (
      current.current.session !== session ||
      current.current.path === '/registro' ||
      current.current.path === '/inicio'
    )
      return;
    window.history.pushState(null, '', '/inicio');
    update('/inicio', false, displayName);
  };
  const logout = () => {
    window.history.replaceState(null, '', '/login');
    update('/login');
  };
  useEffect(() => {
    if (window.location.pathname === '/inicio' && !current.current.displayName) {
      window.history.replaceState(null, '', '/login');
    }
    const reset = () => update(window.location.pathname);
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };
    window.addEventListener('popstate', reset);
    window.addEventListener('pagehide', reset);
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('popstate', reset);
      window.removeEventListener('pagehide', reset);
      window.removeEventListener('pageshow', restore);
    };
  }, [update]);
  return { route, navigate, registrationCompleted, loginCompleted, logout };
}
