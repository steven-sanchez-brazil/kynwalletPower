import type { RegistrationForm, RegistrationResult } from '@/domain/registration';
import { normalizeFullName } from '@/domain/registrationValidation';
import { normalizeEmail } from '@/domain/validation';
import type { AccountRegistry } from './ports/AccountRegistry';

export type RegisterAccount = (form: RegistrationForm) => Promise<RegistrationResult>;

/** Caso de uso: crea la cuenta delegando en el puerto de registro. */
export function createRegisterAccount(registry: AccountRegistry): RegisterAccount {
  return async ({ fullName, email, password }) => {
    try {
      return await registry.register({
        email: normalizeEmail(email),
        password,
        displayName: normalizeFullName(fullName),
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
