import type { RegistrationForm, RegistrationResult } from '@/domain/registration';

/** Caso de uso de registro falso, controlable desde las pruebas. */
export function createRegisterStub(result: RegistrationResult = { kind: 'success' }) {
  let resolvePending: (() => void) | null = null;
  let deferred = false;
  const fn = vi.fn<(form: RegistrationForm) => Promise<RegistrationResult>>(
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
    registerAccount: fn,
    /** Las siguientes llamadas quedan pendientes hasta llamar a release(). */
    defer() {
      deferred = true;
    },
    release() {
      resolvePending?.();
    },
  };
}
