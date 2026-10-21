import { MESSAGES } from './messages';
import {
  isValidEmail,
  normalizeEmail,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './validation';

export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

const NAME_PATTERN = /^\p{L}[\p{L}\p{M} '\u2019-]*\p{L}$/u;

/** Fuente única de reglas para el registro. Mantiene el orden visual de los errores. */
export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = values.fullName.trim();
  if (!name) errors.fullName = MESSAGES.NAME_REQUIRED;
  else if (name.length < 2 || name.length > 100 || !NAME_PATTERN.test(name)) {
    errors.fullName = MESSAGES.NAME_INVALID;
  }

  if (!normalizeEmail(values.email)) errors.email = MESSAGES.EMAIL_REQUIRED;
  else if (!isValidEmail(values.email)) errors.email = MESSAGES.EMAIL_INVALID;

  if (!values.password) errors.password = MESSAGES.PASSWORD_REQUIRED;
  else if (values.password.length < PASSWORD_MIN_LENGTH)
    errors.password = MESSAGES.PASSWORD_TOO_SHORT;
  else if (values.password.length > PASSWORD_MAX_LENGTH)
    errors.password = MESSAGES.PASSWORD_TOO_LONG;

  if (!values.confirmPassword) errors.confirmPassword = MESSAGES.CONFIRM_REQUIRED;
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = MESSAGES.CONFIRM_MISMATCH;

  if (!values.acceptedTerms) errors.acceptedTerms = MESSAGES.TERMS_REQUIRED;
  return errors;
}
