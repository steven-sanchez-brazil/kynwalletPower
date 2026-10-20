import { vi } from 'vitest';
import type { RegisterResult, RegistrationData } from '@/domain/auth';

/** Caso de uso falso de registro controlable desde las pruebas. */
export function createRegisterStub(
  result: RegisterResult = {
    kind: 'success',
    account: { email: 'carlos.mendoza@example.test', displayName: 'Carlos Mendoza' },
  },
) {
  let resolvePending: (() => void) | null = null;
  let deferred = false;
  const fn = vi.fn<(data: RegistrationData) => Promise<RegisterResult>>(
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
    register: fn,
    defer() {
      deferred = true;
    },
    release() {
      resolvePending?.();
    },
  };
}
