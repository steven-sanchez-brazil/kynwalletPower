import { useSyncExternalStore } from 'react';

/** Rutas de la aplicación (contracts/ui-register.md). */
export const ROUTES = {
  login: '/login',
  register: '/registro',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// pushState/replaceState no emiten popstate: se notifica a los suscriptores con un evento propio.
const NAVIGATE_EVENT = 'kynwallet:navigate';

/** Navegación sin recarga sobre la History API (research.md R1). */
export function navigate(path: string, { replace = false }: { replace?: boolean } = {}): void {
  if (replace) window.history.replaceState(null, '', path);
  else window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
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

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname);
}
