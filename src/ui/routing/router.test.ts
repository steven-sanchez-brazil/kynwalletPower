import { act, renderHook } from '@testing-library/react';
import { navigate, ROUTES, useRoute } from './router';

describe('router (FR-017, research.md R2)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('useRoute devuelve la ruta actual', () => {
    window.history.replaceState(null, '', ROUTES.register);
    const { result } = renderHook(() => useRoute());
    expect(result.current.path).toBe('/registro');
  });

  it('navigate cambia la URL y re-renderiza con la nueva ruta', () => {
    const { result } = renderHook(() => useRoute());
    act(() => navigate(ROUTES.register));
    expect(window.location.pathname).toBe('/registro');
    expect(result.current.path).toBe('/registro');
  });

  it('FR-018: navigate guarda el estado en el historial, no en la URL', () => {
    const { result } = renderHook(() => useRoute());
    act(() => navigate(ROUTES.login, { registered: true }));
    expect(window.location.href).not.toContain('registered');
    expect(result.current.state).toEqual({ registered: true });
  });

  it('US3-3: reacciona a Atrás/Adelante del navegador (popstate)', () => {
    const { result } = renderHook(() => useRoute());
    act(() => navigate(ROUTES.register));
    act(() => {
      window.history.replaceState(null, '', ROUTES.login);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.path).toBe('/login');
  });
});
