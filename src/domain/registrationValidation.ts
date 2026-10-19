import { MESSAGES } from './messages';
import type { RegistrationFieldErrors, RegistrationInput } from './registration';
import {
  DISPLAY_NAME_MAX_LENGTH,
  normalizeDisplayName,
  validateEmail,
  validatePassword,
} from './validation';

function validateDisplayName(displayName: string): string | undefined {
  const name = normalizeDisplayName(displayName);
  if (name === '') return MESSAGES.NAME_REQUIRED;
  if (name.length > DISPLAY_NAME_MAX_LENGTH) return MESSAGES.NAME_TOO_LONG;
  return undefined;
}

function validateConfirmation(password: string, confirmPassword: string): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_REQUIRED;
  // La contraseña no se recorta ni cambia de mayúsculas al compararla (FR-004, FR-005).
  if (confirmPassword !== password) return MESSAGES.CONFIRM_MISMATCH;
  return undefined;
}

/**
 * Reglas de FR-002 a FR-005. Las claves siguen el orden del formulario, que también define el
 * foco. Devuelve {} si la entrada es válida.
 */
export function validateRegistration(input: RegistrationInput): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};
  const displayName = validateDisplayName(input.displayName);
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  const confirmPassword = validateConfirmation(input.password, input.confirmPassword);
  if (displayName) errors.displayName = displayName;
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (confirmPassword) errors.confirmPassword = confirmPassword;
  if (!input.acceptedTerms) errors.acceptedTerms = MESSAGES.TERMS_REQUIRED;
  return errors;
}
