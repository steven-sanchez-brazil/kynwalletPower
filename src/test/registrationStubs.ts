import type { RegisterUser, RegisterUserResult } from '@/application/registerUser';

export function createRegisterUserStub(result: RegisterUserResult = { kind: 'success' }) {
  let releasePending: (() => void) | null = null;
  let deferred = false;
  const registerUser = vi.fn<RegisterUser>(
    () =>
      new Promise<RegisterUserResult>((resolve) => {
        if (deferred) releasePending = () => resolve(result);
        else resolve(result);
      }),
  );
  return {
    registerUser,
    defer() {
      deferred = true;
    },
    release() {
      releasePending?.();
    },
  };
}
