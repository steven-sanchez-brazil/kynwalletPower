import { vi } from 'vitest';

export const registrationValues = {
  fullName: 'Persona de prueba',
  email: 'persona@example.com',
  password: 'abcdefgh',
  confirmPassword: 'abcdefgh',
  acceptedTerms: true,
};

export function controlledPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

export function registrationSimulationStub() {
  const deferred = controlledPromise<undefined>();
  return {
    complete: vi.fn(() => deferred.promise),
    ...deferred,
    resolve: () => deferred.resolve(undefined),
  };
}
