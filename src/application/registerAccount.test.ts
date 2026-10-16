import type { AuthGateway } from './ports/AuthGateway';
import { createRegisterAccount } from './registerAccount';

describe('createRegisterAccount (contracts/register-gateway.md)', () => {
  it('US1-1, US1-3: recorta fullName, normaliza email y delega en gateway.register conservando la contraseña intacta', async () => {
    const registerMock = vi.fn().mockResolvedValue({
      kind: 'success',
      displayName: 'Ana López',
    });
    const gateway: AuthGateway = {
      authenticate: vi.fn(),
      register: registerMock,
    };
    const registerAccount = createRegisterAccount(gateway);

    const result = await registerAccount({
      fullName: '  Ana López  ',
      email: '  ANA.LOPEZ@Example.COM ',
      password: ' MiClave 123 ',
    });

    expect(registerMock).toHaveBeenCalledWith({
      fullName: 'Ana López',
      email: 'ana.lopez@example.com',
      password: ' MiClave 123 ',
    });
    expect(result).toEqual({ kind: 'success', displayName: 'Ana López' });
  });

  it('R3: devuelve unavailable si el gateway no implementa register', async () => {
    const gateway: AuthGateway = {
      authenticate: vi.fn(),
    };
    const registerAccount = createRegisterAccount(gateway);
    const result = await registerAccount({
      fullName: 'Ana López',
      email: 'ana@example.com',
      password: 'MiClave123',
    });
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('R4: devuelve unavailable si gateway.register lanza una excepción', async () => {
    const gateway: AuthGateway = {
      authenticate: vi.fn(),
      register: vi.fn().mockRejectedValue(new Error('fallo de red')),
    };
    const registerAccount = createRegisterAccount(gateway);
    const result = await registerAccount({
      fullName: 'Ana López',
      email: 'ana@example.com',
      password: 'MiClave123',
    });
    expect(result).toEqual({ kind: 'unavailable' });
  });
});
