import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryAccountStore } from './InMemoryAccountStore';
import { InMemoryRegistrationGateway } from './InMemoryRegistrationGateway';
import { TEST_REGISTRATION_DATA } from '@/test/fixtures';

describe('InMemoryRegistrationGateway (contracts/registration-gateway.md)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('registra una nueva cuenta exitosamente y la persiste en AccountStore', async () => {
    const store = new InMemoryAccountStore();
    const gateway = new InMemoryRegistrationGateway(store, { delayMs: 0 });

    const result = await gateway.register(TEST_REGISTRATION_DATA);

    expect(result).toEqual({
      kind: 'success',
      account: {
        email: TEST_REGISTRATION_DATA.email,
        displayName: TEST_REGISTRATION_DATA.fullName,
      },
    });
    expect(store.findByEmail(TEST_REGISTRATION_DATA.email)).toBeDefined();
  });

  it('retorna email-already-registered si el correo ya existe en el almacén', async () => {
    const store = new InMemoryAccountStore([
      {
        email: TEST_REGISTRATION_DATA.email,
        password: 'existing-pass',
        displayName: 'Usuario Existente',
      },
    ]);
    const gateway = new InMemoryRegistrationGateway(store, { delayMs: 0 });

    const result = await gateway.register(TEST_REGISTRATION_DATA);

    expect(result).toEqual({
      kind: 'email-already-registered',
      message: 'Este correo electrónico ya se encuentra registrado',
    });
  });

  it('espera delayMs antes de responder (800 ms por defecto)', async () => {
    vi.useFakeTimers();
    const store = new InMemoryAccountStore();
    const gateway = new InMemoryRegistrationGateway(store);
    const onResolve = vi.fn();

    gateway.register(TEST_REGISTRATION_DATA).then(onResolve);

    await vi.advanceTimersByTimeAsync(799);
    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledOnce();
  });

  it('no expone la contraseña en el resultado de éxito', async () => {
    const store = new InMemoryAccountStore();
    const gateway = new InMemoryRegistrationGateway(store, { delayMs: 0 });

    const result = await gateway.register(TEST_REGISTRATION_DATA);
    expect(JSON.stringify(result)).not.toContain(TEST_REGISTRATION_DATA.password);
  });
});
