import { act, renderHook, waitFor } from '@testing-library/react';
import { useRoute } from './useRoute';

const goTo = (path: string) => window.history.replaceState(null, '', path);

describe('useRoute (FR-020, research.md R1)', () => {
  beforeEach(() => goTo('/'));

  it('FR-020: la raíz se reemplaza por /login', () => {
    const { result } = renderHook(() => useRoute());
    expect(result.current.route).toBe('/login');
    expect(window.location.pathname).toBe('/login');
  });

  it('FR-020: una dirección desconocida se reemplaza por /login sin añadir historial', () => {
    goTo('/desconocida');
    const before = window.history.length;
    const { result } = renderHook(() => useRoute());
    expect(result.current.route).toBe('/login');
    expect(window.location.pathname).toBe('/login');
    expect(window.history.length).toBe(before);
  });

  it('FR-020: /registro se conserva como ruta actual', () => {
    goTo('/registro');
    const { result } = renderHook(() => useRoute());
    expect(result.current.route).toBe('/registro');
    expect(window.location.pathname).toBe('/registro');
  });

  it('FR-020: navigate cambia la ruta y la dirección con una nueva entrada de historial', () => {
    goTo('/login');
    const { result } = renderHook(() => useRoute());
    const before = window.history.length;
    act(() => result.current.navigate('/registro'));
    expect(result.current.route).toBe('/registro');
    expect(window.location.pathname).toBe('/registro');
    expect(window.history.length).toBe(before + 1);
  });

  it('FR-020: navegar a la ruta actual no duplica el historial', () => {
    goTo('/login');
    const { result } = renderHook(() => useRoute());
    const before = window.history.length;
    act(() => result.current.navigate('/login'));
    expect(window.history.length).toBe(before);
  });

  it('FR-020: atrás y adelante del navegador actualizan la ruta', async () => {
    goTo('/login');
    const { result } = renderHook(() => useRoute());
    act(() => result.current.navigate('/registro'));
    act(() => window.history.back());
    await waitFor(() => expect(result.current.route).toBe('/login'));
    act(() => window.history.forward());
    await waitFor(() => expect(result.current.route).toBe('/registro'));
  });
});
