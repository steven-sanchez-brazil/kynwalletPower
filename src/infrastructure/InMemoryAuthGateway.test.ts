import type { RegistrationAccount } from '@/domain/registration';
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

describe('InMemoryAuthGateway: registro compartido con autenticación', () => {
  const account: RegistrationAccount = {
    fullName: 'Ana Rivera',
    email: 'ana@example.test',
    password: 'fixture-pass-02',
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  it('REG-US1-4: la cuenta creada permite iniciar sesión con el nombre registrado', async () => {
    const instance = gateway();
    await expect(instance.register({ ...account, email: '  ANA@Example.test ' })).resolves.toEqual({
      kind: 'success',
    });
    await expect(
      instance.authenticate({ email: 'ana@example.test', password: account.password }),
    ).resolves.toEqual({ kind: 'success', displayName: account.fullName });
  });

  it('REG-FR-018/022: null conserva unavailable hasta crear la primera cuenta', async () => {
    const instance = new InMemoryAuthGateway(null, { delayMs: 0 });
    const credentials = { email: account.email, password: account.password };
    await expect(instance.authenticate(credentials)).resolves.toEqual({ kind: 'unavailable' });
    await expect(instance.register(account)).resolves.toEqual({ kind: 'success' });
    await expect(instance.authenticate(credentials)).resolves.toEqual({
      kind: 'success',
      displayName: account.fullName,
    });
    await expect(
      instance.authenticate({ ...credentials, password: 'incorrecta' }),
    ).resolves.toEqual({ kind: 'invalid-credentials' });
  });

  it('REG-US2-5: un duplicado normalizado no sobrescribe la cuenta preconfigurada', async () => {
    const instance = gateway();
    await expect(
      instance.register({ ...account, email: ` ${TEST_ACCOUNT.email.toUpperCase()} ` }),
    ).resolves.toEqual({ kind: 'duplicate-email' });
    await expect(instance.authenticate(TEST_ACCOUNT)).resolves.toEqual({
      kind: 'success',
      displayName: TEST_ACCOUNT.displayName,
    });
    await expect(
      instance.authenticate({ email: TEST_ACCOUNT.email, password: account.password }),
    ).resolves.toEqual({ kind: 'invalid-credentials' });
  });

  it('REG-FR-018: rechaza un duplicado de una cuenta recién registrada', async () => {
    const instance = gateway([]);
    await instance.register(account);
    await expect(
      instance.register({
        fullName: 'Otro nombre',
        email: ` ${account.email.toUpperCase()} `,
        password: 'otra-clave-99',
      }),
    ).resolves.toEqual({ kind: 'duplicate-email' });
    await expect(instance.authenticate(account)).resolves.toEqual({
      kind: 'success',
      displayName: account.fullName,
    });
  });

  it('REG-FR-018: dos altas simultáneas del mismo correo crean una sola cuenta', async () => {
    const instance = gateway([]);
    await expect(
      Promise.all([instance.register(account), instance.register(account)]),
    ).resolves.toEqual([{ kind: 'success' }, { kind: 'duplicate-email' }]);
  });

  it('REG-FR-019: copia el array inicial y no modifica las cuentas recibidas', async () => {
    const initial = [{ ...TEST_ACCOUNT }];
    const instance = gateway(initial);
    initial.length = 0;
    await instance.register(account);
    expect(initial).toEqual([]);
    await expect(instance.authenticate(TEST_ACCOUNT)).resolves.toEqual({
      kind: 'success',
      displayName: TEST_ACCOUNT.displayName,
    });
  });

  it('REG-FR-019: conserva una copia mínima de la cuenta de alta y resultados sin secretos', async () => {
    const instance = gateway([]);
    const input = { ...account };
    await expect(instance.register(input)).resolves.toEqual({ kind: 'success' });
    input.email = 'cambiado@example.test';
    input.password = 'otra-clave-99';
    input.fullName = 'Otro nombre';
    await expect(instance.authenticate(account)).resolves.toEqual({
      kind: 'success',
      displayName: account.fullName,
    });
    await expect(gateway([]).authenticate(account)).resolves.toEqual({
      kind: 'invalid-credentials',
    });
  });

  it('REG-FR-017: el registro respeta la demora configurada', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    new InMemoryAuthGateway([], { delayMs: 75 }).register(account).then(onResolve);
    await vi.advanceTimersByTimeAsync(74);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledExactlyOnceWith({ kind: 'success' });
  });

  it('REG-FR-021: una cuenta de entrada defectuosa produce unavailable y permite reintentar', async () => {
    const instance = new InMemoryAuthGateway(null, { delayMs: 0 });
    const broken = {
      ...account,
      get email(): string {
        throw new Error('detalle interno sensible');
      },
    };
    await expect(instance.register(broken)).resolves.toEqual({ kind: 'unavailable' });
    await expect(instance.register(account)).resolves.toEqual({ kind: 'success' });
    await expect(instance.authenticate(account)).resolves.toEqual({
      kind: 'success',
      displayName: account.fullName,
    });
  });

  it('REG-FR-021: cuentas iniciales defectuosas producen unavailable al registrar', async () => {
    const broken = {
      ...TEST_ACCOUNT,
      get email(): string {
        throw new Error('detalle interno sensible');
      },
    };
    await expect(gateway([broken]).register(account)).resolves.toEqual({ kind: 'unavailable' });
  });
});
