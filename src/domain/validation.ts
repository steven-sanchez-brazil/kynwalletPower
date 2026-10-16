import type { LoginCredentials, RegistrationData } from './auth';
import { MESSAGES } from './messages';

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 120;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type CredentialErrors = Partial<Record<keyof LoginCredentials, string>>;
export type RegistrationField = keyof RegistrationData;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

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

function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  if (trimmed.length < FULL_NAME_MIN_LENGTH) return MESSAGES.FULL_NAME_REQUIRED;
  if (trimmed.length > FULL_NAME_MAX_LENGTH) return MESSAGES.FULL_NAME_TOO_LONG;
  return undefined;
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

function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  if (confirmPassword !== password) return MESSAGES.PASSWORDS_DO_NOT_MATCH;
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

/** Reglas de validación de registro (FR-002, FR-003, FR-004). Devuelve {} si todos los campos son válidos. */
export function validateRegistration({
  fullName,
  email,
  password,
  confirmPassword,
  termsAccepted,
}: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const fullNameError = validateFullName(fullName);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

  if (fullNameError) errors.fullName = fullNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  if (!termsAccepted) errors.termsAccepted = MESSAGES.TERMS_REQUIRED;

  return errors;
}
