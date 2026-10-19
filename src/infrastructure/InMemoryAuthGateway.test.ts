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

describe('InMemoryAuthGateway · registro (contracts/registration-gateway.md)', () => {
  const NEW_ACCOUNT = {
    email: 'nuevo@example.test',
    password: 'nueva-clave-02',
    displayName: 'Nuevo Usuario',
  };
  const login = (g: InMemoryAuthGateway, email: string, password: string) =>
    g.authenticate({ email, password });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('R1: correo nuevo → success y la cuenta puede iniciar sesión de inmediato', async () => {
    const g = gateway();
    await expect(g.register(NEW_ACCOUNT)).resolves.toEqual({ kind: 'success' });
    await expect(login(g, NEW_ACCOUNT.email, NEW_ACCOUNT.password)).resolves.toEqual({
      kind: 'success',
      displayName: 'Nuevo Usuario',
    });
  });

  it('R1: guarda el correo normalizado', async () => {
    const g = gateway();
    await g.register({ ...NEW_ACCOUNT, email: '  NUEVO@Example.test ' });
    await expect(login(g, 'nuevo@example.test', NEW_ACCOUNT.password)).resolves.toMatchObject({
      kind: 'success',
    });
  });

  it('R2: correo existente con otra capitalización y espacios → duplicate-email sin alterar la cuenta', async () => {
    const g = gateway();
    const result = await g.register({
      email: `  ${TEST_ACCOUNT.email.toUpperCase()} `,
      password: 'otra-clave-99',
      displayName: 'Intruso',
    });
    expect(result).toEqual({ kind: 'duplicate-email' });
    await expect(login(g, TEST_ACCOUNT.email, TEST_ACCOUNT.password)).resolves.toEqual({
      kind: 'success',
      displayName: 'Steven Luna',
    });
    await expect(login(g, TEST_ACCOUNT.email, 'otra-clave-99')).resolves.toEqual({
      kind: 'invalid-credentials',
    });
  });

  it('R3: dos altas simultáneas del mismo correo → una success y una duplicate-email', async () => {
    const g = gateway();
    const results = await Promise.all([
      g.register(NEW_ACCOUNT),
      g.register({ ...NEW_ACCOUNT, password: 'segunda-clave-3' }),
    ]);
    expect(results.map((r) => r.kind).sort()).toEqual(['duplicate-email', 'success']);
    await expect(login(g, NEW_ACCOUNT.email, NEW_ACCOUNT.password)).resolves.toMatchObject({
      kind: 'success',
    });
  });

  it('R4: colección null → unavailable y authenticate sigue en unavailable', async () => {
    const g = new InMemoryAuthGateway(null, { delayMs: 0 });
    await expect(g.register(NEW_ACCOUNT)).resolves.toEqual({ kind: 'unavailable' });
    await expect(login(g, NEW_ACCOUNT.email, NEW_ACCOUNT.password)).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it('R5: las cuentas iniciales siguen autenticando tras varias altas', async () => {
    const g = gateway();
    await g.register(NEW_ACCOUNT);
    await g.register({ ...NEW_ACCOUNT, email: 'otro@example.test' });
    await expect(login(g, TEST_ACCOUNT.email, TEST_ACCOUNT.password)).resolves.toMatchObject({
      kind: 'success',
    });
  });

  it('R6: no muta el arreglo recibido en el constructor', async () => {
    const initial = [TEST_ACCOUNT];
    const g = new InMemoryAuthGateway(initial, { delayMs: 0 });
    await g.register(NEW_ACCOUNT);
    expect(initial).toEqual([TEST_ACCOUNT]);
  });

  it('R7: ningún resultado contiene la contraseña', async () => {
    const g = gateway();
    const results = [await g.register(NEW_ACCOUNT), await g.register(NEW_ACCOUNT)];
    expect(JSON.stringify(results)).not.toContain(NEW_ACCOUNT.password);
  });

  it('R8: register espera delayMs (1000 ms por defecto) antes de responder', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    new InMemoryAuthGateway([TEST_ACCOUNT]).register(NEW_ACCOUNT).then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
