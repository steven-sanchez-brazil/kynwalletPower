import type { RegisterResult } from '@/domain/auth';
import type { RegistrationData } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (data: RegistrationData) => Promise<RegisterResult>;

/** Caso de uso: registra la cuenta normalizada delegando en el puerto de registro. */
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
