import { describe, expect, it, vi } from 'vitest';
import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegister } from './register';
import { TEST_REGISTRATION_DATA } from '@/test/fixtures';

describe('createRegister', () => {
  it('delega en RegistrationGateway con el correo y nombre normalizados', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockResolvedValue({
        kind: 'success',
        account: { email: 'carlos@example.test', displayName: 'Carlos Mendoza' },
      }),
    };

    const register = createRegister(gateway);
    const result = await register({
      ...TEST_REGISTRATION_DATA,
      fullName: '  Carlos Mendoza  ',
      email: '  Carlos@Example.test  ',
    });

    expect(gateway.register).toHaveBeenCalledWith({
      ...TEST_REGISTRATION_DATA,
      fullName: 'Carlos Mendoza',
      email: 'carlos@example.test',
    });
    expect(result).toEqual({
      kind: 'success',
      account: { email: 'carlos@example.test', displayName: 'Carlos Mendoza' },
    });
  });

  it('devuelve unavailable si el gateway arroja una excepción inesperada', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    const register = createRegister(gateway);
    const result = await register(TEST_REGISTRATION_DATA);

    expect(result).toEqual({
      kind: 'unavailable',
      message: 'Servicio de acceso no disponible. Intenta más tarde.',
    });
  });
});
