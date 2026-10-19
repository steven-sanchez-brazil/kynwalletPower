import type { RegistrationForm } from '@/domain/registration';
import type { AccountRegistry } from './ports/AccountRegistry';
import { createRegisterAccount } from './registerAccount';

const form: RegistrationForm = {
  fullName: '  Diego   Martínez ',
  email: ' Diego@Example.test ',
  password: ' con espacios ',
  confirmPassword: ' con espacios ',
  acceptedTerms: true,
};

describe('createRegisterAccount', () => {
  it('delega con correo y nombre normalizados y la contraseña sin modificar', async () => {
    const registry: AccountRegistry = { register: vi.fn().mockResolvedValue({ kind: 'success' }) };
    const result = await createRegisterAccount(registry)(form);
    expect(registry.register).toHaveBeenCalledWith({
      email: 'diego@example.test',
      password: ' con espacios ',
      displayName: 'Diego Martínez',
    });
    expect(result).toEqual({ kind: 'success' });
  });

  it('FR-014: propaga email-taken', async () => {
    const registry: AccountRegistry = {
      register: vi.fn().mockResolvedValue({ kind: 'email-taken' }),
    };
    await expect(createRegisterAccount(registry)(form)).resolves.toEqual({ kind: 'email-taken' });
  });

  it('FR-022: si el registro lanza una excepción devuelve unavailable', async () => {
    const registry: AccountRegistry = { register: vi.fn().mockRejectedValue(new Error('x')) };
    await expect(createRegisterAccount(registry)(form)).resolves.toEqual({ kind: 'unavailable' });
  });
});
