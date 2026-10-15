import type { DemoAccount } from '@/domain/auth';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { InMemoryRegistrationGateway } from './InMemoryRegistrationGateway';

const accounts: DemoAccount[] = [TEST_ACCOUNT];
const request = { fullName: 'Nueva Persona', email: 'nueva.persona@example.test', password: 'x1' };

describe('InMemoryRegistrationGateway (contracts/registration-gateway.md)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('correo nuevo → created con displayName igual al nombre', async () => {
    const pending = new InMemoryRegistrationGateway(accounts).register(request);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await pending).toEqual({ kind: 'created', displayName: 'Nueva Persona' });
  });

  it.each([TEST_ACCOUNT.email, TEST_ACCOUNT.email.toUpperCase(), ` ${TEST_ACCOUNT.email} `])(
    'US2-1: correo de cuenta de demostración (%j) → rejected',
    async (email) => {
      const pending = new InMemoryRegistrationGateway(accounts).register({ ...request, email });
      await vi.advanceTimersByTimeAsync(1000);
      expect(await pending).toEqual({ kind: 'rejected' });
    },
  );

  it('US2-4: cuentas null → unavailable', async () => {
    const pending = new InMemoryRegistrationGateway(null).register(request);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await pending).toEqual({ kind: 'unavailable' });
  });

  it('espera delayMs (1000 por defecto) antes de resolver', async () => {
    const settled = vi.fn();
    void new InMemoryRegistrationGateway(accounts).register(request).then(settled);
    await vi.advanceTimersByTimeAsync(999);
    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalledOnce();
  });

  it('respeta un delayMs inyectado', async () => {
    const settled = vi.fn();
    void new InMemoryRegistrationGateway(accounts, { delayMs: 50 }).register(request).then(settled);
    await vi.advanceTimersByTimeAsync(50);
    expect(settled).toHaveBeenCalledOnce();
  });

  it('FR-015: no escribe en localStorage, sessionStorage ni console', async () => {
    const log = vi.spyOn(console, 'log');
    const error = vi.spyOn(console, 'error');
    const pending = new InMemoryRegistrationGateway(accounts).register(request);
    await vi.advanceTimersByTimeAsync(1000);
    await pending;
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
