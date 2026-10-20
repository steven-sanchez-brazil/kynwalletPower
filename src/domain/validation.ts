import type { LoginCredentials, RegistrationData } from './auth';
import { MESSAGES } from './messages';

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const NAME_MAX_LENGTH = 100;
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

export function validateEmail(email: string): string | undefined {
  if (normalizeEmail(email) === '') return MESSAGES.EMAIL_REQUIRED;
  if (!isValidEmail(email)) return MESSAGES.EMAIL_INVALID;
  return undefined;
}

export function validatePassword(password: string): string | undefined {
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

export type RegistrationFormValues = RegistrationData & {
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirmPassword' | 'terms', string>
>;

function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (trimmed === '') return MESSAGES.NAME_REQUIRED;
  if (trimmed.length > NAME_MAX_LENGTH) return MESSAGES.NAME_TOO_LONG;
  return undefined;
}

function validateConfirmation(password: string, confirmPassword: string): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_REQUIRED;
  // La confirmación se compara sin recortar (FR-007).
  if (confirmPassword !== password) return MESSAGES.PASSWORD_MISMATCH;
  return undefined;
}

/** Reglas de FR-004 a FR-008. Devuelve {} si el registro es válido. */
export function validateRegistration(values: RegistrationFormValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = validateName(values.name);
  const email = validateEmail(values.email);
  // Al crear la contraseña, "vacía" tiene su propio mensaje (data-model.md).
  const password =
    values.password === '' ? MESSAGES.PASSWORD_CREATE_REQUIRED : validatePassword(values.password);
  const confirmPassword = validateConfirmation(values.password, values.confirmPassword);
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (confirmPassword) errors.confirmPassword = confirmPassword;
  if (!values.acceptedTerms) errors.terms = MESSAGES.TERMS_REQUIRED;
  return errors;
}
