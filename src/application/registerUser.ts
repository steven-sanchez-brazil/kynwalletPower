import type { RegistrationCommand, RegistrationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';
import type { UserRegistrationGateway } from './ports/UserRegistrationGateway';

export type RegisterUser = (command: RegistrationCommand) => Promise<RegistrationResult>;

/** Caso de uso: registra un nuevo usuario delegando en el puerto de persistencia (FR-010). */
export function createRegisterUser(gateway: UserRegistrationGateway): RegisterUser {
  return async ({ fullName, email, password, acceptedTerms }) => {
    try {
      return await gateway.register({
        fullName: fullName.trim(),
        email: normalizeEmail(email),
        password,
        acceptedTerms,
      });
    } catch {
      return { kind: 'storage-error' };
    }
  };
}
