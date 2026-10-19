import type { RegistrationInput, RegistrationResult } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { normalizeDisplayName, normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type RegisterAccount = (input: RegistrationInput) => Promise<RegistrationResult>;

/** Evento de diagnóstico: solo un código fijo, nunca datos del formulario (Constitución 8.7). */
export type ReportDiagnostic = (event: { code: string }) => void;

export const REGISTER_FAILED_CODE = 'register-account-failed';

/** Caso de uso: valida, normaliza y delega el alta en el puerto de registro. */
export function createRegisterAccount(
  gateway: RegistrationGateway,
  report: ReportDiagnostic,
): RegisterAccount {
  return async (input) => {
    const errors = validateRegistration(input);
    if (Object.keys(errors).length > 0) return { kind: 'invalid', errors };

    try {
      return await gateway.register({
        email: normalizeEmail(input.email),
        password: input.password,
        displayName: normalizeDisplayName(input.displayName),
      });
    } catch {
      // No se registra el error original: podría contener la contraseña (Constitución 5.4, 5.5).
      report({ code: REGISTER_FAILED_CODE });
      return { kind: 'failure' };
    }
  };
}
