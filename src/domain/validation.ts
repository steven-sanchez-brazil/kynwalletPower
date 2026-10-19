import type { LoginCredentials } from './auth';
import { MESSAGES } from './messages';
import type { RegistrationFieldErrors, RegistrationInput } from './registration';

export const FULL_NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_SPECIAL_CHAR = /[^A-Za-z0-9\s]/;

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

/** Verifica que la contraseña cumpla seguridad alta (FR-004): 8–128 caracteres, mayúscula, minúscula, número y especial. */
export function isStrongPassword(password: string): boolean {
  return (
    isValidPasswordLength(password) &&
    HAS_UPPERCASE.test(password) &&
    HAS_LOWERCASE.test(password) &&
    HAS_DIGIT.test(password) &&
    HAS_SPECIAL_CHAR.test(password)
  );
}

export function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  if (trimmed === '') return MESSAGES.FULL_NAME_REQUIRED;
  if (trimmed.length > FULL_NAME_MAX_LENGTH) return MESSAGES.FULL_NAME_TOO_LONG;
  return undefined;
}

export function validateEmail(email: string): string | undefined {
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

export function validateStrongPassword(password: string): string | undefined {
  if (password === '') return MESSAGES.PASSWORD_REQUIRED;
  if (password.length > PASSWORD_MAX_LENGTH) return MESSAGES.PASSWORD_TOO_LONG;
  if (!isStrongPassword(password)) return MESSAGES.PASSWORD_WEAK;
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  if (confirmPassword !== password) return MESSAGES.CONFIRM_PASSWORD_MISMATCH;
  if (!isStrongPassword(confirmPassword)) return MESSAGES.PASSWORD_WEAK;
  return undefined;
}

/** Reglas de FR-003 y FR-004 para Login. Devuelve {} si las credenciales son válidas. */
export function validateCredentials({ email, password }: LoginCredentials): CredentialErrors {
  const errors: CredentialErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

/** Reglas de FR-002 a FR-007 para Registro. Devuelve {} si todos los campos son válidos. */
export function validateRegistration({
  fullName,
  email,
  password,
  confirmPassword,
  acceptedTerms,
}: RegistrationInput): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};
  const fullNameError = validateFullName(fullName);
  const emailError = validateEmail(email);
  const passwordError = validateStrongPassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

  if (fullNameError) errors.fullName = fullNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  if (!acceptedTerms) errors.acceptedTerms = MESSAGES.TERMS_REQUIRED;

  return errors;
}
