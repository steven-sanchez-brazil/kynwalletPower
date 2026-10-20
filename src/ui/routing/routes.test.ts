import { normalizePath } from './routes';

describe('normalizePath (FR-020)', () => {
  it.each([
    ['/login', '/login'],
    ['/registro', '/registro'],
    ['/registro/', '/registro'],
    ['/login/', '/login'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });

  it.each(['/', '', '/desconocida', '/registro/otra', '/Registro'])(
    'FR-020: %j (raíz o dirección desconocida) → /login',
    (input) => {
      expect(normalizePath(input)).toBe('/login');
    },
  );
});
