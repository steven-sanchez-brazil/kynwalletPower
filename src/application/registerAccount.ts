import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationValues,
} from '@/domain/registration';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type RegistrationResult =
  { kind: 'success' } | { kind: 'invalid'; errors: RegistrationErrors } | { kind: 'error' };

export type RegisterAccount = (values: RegistrationValues) => Promise<RegistrationResult>;

export function createRegisterAccount(gateway: RegistrationGateway): RegisterAccount {
  return async (values) => {
    const errors = validateRegistration(values);
    if (Object.keys(errors).length) return { kind: 'invalid', errors };
    try {
      await gateway.simulate();
      return { kind: 'success' };
    } catch {
      return { kind: 'error' };
    }
  };
}
