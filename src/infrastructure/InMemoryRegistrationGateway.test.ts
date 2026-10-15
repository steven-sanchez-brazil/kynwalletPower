import type { DemoAccount } from '@/domain/auth';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { InMemoryAuthGateway } from './InMemoryAuthGateway';
import { InMemoryRegistrationGateway } from './InMemoryRegistrationGateway';

const NEW_ACCOUNT: DemoAccount = {
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
  displayName: 'Diego Martínez',
};

describe('InMemoryRegistrationGateway (contracts/registration-gateway.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('R1: correo nuevo → success y el login autentica la cuenta creada (US1-3)', async () => {
    const accounts = [TEST_ACCOUNT];
    const result = await new InMemoryRegistrationGateway(accounts, { delayMs: 0 }).register(
      NEW_ACCOUNT,
    );
    expect(result).toEqual({ kind: 'success' });
    const login = await new InMemoryAuthGateway(accounts, { delayMs: 0 }).authenticate({
      email: NEW_ACCOUNT.email,
      password: NEW_ACCOUNT.password,
    });
    expect(login).toEqual({ kind: 'success', displayName: 'Diego Martínez' });
  });

  it('R2: correo existente con otras mayúsculas → email-taken sin agregar la cuenta', async () => {
    const accounts = [TEST_ACCOUNT];
    const result = await new InMemoryRegistrationGateway(accounts, { delayMs: 0 }).register({
      ...NEW_ACCOUNT,
      email: TEST_ACCOUNT.email.toUpperCase(),
    });
    expect(result).toEqual({ kind: 'email-taken' });
    expect(accounts).toHaveLength(1);
  });

  it('R3: configuración ausente → unavailable', async () => {
    const result = await new InMemoryRegistrationGateway(null, { delayMs: 0 }).register(
      NEW_ACCOUNT,
    );
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('R4: una excepción interna → unavailable sin rechazar la promesa', async () => {
    const broken = [
      {
        get email(): string {
          throw new Error('boom');
        },
        password: 'x',
        displayName: 'x',
      },
    ];
    await expect(
      new InMemoryRegistrationGateway(broken, { delayMs: 0 }).register(NEW_ACCOUNT),
    ).resolves.toEqual({ kind: 'unavailable' });
  });

  it('R5: el resultado nunca contiene la contraseña', async () => {
    const result = await new InMemoryRegistrationGateway([], { delayMs: 0 }).register(NEW_ACCOUNT);
    expect(JSON.stringify(result)).not.toContain(NEW_ACCOUNT.password);
  });

  it('R6: espera delayMs antes de responder (1000 ms por defecto)', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    void new InMemoryRegistrationGateway([]).register(NEW_ACCOUNT).then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
