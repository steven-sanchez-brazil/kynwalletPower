import type { RegisterAccountInput, RegisterResult } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';
import type { AuthGateway } from './ports/AuthGateway';

export type RegisterAccount = (input: RegisterAccountInput) => Promise<RegisterResult>;

/** Caso de uso: registra una nueva cuenta delegando en el puerto de autenticación. */
export function createRegisterAccount(gateway: AuthGateway): RegisterAccount {
  return async ({ fullName, email, password }) => {
    try {
      if (!gateway.register) return { kind: 'unavailable' };
      return await gateway.register({
        fullName: fullName.trim(),
        email: normalizeEmail(email),
        password,
      });
    } catch {
      return { kind: 'unavailable' };
    }
  };
}
