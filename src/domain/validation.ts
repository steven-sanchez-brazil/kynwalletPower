import type { LoginCredentials } from './auth';
import { MESSAGES } from './messages';
import type { RegistrationErrors, RegistrationRequest } from './registration';

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
const FULL_NAME_PATTERN = /^[\p{L}][\p{L}\p{M}' -]*$/u;
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

/** Nombre sin espacios periféricos y con los espacios internos colapsados. */
export function normalizeFullName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function isValidFullName(name: string): boolean {
  const normalized = normalizeFullName(name);
  return (
    normalized.length >= FULL_NAME_MIN_LENGTH &&
    normalized.length <= FULL_NAME_MAX_LENGTH &&
    FULL_NAME_PATTERN.test(normalized)
  );
}

function validateFullName(name: string): string | undefined {
  if (normalizeFullName(name) === '') return MESSAGES.NAME_REQUIRED;
  if (!isValidFullName(name)) return MESSAGES.NAME_INVALID;
  return undefined;
}

/** Política de contraseña nueva (FR-005): longitud, al menos una letra y un número. */
function validateNewPassword(password: string): string | undefined {
  if (password === '') return MESSAGES.REGISTER_PASSWORD_REQUIRED;
  if (password.length > PASSWORD_MAX_LENGTH) return MESSAGES.PASSWORD_TOO_LONG;
  const strong =
    password.length >= PASSWORD_MIN_LENGTH && /\p{L}/u.test(password) && /\d/.test(password);
  return strong ? undefined : MESSAGES.REGISTER_PASSWORD_WEAK;
}

function validateConfirmation(password: string, confirmation: string): string | undefined {
  if (confirmation === '') return MESSAGES.CONFIRM_REQUIRED;
  return confirmation === password ? undefined : MESSAGES.CONFIRM_MISMATCH;
}

/** Reglas FR-003 a FR-007. Devuelve {} si la solicitud es válida. */
export function validateRegistration(request: RegistrationRequest): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const checks: [keyof RegistrationRequest, string | undefined][] = [
    ['fullName', validateFullName(request.fullName)],
    ['email', validateEmail(request.email)],
    ['password', validateNewPassword(request.password)],
    ['confirmPassword', validateConfirmation(request.password, request.confirmPassword)],
    ['acceptedTerms', request.acceptedTerms ? undefined : MESSAGES.TERMS_REQUIRED],
  ];
  for (const [field, message] of checks) {
    if (message) errors[field] = message;
  }
  return errors;
}
