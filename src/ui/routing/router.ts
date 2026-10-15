import { useEffect, useSyncExternalStore } from 'react';

/** Rutas de la aplicación (contracts/routing.md, research.md R2). */
export const ROUTES = { login: '/login', register: '/registro' } as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

const TITLES: Record<Route, string> = {
  [ROUTES.login]: 'KynWallet · Iniciar sesión',
  [ROUTES.register]: 'KynWallet · Crear cuenta',
};

const NAVIGATE_EVENT = 'kynwallet:navigate';

function toRoute(pathname: string): Route {
  return pathname === ROUTES.register ? ROUTES.register : ROUTES.login;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAVIGATE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAVIGATE_EVENT, onChange);
  };
}

const getPathname = () => window.location.pathname;

/** Agrega una entrada al historial y notifica a los componentes que usan useRoute. */
export function navigate(route: Route): void {
  window.history.pushState(null, '', route);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

/** Ruta actual. Una ruta desconocida se reemplaza por /login sin agregar historial (N3). */
export function useRoute(): Route {
  const pathname = useSyncExternalStore(subscribe, getPathname);
  const route = toRoute(pathname);

  useEffect(() => {
    if (pathname !== route) window.history.replaceState(null, '', route);
    document.title = TITLES[route];
  }, [pathname, route]);

  return route;
}
