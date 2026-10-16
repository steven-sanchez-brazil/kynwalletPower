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

describe('InMemoryAuthGateway · register (contracts/register-gateway.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('R1 y R5: registra una cuenta nueva y permite iniciar sesión inmediatamente con ella', async () => {
    const gw = gateway();
    const regResult = await gw.register({
      fullName: '  Ana María López  ',
      email: '  Ana.Lopez@Example.TEST ',
      password: 'NuevaClave123',
    });
    expect(regResult).toEqual({ kind: 'success', displayName: 'Ana María López' });

    const authResult = await gw.authenticate({
      email: 'ana.lopez@example.test',
      password: 'NuevaClave123',
    });
    expect(authResult).toEqual({ kind: 'success', displayName: 'Ana María López' });
  });

  it('R2: correo ya existente (sin distinguir mayúsculas ni espacios) → email-already-exists sin sobrescribir la cuenta', async () => {
    const gw = gateway();
    const dupResult = await gw.register({
      fullName: 'Otro Nombre',
      email: '  STEVEN.LUNA@EXAMPLE.TEST  ',
      password: 'OtraPassword99',
    });
    expect(dupResult).toEqual({ kind: 'email-already-exists' });

    const originalAuth = await gw.authenticate({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
    });
    expect(originalAuth).toEqual({ kind: 'success', displayName: TEST_ACCOUNT.displayName });
  });

  it('R3: configuración inicial nula → unavailable en register', async () => {
    const gw = new InMemoryAuthGateway(null, { delayMs: 0 });
    const result = await gw.register({
      fullName: 'Ana López',
      email: 'ana@example.test',
      password: 'NuevaClave123',
    });
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('R4: una excepción interna durante register → unavailable sin rechazar la promesa', async () => {
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
      gateway(broken).register({
        fullName: 'Ana López',
        email: 'ana@example.test',
        password: 'NuevaClave123',
      }),
    ).resolves.toEqual({ kind: 'unavailable' });
  });

  it('R6: el resultado de register nunca contiene la contraseña', async () => {
    const gw = gateway();
    const result = await gw.register({
      fullName: 'Ana López',
      email: 'ana@example.test',
      password: 'SecretRegisterPass99',
    });
    expect(JSON.stringify(result)).not.toContain('SecretRegisterPass99');
  });
});
