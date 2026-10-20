import { MESSAGES } from './messages';
import type { RegistrationErrors, RegistrationValues } from './registration';
import {
  EMAIL_MAX_LENGTH,
  isValidEmail,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './validation';

export const NAME_MAX_LENGTH = 80;

export type NormalizedRegistration = Pick<RegistrationValues, 'fullName' | 'email' | 'password'>;

export function normalizeRegistration(values: RegistrationValues): NormalizedRegistration {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
}

export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = values.fullName.trim();
  const email = values.email.trim();

  if (!name) errors.fullName = MESSAGES.NAME_REQUIRED;
  else if (name.length > NAME_MAX_LENGTH) errors.fullName = MESSAGES.NAME_LENGTH;

  if (!email) errors.email = MESSAGES.EMAIL_REQUIRED;
  else if (email.length > EMAIL_MAX_LENGTH) errors.email = MESSAGES.EMAIL_TOO_LONG;
  else if (!isValidEmail(email)) errors.email = MESSAGES.EMAIL_INVALID;

  if (!values.password) errors.password = MESSAGES.PASSWORD_REQUIRED;
  else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = MESSAGES.PASSWORD_TOO_SHORT;
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = MESSAGES.PASSWORD_TOO_LONG;
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = MESSAGES.CONFIRMATION_REQUIRED;
  } else if (values.passwordConfirmation !== values.password) {
    errors.passwordConfirmation = MESSAGES.PASSWORD_MISMATCH;
  }

  if (!values.acceptedTerms) errors.acceptedTerms = MESSAGES.TERMS_REQUIRED;
  return errors;
}
