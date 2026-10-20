import type { LoginCredentials, RegistrationData, RegistrationValidationErrors } from './auth';
import { MESSAGES } from './messages';

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
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

function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  if (trimmed.length < FULL_NAME_MIN_LENGTH) return MESSAGES.FULL_NAME_REQUIRED;
  return undefined;
}

function validateConfirmPassword(confirmPassword: string, password: string): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  if (confirmPassword !== password) return MESSAGES.PASSWORDS_DO_NOT_MATCH;
  return undefined;
}

function validateTerms(termsAccepted: boolean): string | undefined {
  if (!termsAccepted) return MESSAGES.TERMS_REQUIRED;
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

/** Reglas de validación pura del formulario de registro (FR-003 a FR-007, data-model.md). */
export function validateRegistration(data: RegistrationData): RegistrationValidationErrors {
  const errors: RegistrationValidationErrors = {};
  const fullNameError = validateFullName(data.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(data.confirmPassword, data.password);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const termsError = validateTerms(data.termsAccepted);
  if (termsError) errors.termsAccepted = termsError;

  return errors;
}
