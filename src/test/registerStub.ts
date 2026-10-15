import type { RegistrationRequest, RegistrationResult } from '@/domain/registration';

/** Caso de uso de registro falso controlable desde las pruebas. */
export function createRegisterStub(
  result: RegistrationResult = { kind: 'created', displayName: 'Nueva Persona' },
) {
  let resolvePending: (() => void) | null = null;
  let deferred = false;
  const fn = vi.fn<(request: RegistrationRequest) => Promise<RegistrationResult>>(
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
    register: fn,
    /** Las siguientes llamadas quedan pendientes hasta llamar a release(). */
    defer() {
      deferred = true;
    },
    release() {
      resolvePending?.();
    },
  };
}
