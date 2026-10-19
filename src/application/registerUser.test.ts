import type { UserRegistrationGateway } from './ports/UserRegistrationGateway';
import { createRegisterUser } from './registerUser';

describe('createRegisterUser (US1, FR-010, FR-017)', () => {
  it('US1-3: recorta espacios periféricos de fullName y normaliza email antes de delegar en el gateway', async () => {
    const gateway: UserRegistrationGateway = {
      register: vi.fn().mockResolvedValue({ kind: 'success' }),
    };
    const registerUser = createRegisterUser(gateway);

    const result = await registerUser({
      fullName: '  Ana Gómez  ',
      email: '  Ana.Gomez@Example.test ',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });

    expect(result).toEqual({ kind: 'success' });
    expect(gateway.register).toHaveBeenCalledWith({
      fullName: 'Ana Gómez',
      email: 'ana.gomez@example.test',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });
  });

  it('FR-017: devuelve storage-error si el gateway lanza una excepción inesperada', async () => {
    const gateway: UserRegistrationGateway = {
      register: vi.fn().mockRejectedValue(new Error('unexpected failure')),
    };
    const registerUser = createRegisterUser(gateway);

    const result = await registerUser({
      fullName: 'Ana Gómez',
      email: 'ana@example.test',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });

    expect(result).toEqual({ kind: 'storage-error' });
  });
});
