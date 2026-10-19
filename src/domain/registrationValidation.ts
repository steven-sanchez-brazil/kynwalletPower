import { MESSAGES } from './messages';
import type { RegistrationForm } from './registration';
import { validateEmail, validatePassword } from './validation';

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 80;
// Lista de permitidos (Constitución 5.1): letras Unicode separadas por espacio, apóstrofo, punto o guion.
const FULL_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:[ '’.-][\p{L}\p{M}]*)*$/u;

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

/** Recorta los extremos y colapsa los espacios internos del nombre. */
export function normalizeFullName(fullName: string): string {
  return fullName.trim().replace(/\s+/g, ' ');
}

function validateFullName(fullName: string): string | undefined {
  const name = normalizeFullName(fullName);
  if (name === '') return MESSAGES.FULL_NAME_REQUIRED;
  const validLength = name.length >= FULL_NAME_MIN_LENGTH && name.length <= FULL_NAME_MAX_LENGTH;
  if (!validLength || !FULL_NAME_PATTERN.test(name)) return MESSAGES.FULL_NAME_INVALID;
  return undefined;
}

function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (confirmPassword === '') return MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  if (confirmPassword !== password) return MESSAGES.PASSWORDS_DO_NOT_MATCH;
  return undefined;
}

/** Reglas FR-004 a FR-008. Devuelve {} si el formulario es válido. */
export function validateRegistration(form: RegistrationForm): RegistrationErrors {
  const candidates: RegistrationErrors = {
    fullName: validateFullName(form.fullName),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    acceptedTerms: form.acceptedTerms ? undefined : MESSAGES.TERMS_REQUIRED,
  };
  return Object.fromEntries(
    Object.entries(candidates).filter(([, message]) => message !== undefined),
  ) as RegistrationErrors;
}
