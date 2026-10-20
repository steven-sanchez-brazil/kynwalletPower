import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegister } from './register';

describe('createRegister (contracts/registration-gateway.md)', () => {
  it('U1: delega con el correo normalizado, el nombre recortado y la contraseña sin modificar', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockResolvedValue({ kind: 'success', displayName: 'Diego' }),
    };
    const result = await createRegister(gateway)({
      name: '  Diego  ',
      email: ' Diego@Example.test ',
      password: ' con espacios ',
    });
    expect(gateway.register).toHaveBeenCalledWith({
      name: 'Diego',
      email: 'diego@example.test',
      password: ' con espacios ',
    });
    expect(result).toEqual({ kind: 'success', displayName: 'Diego' });
  });

  it('U2/FR-023: si el gateway lanza una excepción devuelve unavailable', async () => {
    const gateway: RegistrationGateway = { register: vi.fn().mockRejectedValue(new Error('x')) };
    await expect(
      createRegister(gateway)({ name: 'Diego', email: 'a@b.co', password: 'p' }),
    ).resolves.toEqual({ kind: 'unavailable' });
  });
});
