import { act, renderHook } from '@testing-library/react';
import { navigate, ROUTES, useRoute } from './router';

describe('router (contracts/routing.md)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/login');
  });

  it('N1: navigate cambia la URL y useRoute la refleja', () => {
    const { result } = renderHook(() => useRoute());
    expect(result.current).toBe(ROUTES.login);
    act(() => navigate(ROUTES.register));
    expect(window.location.pathname).toBe('/registro');
    expect(result.current).toBe(ROUTES.register);
  });

  it('N2: atrás del navegador (popstate) actualiza la ruta', () => {
    const { result } = renderHook(() => useRoute());
    act(() => navigate(ROUTES.register));
    act(() => {
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current).toBe(ROUTES.login);
  });

  it.each(['/', '/otra'])('N3: ruta desconocida (%s) se reemplaza por /login', (path) => {
    window.history.replaceState(null, '', path);
    const length = window.history.length;
    const { result } = renderHook(() => useRoute());
    expect(result.current).toBe(ROUTES.login);
    expect(window.location.pathname).toBe('/login');
    expect(window.history.length).toBe(length);
  });

  it('N4: el título de la pestaña corresponde a la ruta', () => {
    renderHook(() => useRoute());
    expect(document.title).toBe('KynWallet · Iniciar sesión');
    act(() => navigate(ROUTES.register));
    expect(document.title).toBe('KynWallet · Crear cuenta');
  });
});
