export const ROUTES = { login: '/login', register: '/registro' } as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/** Convierte una dirección en una ruta válida; la raíz y las desconocidas van a /login (FR-020). */
export function normalizePath(pathname: string): Route {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return path === ROUTES.register ? ROUTES.register : ROUTES.login;
}
