import { useSyncExternalStore } from 'react';

export const ROUTES = {
  login: '/login',
  register: '/registro',
} as const;

export type Route = {
  path: string;
  state: unknown;
};

let current: Route = { path: '', state: null };

/** Instantánea estable mientras la URL y el estado del historial no cambien. */
function getSnapshot(): Route {
  const path = window.location.pathname;
  const state: unknown = window.history.state;
  if (current.path !== path || current.state !== state) current = { path, state };
  return current;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

/**
 * Navega sin recargar (History API, research.md R2). El estado viaja en el historial y nunca en
 * la URL (FR-018).
 */
export function navigate(path: string, state: unknown = null): void {
  window.history.pushState(state, '', path);
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
}

/** Ruta actual; se actualiza con `navigate` y con Atrás/Adelante (FR-017). */
export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getSnapshot);
}
