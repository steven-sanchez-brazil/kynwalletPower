import type { RegistrationData, RegistrationResult } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (data: RegistrationData) => Promise<RegistrationResult>;

/** Caso de uso: registra una cuenta delegando en el puerto de registro. */
export function createRegister(gateway: RegistrationGateway): Register {
  return async ({ name, email, password }) => {
    try {
      return await gateway.register({
        name: name.trim(),
        email: normalizeEmail(email),
        password,
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
