import type { RegistrationResult } from '@/domain/registration';
import { VALID_REGISTRATION } from '@/test/fixtures';
import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegister } from './register';

function setup(result: RegistrationResult | Error = { kind: 'created', displayName: 'X' }) {
  const gateway = {
    register: vi.fn<RegistrationGateway['register']>(async () => {
      if (result instanceof Error) throw result;
      return result;
    }),
  };
  return { gateway, register: createRegister(gateway) };
}

describe('createRegister (contracts/registration-gateway.md)', () => {
  it('FR-003..007: datos inválidos → invalid sin llamar al gateway', async () => {
    const { gateway, register } = setup();
    const result = await register({ ...VALID_REGISTRATION, acceptedTerms: false });
    expect(result).toEqual({
      kind: 'invalid',
      errors: expect.objectContaining({ acceptedTerms: expect.any(String) }),
    });
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('US1-3: normaliza nombre y correo antes de delegar', async () => {
    const { gateway, register } = setup();
    await register({
      ...VALID_REGISTRATION,
      fullName: '  Nueva   Persona ',
      email: '  Nueva.Persona@Example.TEST ',
    });
    expect(gateway.register).toHaveBeenCalledWith({
      fullName: 'Nueva Persona',
      email: 'nueva.persona@example.test',
      password: VALID_REGISTRATION.password,
    });
  });

  it('no envía confirmPassword ni acceptedTerms al gateway', async () => {
    const { gateway, register } = setup();
    await register(VALID_REGISTRATION);
    const sent = gateway.register.mock.calls[0]?.[0] ?? {};
    expect(Object.keys(sent).sort()).toEqual(['email', 'fullName', 'password']);
  });

  it('devuelve el resultado del gateway', async () => {
    const { register } = setup({ kind: 'rejected' });
    expect(await register(VALID_REGISTRATION)).toEqual({ kind: 'rejected' });
  });

  it('US2-4: si el gateway lanza → unavailable', async () => {
    const { register } = setup(new Error('boom'));
    expect(await register(VALID_REGISTRATION)).toEqual({ kind: 'unavailable' });
  });
});
