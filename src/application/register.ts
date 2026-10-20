import type { RegisterResult, RegistrationData } from '@/domain/auth';
import { MESSAGES } from '@/domain/messages';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (data: RegistrationData) => Promise<RegisterResult>;

/** Caso de uso: registra un nuevo usuario delegando en el puerto RegistrationGateway. */
export function createRegister(gateway: RegistrationGateway): Register {
  return async (data) => {
    try {
      const normalizedData: RegistrationData = {
        ...data,
        fullName: data.fullName.trim(),
        email: normalizeEmail(data.email),
      };
      return await gateway.register(normalizedData);
    } catch {
      return {
        kind: 'unavailable',
        message: MESSAGES.UNAVAILABLE,
      };
    }
  };
}
