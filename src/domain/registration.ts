import { MESSAGES } from './messages';
import { FULL_NAME_MAX_LENGTH, validateEmail, validatePassword } from './validation';

export type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export type RegistrationField = keyof RegistrationData;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

/** Orden de los campos en el formulario: define a cuál va el foco ante errores (FR-009). */
export const REGISTRATION_FIELDS: readonly RegistrationField[] = [
  'fullName',
  'email',
  'password',
  'passwordConfirmation',
  'acceptedTerms',
];

function validateFullName(fullName: string): string | undefined {
  const name = fullName.trim();
  if (name === '') return MESSAGES.FULL_NAME_REQUIRED;
  if (name.length > FULL_NAME_MAX_LENGTH) return MESSAGES.FULL_NAME_TOO_LONG;
  return undefined;
}

function validateConfirmation(password: string, confirmation: string): string | undefined {
  if (confirmation === '') return MESSAGES.PASSWORD_CONFIRMATION_REQUIRED;
  if (confirmation !== password) return MESSAGES.PASSWORDS_DO_NOT_MATCH;
  return undefined;
}

/** Reglas de FR-003 a FR-007. Devuelve {} si la solicitud es válida. */
export function validateRegistration(data: RegistrationData): RegistrationErrors {
  const candidates: RegistrationErrors = {
    fullName: validateFullName(data.fullName),
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    passwordConfirmation: validateConfirmation(data.password, data.passwordConfirmation),
    acceptedTerms: data.acceptedTerms ? undefined : MESSAGES.TERMS_REQUIRED,
  };
  const errors: RegistrationErrors = {};
  for (const field of REGISTRATION_FIELDS) {
    const message = candidates[field];
    if (message) errors[field] = message;
  }
  return errors;
}
