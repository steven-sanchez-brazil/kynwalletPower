import type { RegistrationData } from '@/domain/registration';
import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegister } from './register';

const data: RegistrationData = {
  fullName: '  Diego Martínez ',
  email: ' Diego@Example.TEST ',
  password: ' clave con espacios ',
  confirmPassword: ' clave con espacios ',
  acceptTerms: true,
};

describe('createRegister (contracts/registration-gateway.md)', () => {
  it('US1-4: envía el correo normalizado, el nombre recortado y la contraseña sin cambios', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockResolvedValue({ kind: 'success' }),
    };
    const result = await createRegister(gateway)(data);
    expect(gateway.register).toHaveBeenCalledWith({
      email: 'diego@example.test',
      password: ' clave con espacios ',
      displayName: 'Diego Martínez',
    });
    expect(result).toEqual({ kind: 'success' });
  });

  it('devuelve el resultado del puerto (email-taken)', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockResolvedValue({ kind: 'email-taken' }),
    };
    await expect(createRegister(gateway)(data)).resolves.toEqual({ kind: 'email-taken' });
  });

  it('FR-019: si el puerto lanza una excepción devuelve unavailable', async () => {
    const gateway: RegistrationGateway = { register: vi.fn().mockRejectedValue(new Error('x')) };
    await expect(createRegister(gateway)(data)).resolves.toEqual({ kind: 'unavailable' });
  });
});
