import type { DemoAccount } from '@/domain/auth';
import type { RegistrationInput } from '@/domain/registration';
import { createRegisterAccount } from './registerAccount';
import type { RegistrationGateway } from './ports/RegistrationGateway';

const input: RegistrationInput = {
  displayName: '  Diego Martínez ',
  email: ' Diego@Example.test ',
  password: ' con espacios 1 ',
  confirmPassword: ' con espacios 1 ',
  acceptedTerms: true,
};

const gatewayReturning = (kind: 'success' | 'duplicate-email' | 'unavailable') => {
  const register = vi.fn<(account: DemoAccount) => Promise<{ kind: typeof kind }>>(() =>
    Promise.resolve({ kind }),
  );
  return { gateway: { register } satisfies RegistrationGateway, register };
};

describe('createRegisterAccount (contracts/registration-gateway.md)', () => {
  it('REG FR-008: entrega al gateway una cuenta normalizada, sin confirmación ni términos', async () => {
    const { gateway, register } = gatewayReturning('success');
    const result = await createRegisterAccount(gateway, vi.fn())(input);
    expect(result).toEqual({ kind: 'success' });
    expect(register).toHaveBeenCalledOnce();
    expect(register).toHaveBeenCalledWith({
      email: 'diego@example.test',
      password: ' con espacios 1 ',
      displayName: 'Diego Martínez',
    });
  });

  it.each(['duplicate-email', 'unavailable'] as const)(
    'REG FR-007/FR-014: devuelve %s tal cual',
    async (kind) => {
      const { gateway } = gatewayReturning(kind);
      await expect(createRegisterAccount(gateway, vi.fn())(input)).resolves.toEqual({ kind });
    },
  );

  it('R10: entrada inválida → invalid con los errores y sin invocar al gateway', async () => {
    const { gateway, register } = gatewayReturning('success');
    const result = await createRegisterAccount(
      gateway,
      vi.fn(),
    )({
      ...input,
      confirmPassword: 'distinta',
    });
    expect(result.kind).toBe('invalid');
    expect(result).toHaveProperty('errors.confirmPassword');
    expect(register).not.toHaveBeenCalled();
  });

  it('R9: si el gateway lanza → failure y el reporter recibe solo un código fijo', async () => {
    const gateway: RegistrationGateway = {
      register: vi.fn().mockRejectedValue(new Error(`boom ${input.password}`)),
    };
    const report = vi.fn();
    const result = await createRegisterAccount(gateway, report)(input);
    expect(result).toEqual({ kind: 'failure' });
    expect(report).toHaveBeenCalledOnce();
    const [event] = report.mock.calls[0] ?? [];
    expect(Object.keys(event)).toEqual(['code']);
    expect(JSON.stringify(event)).not.toContain('con espacios');
    expect(JSON.stringify(event)).not.toContain('diego');
    expect(JSON.stringify(result)).not.toContain('boom');
  });

  it('REG FR-013: ningún resultado contiene la contraseña', async () => {
    const { gateway } = gatewayReturning('success');
    const result = await createRegisterAccount(gateway, vi.fn())(input);
    expect(JSON.stringify(result)).not.toContain('con espacios');
  });
});
