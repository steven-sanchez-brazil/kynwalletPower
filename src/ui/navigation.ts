/** Navegación de la demo sin recargar ni guardar datos del formulario en el historial. */
export function navigateTo(path: string, state: { registrationSuccess?: boolean } = {}) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
}
