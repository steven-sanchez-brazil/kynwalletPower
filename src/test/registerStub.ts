import type { RegisterAccountInput, RegisterResult } from '@/domain/auth';

/** Caso de uso falso de registro controlable desde las pruebas. */
export function createRegisterStub(
  result: RegisterResult = { kind: 'success', displayName: 'Steven Luna' },
) {
  let resolvePending: (() => void) | null = null;
  let deferred = false;
  const fn = vi.fn<(input: RegisterAccountInput) => Promise<RegisterResult>>(
    () =>
      new Promise<RegisterResult>((resolve) => {
        if (deferred) {
          resolvePending = () => resolve(result);
        } else {
          resolve(result);
        }
      }),
  );
  return {
    registerAccount: fn,
    defer() {
      deferred = true;
    },
    release() {
      resolvePending?.();
    },
  };
}
