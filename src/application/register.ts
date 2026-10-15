import type { RegistrationData, RegistrationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (data: RegistrationData) => Promise<RegistrationResult>;

/** Caso de uso: crea la cuenta delegando en el puerto de registro (research.md R4). */
export function createRegister(gateway: RegistrationGateway): Register {
  return async ({ fullName, email, password }) => {
    try {
      return await gateway.register({
        email: normalizeEmail(email),
        password,
        displayName: fullName.trim(),
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
