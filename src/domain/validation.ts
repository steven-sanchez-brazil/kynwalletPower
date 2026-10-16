import type { LoginCredentials } from './auth';
import type { RegistrationErrors, RegistrationValues } from './registration';
import { MESSAGES, REGISTRATION_MESSAGES } from './messages';

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type CredentialErrors = Partial<Record<keyof LoginCredentials, string>>;

/** Normaliza un correo para validarlo y compararlo: sin espacios periféricos y en minúsculas. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(normalized);
}

export function isValidPasswordLength(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}

function validateEmail(email: string): string | undefined {
  if (normalizeEmail(email) === '') return MESSAGES.EMAIL_REQUIRED;
  if (!isValidEmail(email)) return MESSAGES.EMAIL_INVALID;
  return undefined;
}

function validatePassword(password: string): string | undefined {
  // La contraseña se valida sin recortar (FR-004).
  if (password === '') return MESSAGES.PASSWORD_REQUIRED;
  if (password.length < PASSWORD_MIN_LENGTH) return MESSAGES.PASSWORD_TOO_SHORT;
  if (password.length > PASSWORD_MAX_LENGTH) return MESSAGES.PASSWORD_TOO_LONG;
  return undefined;
}

/** Reglas de FR-003 y FR-004. Devuelve {} si las credenciales son válidas. */
export function validateCredentials({ email, password }: LoginCredentials): CredentialErrors {
  const errors: CredentialErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

/** Reglas de Registro: reutiliza los límites y la validación de credenciales del login. */
export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = { ...validateCredentials(values) };
  if (!values.fullName.trim()) errors.fullName = REGISTRATION_MESSAGES.NAME_REQUIRED;
  else if (values.fullName.trim().length > 80)
    errors.fullName = REGISTRATION_MESSAGES.NAME_TOO_LONG;
  if (!values.confirmPassword) errors.confirmPassword = REGISTRATION_MESSAGES.CONFIRM_REQUIRED;
  else if (values.confirmPassword.length > PASSWORD_MAX_LENGTH)
    errors.confirmPassword = REGISTRATION_MESSAGES.CONFIRM_TOO_LONG;
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = REGISTRATION_MESSAGES.CONFIRM_MISMATCH;
  if (values.termsAccepted !== true) errors.termsAccepted = REGISTRATION_MESSAGES.TERMS_REQUIRED;
  return errors;
}
