import type { RegistrationResult, RegistrationValues } from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (values: RegistrationValues) => Promise<RegistrationResult>;

export function createRegister(gateway: RegistrationGateway): Register {
  return async (values) => {
    const errors = validateRegistration(values);
    if (Object.keys(errors).length) return { kind: 'invalid', errors };
    try {
      await gateway.submit();
      return { kind: 'success' };
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
