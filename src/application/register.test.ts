import { REGISTRATION_VALUES } from '@/test/registrationStub';
import { createRegister } from './register';

describe('REG-US1 FR-007–009/016 caso de uso', () => {
  it('rechaza inválidos antes del gateway', async () => {
    const gateway = { register: vi.fn() };
    expect(
      (await createRegister(gateway)({ ...REGISTRATION_VALUES, acceptedTerms: false })).kind,
    ).toBe('validation-error');
    expect(gateway.register).not.toHaveBeenCalled();
  });
  it('normaliza y omite confirmación sin modificar contraseña, emite evento seguro', async () => {
    const gateway = {
      register: vi.fn().mockResolvedValue({ status: 201, body: { kind: 'created' } }),
    };
    const observe = vi.fn();
    expect(
      await createRegister(
        gateway,
        observe,
      )({ ...REGISTRATION_VALUES, fullName: ' Diego ', email: ' DIEGO@EXAMPLE.COM ' }),
    ).toEqual({ kind: 'created' });
    expect(gateway.register).toHaveBeenCalledWith({
      fullName: 'Diego',
      email: 'diego@example.com',
      password: REGISTRATION_VALUES.password,
      acceptedTerms: true,
    });
    expect(observe).toHaveBeenCalledOnce();
    expect(observe.mock.calls[0]?.[0]).toEqual({
      name: 'registration.completed',
      outcome: 'created',
      durationMs: expect.any(Number),
    });
  });
  it.each([
    null,
    {},
    { status: 201, body: { kind: 'unavailable' } },
    { status: 503, body: { kind: 'unavailable' } },
    { status: 201, body: { kind: 'created', email: 'private' } },
  ])('respuesta %j da error seguro', async (response) => {
    expect(
      await createRegister({ register: vi.fn().mockResolvedValue(response) })(REGISTRATION_VALUES),
    ).toEqual({ kind: 'unavailable' });
  });
  it('excepción y observador fallido no exponen errores ni impiden resultado', async () => {
    expect(
      await createRegister({ register: vi.fn().mockRejectedValue(new Error('private')) })(
        REGISTRATION_VALUES,
      ),
    ).toEqual({ kind: 'unavailable' });
    const observer = vi.fn().mockImplementation(() => {
      throw new Error('private');
    });
    expect(
      await createRegister(
        { register: vi.fn().mockResolvedValue({ status: 201, body: { kind: 'created' } }) },
        observer,
      )(REGISTRATION_VALUES),
    ).toEqual({ kind: 'created' });
  });
});

it.each([
  { status: 201, body: null },
  { status: 201, body: {} },
  { status: 201, body: { kind: 'created' }, extra: true },
])('REG-FR-016 respuesta incompleta o extendida %j se rechaza', async (response) => {
  expect(
    await createRegister({ register: vi.fn().mockResolvedValue(response) })(REGISTRATION_VALUES),
  ).toEqual({ kind: 'unavailable' });
});
