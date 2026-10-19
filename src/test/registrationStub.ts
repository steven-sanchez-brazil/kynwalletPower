import type { RegistrationCommand, RegistrationResult } from '@/domain/registration';

/** Caso de uso de registro falso controlable desde las pruebas. */
export function createRegistrationStub(result: RegistrationResult = { kind: 'success' }) {
  let resolvePending: (() => void) | null = null;
  let deferred = false;
  const fn = vi.fn<(command: RegistrationCommand) => Promise<RegistrationResult>>(
    () =>
      new Promise<RegistrationResult>((resolve) => {
        if (deferred) {
          resolvePending = () => resolve(result);
        } else {
          resolve(result);
        }
      }),
  );
  return {
    registerUser: fn,
    /** Las siguientes llamadas quedan pendientes hasta llamar a release(). */
    defer() {
      deferred = true;
    },
    release() {
      resolvePending?.();
    },
  };
}
