import { MESSAGES } from './messages';
import { FULL_NAME_MAX_LENGTH, validateEmail, validatePassword } from './validation';

/** Datos del formulario de registro (data-model.md). */
export type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type RegistrationField = keyof RegistrationData;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationResult =
  { kind: 'success' } | { kind: 'email-taken' } | { kind: 'unavailable' };

/** Orden visual de los campos: define a cuál va el foco ante errores (FR-009). */
export const REGISTRATION_FIELDS: readonly RegistrationField[] = [
  'fullName',
  'email',
  'password',
  'confirmPassword',
  'acceptTerms',
];

function validateFullName(fullName: string): string | undefined {
  const name = fullName.trim();
  if (name === '') return MESSAGES.NAME_REQUIRED;
  if (name.length > FULL_NAME_MAX_LENGTH) return MESSAGES.NAME_TOO_LONG;
  return undefined;
}

function validateConfirmation(password: string, confirmPassword: string): string | undefined {
  // Comparación exacta, sin recortar (FR-006).
  if (confirmPassword === '') return MESSAGES.CONFIRM_REQUIRED;
  if (confirmPassword !== password) return MESSAGES.PASSWORD_MISMATCH;
  return undefined;
}

/** Reglas FR-003 a FR-007. Devuelve {} si los datos son válidos. */
export function validateRegistration(data: RegistrationData): RegistrationErrors {
  const candidates: RegistrationErrors = {
    fullName: validateFullName(data.fullName),
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    confirmPassword: validateConfirmation(data.password, data.confirmPassword),
    acceptTerms: data.acceptTerms ? undefined : MESSAGES.TERMS_REQUIRED,
  };
  const errors: RegistrationErrors = {};
  for (const field of REGISTRATION_FIELDS) {
    const error = candidates[field];
    if (error) errors[field] = error;
  }
  return errors;
}
