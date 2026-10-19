import { hashPassword } from './passwordHash';

describe('hashPassword (FR-011, SC-006)', () => {
  it('FR-011: genera un resumen SHA-256 en hexadecimal y nunca contiene la contraseña en texto plano', async () => {
    const secret = 'KynWallet2026!';
    const digest = await hashPassword('ana@example.test', secret);
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(digest).not.toContain(secret);
  });

  it('US1-4: es determinista para el mismo correo normalizado y contraseña', async () => {
    const first = await hashPassword('  Ana@Example.test ', 'KynWallet2026!');
    const second = await hashPassword('ana@example.test', 'KynWallet2026!');
    expect(first).toBe(second);
  });

  it('produce resúmenes distintos ante correos o contraseñas diferentes', async () => {
    const base = await hashPassword('ana@example.test', 'KynWallet2026!');
    const otherEmail = await hashPassword('otro@example.test', 'KynWallet2026!');
    const otherPass = await hashPassword('ana@example.test', 'OtraClave2026!');
    expect(base).not.toBe(otherEmail);
    expect(base).not.toBe(otherPass);
  });
});
