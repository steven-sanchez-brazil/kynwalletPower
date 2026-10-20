import { useCallback, useEffect, useState } from 'react';
import { normalizePath, type Route } from './routes';

const currentRoute = () => normalizePath(window.location.pathname);

/** Enrutamiento mínimo sobre la API de historial del navegador (research.md R1). */
export function useRoute() {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    // Direcciones desconocidas (incluida la raíz) se reemplazan por una ruta válida.
    const sync = () => {
      const next = currentRoute();
      if (window.location.pathname !== next) window.history.replaceState(null, '', next);
      setRoute(next);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const navigate = useCallback((next: Route) => {
    if (currentRoute() === next && window.location.pathname === next) return;
    window.history.pushState(null, '', next);
    setRoute(next);
  }, []);

  return { route, navigate };
}
