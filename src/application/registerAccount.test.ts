import { createRegisterAccount } from './registerAccount';
import type { RegistrationGateway } from './ports/RegistrationGateway';

const values = {
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  password: 'clave1234',
  confirmPassword: 'clave1234',
  acceptedTerms: true,
};

describe('Registro · caso de uso (FR-010–FR-013)', () => {
  it('simula una sola vez sin entregar datos personales al adaptador', async () => {
    const gateway: RegistrationGateway = { simulate: vi.fn().mockResolvedValue(undefined) };
    const register = createRegisterAccount(gateway);
    await expect(register(values)).resolves.toEqual({ kind: 'success' });
    expect(gateway.simulate).toHaveBeenCalledOnce();
    expect(gateway.simulate).toHaveBeenCalledWith();
  });

  it('no invoca el adaptador si los datos son inválidos', async () => {
    const gateway: RegistrationGateway = { simulate: vi.fn() };
    const register = createRegisterAccount(gateway);
    const result = await register({ ...values, acceptedTerms: false });
    expect(result.kind).toBe('invalid');
    expect(gateway.simulate).not.toHaveBeenCalled();
  });

  it('convierte un fallo inesperado en error seguro', async () => {
    const gateway: RegistrationGateway = {
      simulate: vi.fn().mockRejectedValue(new Error('secreto')),
    };
    const register = createRegisterAccount(gateway);
    await expect(register(values)).resolves.toEqual({ kind: 'error' });
  });
});
