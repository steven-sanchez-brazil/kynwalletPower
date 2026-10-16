import { act, renderHook } from '@testing-library/react';
import { useNavigation } from './useNavigation';

afterEach(() => history.replaceState(null, '', '/'));

describe('Inicio FR-007 · contrato de transición protegido', () => {
  it('descarta un callback de generación anterior antes de abrir Inicio', () => {
    history.replaceState(null, '', '/login');
    const { result } = renderHook(() => useNavigation());
    const pending = result.current.loginCompleted;
    const generation = result.current.route.session;
    act(() => {
      result.current.navigate('/registro');
      pending(generation, 'Respuesta tardía');
    });
    expect(result.current.route.path).toBe('/registro');
    expect(result.current.route.displayName).toBeNull();
    expect(location.pathname).toBe('/registro');
  });

  it('solo acepta éxito en login; no lo acepta en Registro ni sobre una sesión abierta', () => {
    history.replaceState(null, '', '/registro');
    const { result } = renderHook(() => useNavigation());
    act(() => result.current.loginCompleted(result.current.route.session, 'Nombre indebido'));
    expect(result.current.route.displayName).toBeNull();
    act(() => result.current.navigate('/login'));
    act(() => result.current.loginCompleted(result.current.route.session, 'Persona Demo'));
    expect(result.current.route.displayName).toBe('Persona Demo');
    act(() => result.current.loginCompleted(result.current.route.session, 'Nombre indebido'));
    expect(result.current.route.displayName).toBe('Persona Demo');
    expect(location.pathname).toBe('/inicio');
  });
});
