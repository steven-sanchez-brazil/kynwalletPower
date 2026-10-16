import { vi } from 'vitest';
import type { Register } from '@/application/register';
import type { RegistrationResult, RegistrationValues } from '@/domain/registration';

/** Datos ficticios exclusivos de pruebas. No representan una cuenta real. */
export const REGISTRATION_FIXTURE: RegistrationValues = {
  fullName: 'Persona Demo',
  email: 'persona@example.test',
  password: 'sample-pass-01',
  confirmPassword: 'sample-pass-01',
  termsAccepted: true,
};

export function createRegistrationStub(result: RegistrationResult = { kind: 'success' }) {
  let deferred = false;
  const pending: Array<(result: RegistrationResult) => void> = [];
  const register = vi.fn<Register>(() =>
    deferred
      ? new Promise<RegistrationResult>((resolve) => pending.push(resolve))
      : Promise.resolve(result),
  );
  return {
    register,
    defer: () => {
      deferred = true;
    },
    release: (next = result) => {
      pending.shift()?.(next);
    },
  };
}
