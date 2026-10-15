/** Rutas de la aplicación (research.md R10). Fuente única para enlaces y redirecciones. */
export const ROUTES = {
  login: '/login',
  register: '/registro',
} as const;

/** Estado de navegación que `/registro` entrega a `/login` tras un registro exitoso (FR-012). */
export type LoginRouteState = { registered: true };
