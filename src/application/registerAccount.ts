import type { RegistrationInput, RegistrationResult } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type RegisterAccount = (input: RegistrationInput) => Promise<RegistrationResult>;

/** Valida la frontera y entrega únicamente la cuenta normalizada al puerto inyectado. */
export function createRegisterAccount(gateway: RegistrationGateway): RegisterAccount {
  return async (input) => {
    const errors = validateRegistration(input);
    if (Object.keys(errors).length > 0) return { kind: 'invalid-input', errors };

    try {
      return await gateway.register({
        fullName: input.fullName.trim(),
        email: normalizeEmail(input.email),
        password: input.password,
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
