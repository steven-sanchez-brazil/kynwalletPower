import { REGISTRATION_MESSAGES, type RegistrationInput } from '@/domain/registration';
import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegisterAccount } from './registerAccount';

const valid: RegistrationInput = {
  fullName: 'Ana Rivera',
  email: 'ana@example.test',
  password: 'fixture-pass-02',
  confirmPassword: 'fixture-pass-02',
  acceptedTerms: true,
};

describe('createRegisterAccount', () => {
  it('REG-FR-007/019: normaliza datos y entrega solo los necesarios al puerto', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockResolvedValue({ kind: 'success' }),
    };
    const input = Object.freeze({
      ...valid,
      fullName: '  Ana Rivera  ',
      email: ' ANA@Example.test ',
      password: ' con espacios ',
      confirmPassword: ' con espacios ',
    });
    await expect(createRegisterAccount(gateway)(input)).resolves.toEqual({ kind: 'success' });
    expect(gateway.register).toHaveBeenCalledExactlyOnceWith({
      fullName: 'Ana Rivera',
      email: 'ana@example.test',
      password: ' con espacios ',
    });
    expect(input.fullName).toBe('  Ana Rivera  ');
    expect(input.email).toBe(' ANA@Example.test ');
  });

  it.each([
    { fullName: '' },
    { fullName: 'x'.repeat(81) },
    { email: 'incorrecto' },
    { password: 'corta', confirmPassword: 'corta' },
    { confirmPassword: 'otra-clave' },
    { acceptedTerms: false },
  ])('REG-FR-005: una solicitud inválida no invoca el puerto (%j)', async (override) => {
    const gateway: RegistrationGateway = { register: vi.fn() };
    const result = await createRegisterAccount(gateway)({ ...valid, ...override });
    expect(result).toMatchObject({ kind: 'invalid-input', errors: expect.any(Object) });
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('REG-FR-005: devuelve errores concretos para que la UI pueda corregirlos', async () => {
    const gateway: RegistrationGateway = { register: vi.fn() };
    await expect(
      createRegisterAccount(gateway)({ ...valid, fullName: '   ', acceptedTerms: false }),
    ).resolves.toEqual({
      kind: 'invalid-input',
      errors: {
        fullName: REGISTRATION_MESSAGES.FULL_NAME_REQUIRED,
        acceptedTerms: REGISTRATION_MESSAGES.TERMS_REQUIRED,
      },
    });
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('REG-FR-005: impide que tipos externos incorrectos alcancen el puerto', async () => {
    const gateway: RegistrationGateway = { register: vi.fn() };
    const malformed = { ...valid, acceptedTerms: 'true' } as unknown as RegistrationInput;
    await expect(createRegisterAccount(gateway)(malformed)).resolves.toEqual({
      kind: 'invalid-input',
      errors: { acceptedTerms: REGISTRATION_MESSAGES.TERMS_REQUIRED },
    });
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it.each([{ kind: 'success' }, { kind: 'duplicate-email' }, { kind: 'unavailable' }] as const)(
    'REG-FR-018/021: conserva el resultado explícito del puerto (%j)',
    async (result) => {
      const gateway: RegistrationGateway = { register: vi.fn().mockResolvedValue(result) };
      await expect(createRegisterAccount(gateway)(valid)).resolves.toEqual(result);
    },
  );

  it('REG-FR-021: una promesa rechazada produce unavailable sin detalles internos', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockRejectedValue(new Error('detalle interno sensible')),
    };
    await expect(createRegisterAccount(gateway)(valid)).resolves.toEqual({ kind: 'unavailable' });
  });

  it('REG-FR-021: una excepción síncrona produce unavailable', async () => {
    const gateway: RegistrationGateway = {
      register() {
        throw new Error('detalle interno sensible');
      },
    };
    await expect(createRegisterAccount(gateway)(valid)).resolves.toEqual({ kind: 'unavailable' });
  });
});
