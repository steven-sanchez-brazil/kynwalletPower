import type { DemoAccount } from '@/domain/auth';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { InMemoryAccountRegistry } from './InMemoryAccountRegistry';
import { InMemoryAuthGateway } from './InMemoryAuthGateway';

const NEW_ACCOUNT: DemoAccount = {
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
  displayName: 'Diego Martínez',
};

describe('InMemoryAccountRegistry (contracts/account-registry.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('FR-012: agrega la cuenta a la lista compartida → success', async () => {
    const accounts = [TEST_ACCOUNT];
    const result = await new InMemoryAccountRegistry(accounts, { delayMs: 0 }).register(
      NEW_ACCOUNT,
    );
    expect(result).toEqual({ kind: 'success' });
    expect(accounts).toContainEqual(NEW_ACCOUNT);
  });

  it('US1-3: la cuenta registrada sirve para iniciar sesión con el gateway de 001', async () => {
    const accounts = [TEST_ACCOUNT];
    await new InMemoryAccountRegistry(accounts, { delayMs: 0 }).register(NEW_ACCOUNT);
    const login = await new InMemoryAuthGateway(accounts, { delayMs: 0 }).authenticate({
      email: NEW_ACCOUNT.email,
      password: NEW_ACCOUNT.password,
    });
    expect(login).toEqual({ kind: 'success', displayName: 'Diego Martínez' });
  });

  it('FR-014: correo ya registrado (sin distinguir mayúsculas) → email-taken sin duplicar', async () => {
    const accounts = [TEST_ACCOUNT];
    const result = await new InMemoryAccountRegistry(accounts, { delayMs: 0 }).register({
      ...NEW_ACCOUNT,
      email: TEST_ACCOUNT.email.toUpperCase(),
    });
    expect(result).toEqual({ kind: 'email-taken' });
    expect(accounts).toHaveLength(1);
  });

  it('configuración ausente → unavailable', async () => {
    const result = await new InMemoryAccountRegistry(null, { delayMs: 0 }).register(NEW_ACCOUNT);
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('FR-011: espera delayMs antes de responder (1000 ms por defecto)', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    void new InMemoryAccountRegistry([]).register(NEW_ACCOUNT).then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
