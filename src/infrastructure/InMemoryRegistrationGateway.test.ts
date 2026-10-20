import { REGISTRATION_DATA, TEST_ACCOUNT } from '@/test/fixtures';
import { InMemoryRegistrationGateway } from './InMemoryRegistrationGateway';

const gateway = (
  accounts: ConstructorParameters<typeof InMemoryRegistrationGateway>[0] = [TEST_ACCOUNT],
) => new InMemoryRegistrationGateway(accounts, { delayMs: 0 });

describe('InMemoryRegistrationGateway (contracts/registration-gateway.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('C1: correo no presente (con mayúsculas y espacios) → success con el nombre', async () => {
    const result = await gateway().register({
      ...REGISTRATION_DATA,
      email: '  Diego.MARTINEZ@Example.test ',
    });
    expect(result).toEqual({ kind: 'success', displayName: REGISTRATION_DATA.name });
  });

  it('C2: correo ya presente en las cuentas (sin distinguir mayúsculas ni espacios) → email-taken', async () => {
    const result = await gateway().register({
      ...REGISTRATION_DATA,
      email: `  ${TEST_ACCOUNT.email.toUpperCase()} `,
    });
    expect(result).toEqual({ kind: 'email-taken' });
  });

  it('C3: configuración ausente (cuentas null) → unavailable', async () => {
    const result = await gateway(null).register(REGISTRATION_DATA);
    expect(result).toEqual({ kind: 'unavailable' });
  });

  it('C4: una excepción interna → unavailable sin rechazar la promesa', async () => {
    const broken = [
      {
        get email(): string {
          throw new Error('boom');
        },
        password: 'x',
        displayName: 'x',
      },
    ];
    await expect(gateway(broken).register(REGISTRATION_DATA)).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it('C5/FR-016: el resultado nunca contiene la contraseña', async () => {
    const result = await gateway().register(REGISTRATION_DATA);
    expect(JSON.stringify(result)).not.toContain(REGISTRATION_DATA.password);
  });

  it('C6/FR-011: no persiste la cuenta: repetir el correo vuelve a dar success', async () => {
    const instance = gateway();
    await instance.register(REGISTRATION_DATA);
    await expect(instance.register(REGISTRATION_DATA)).resolves.toEqual({
      kind: 'success',
      displayName: REGISTRATION_DATA.name,
    });
  });

  it('FR-012: espera delayMs antes de responder (1000 ms por defecto)', async () => {
    vi.useFakeTimers();
    const onResolve = vi.fn();
    new InMemoryRegistrationGateway([TEST_ACCOUNT]).register(REGISTRATION_DATA).then(onResolve);
    await vi.advanceTimersByTimeAsync(999);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
