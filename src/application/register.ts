import type { RegistrationRequest, RegistrationResult } from '@/domain/registration';
import { normalizeEmail, normalizeFullName, validateRegistration } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (request: RegistrationRequest) => Promise<RegistrationResult>;

/** Caso de uso: valida, normaliza y delega el registro en el puerto. */
export function createRegister(gateway: RegistrationGateway): Register {
  return async (request) => {
    const errors = validateRegistration(request);
    if (Object.keys(errors).length > 0) return { kind: 'invalid', errors };
    try {
      return await gateway.register({
        fullName: normalizeFullName(request.fullName),
        email: normalizeEmail(request.email),
        password: request.password,
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
