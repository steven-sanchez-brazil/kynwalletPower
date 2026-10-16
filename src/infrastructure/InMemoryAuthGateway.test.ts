import { TEST_ACCOUNT } from '@/test/fixtures';
import { InMemoryAuthGateway } from './InMemoryAuthGateway';

const gateway = (accounts = [TEST_ACCOUNT]) => new InMemoryAuthGateway(accounts, { delayMs: 0 });

describe('InMemoryAuthGateway (contracts/auth-gateway.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('C1: correo con mayúsculas y espacios + contraseña exacta → success', async () => {
    const result = await gateway().authenticate({
      email: '  STEVEN.Luna@Example.test ',
      password: TEST_ACCOUNT.password,
    });
    expect(result).toEqual({ kind: 'success', displayName: 'Steven Luna' });
  });

  it.each([
    ['contraseña distinta', 'otra-clave-99'],
    ['diferencia de mayúsculas', 'FIXTURE-PASS-01'],
    ['espacios periféricos', ' fixture-pass-01 '],
  ])('C2: correo existente con %s → invalid-credentials', async (_label, password) => {
    const result = await gateway().authenticate({ email: TEST_ACCOUNT.email, password });
    expect(result).toEqual({ kind: 'invalid-credentials' });
  });

  it('C3: correo inexistente → resultado idéntico a C2', async () => {
    const unknown = await gateway().authenticate({
      email: 'nadie@example.test',
      password: TEST_ACCOUNT.password,
    });
    const wrongPassword = await gateway().authenticate({
      email: TEST_ACCOUNT.email,
      password: 'otra-clave-99',
    });
    expect(unknown).toEqual(wrongPassword);
  });

  it('C4: configuración ausente → unavailable', async () => {
    const result = await new InMemoryAuthGateway(null, { delayMs: 0 }).authenticate({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
    });
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('C5: una excepción interna → unavailable sin rechazar la promesa', async () => {
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
      gateway(broken).authenticate({ email: 'a@b.co', password: 'whatever1' }),
    ).resolves.toEqual({ kind: 'unavailable' });
  });

  it('C6: el resultado nunca contiene la contraseña', async () => {
    const result = await gateway().authenticate({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
    });
    expect(JSON.stringify(result)).not.toContain(TEST_ACCOUNT.password);
  });

  it('FR-008: espera delayMs antes de responder (1000 ms por defecto)', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    new InMemoryAuthGateway([TEST_ACCOUNT])
      .authenticate({ email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password })
      .then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});

describe('InMemoryAuthGateway.register (contracts/registration-gateway.md)', () => {
  const newAccount = {
    email: 'diego@example.test',
    password: 'clave-segura',
    displayName: 'Diego Martínez',
  };

  it('US1-2: la cuenta registrada puede iniciar sesión', async () => {
    const store = gateway();
    await expect(store.register(newAccount)).resolves.toEqual({ kind: 'success' });
    await expect(
      store.authenticate({ email: newAccount.email, password: newAccount.password }),
    ).resolves.toEqual({ kind: 'success', displayName: 'Diego Martínez' });
  });

  it('no modifica el arreglo de cuentas recibido', async () => {
    const accounts = [TEST_ACCOUNT];
    await gateway(accounts).register(newAccount);
    expect(accounts).toEqual([TEST_ACCOUNT]);
  });

  it.each([
    ['cuenta demo', TEST_ACCOUNT.email],
    ['cuenta demo con mayúsculas y espacios', '  STEVEN.Luna@Example.test '],
  ])('US3-1/US3-3: correo de %s → email-taken', async (_label, email) => {
    await expect(gateway().register({ ...newAccount, email })).resolves.toEqual({
      kind: 'email-taken',
    });
  });

  it('US3-1: correo registrado en la sesión → email-taken', async () => {
    const store = gateway();
    await store.register(newAccount);
    await expect(store.register({ ...newAccount, displayName: 'Otra' })).resolves.toEqual({
      kind: 'email-taken',
    });
  });

  it('Caso límite: configuración ausente → unavailable', async () => {
    await expect(
      new InMemoryAuthGateway(null, { delayMs: 0 }).register(newAccount),
    ).resolves.toEqual({ kind: 'unavailable' });
  });

  it('FR-010: espera delayMs antes de responder', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    new InMemoryAuthGateway([TEST_ACCOUNT]).register(newAccount).then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
