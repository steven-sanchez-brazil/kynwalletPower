import { act, renderHook } from '@testing-library/react';
import { navigate, ROUTES, usePathname } from './router';

describe('router (FR-016, research.md R1)', () => {
  it('navigate agrega una entrada al historial y actualiza usePathname', () => {
    const { result } = renderHook(() => usePathname());
    expect(result.current).toBe('/');
    const before = window.history.length;

    act(() => navigate(ROUTES.register));

    expect(result.current).toBe('/registro');
    expect(window.location.pathname).toBe('/registro');
    expect(window.history.length).toBe(before + 1);
  });

  it('navigate con replace no agrega una entrada al historial', () => {
    const { result } = renderHook(() => usePathname());
    const before = window.history.length;

    act(() => navigate(ROUTES.login, { replace: true }));

    expect(result.current).toBe('/login');
    expect(window.history.length).toBe(before);
  });

  it('US4-4: un evento popstate (atrás/adelante) actualiza usePathname', () => {
    const { result } = renderHook(() => usePathname());
    act(() => {
      window.history.replaceState(null, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current).toBe('/registro');
  });
});
