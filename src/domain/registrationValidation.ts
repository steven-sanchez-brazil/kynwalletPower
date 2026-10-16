import {
  REGISTRATION_MESSAGES,
  type RegistrationErrors,
  type RegistrationInput,
} from './registration';
import { validateCredentials } from './validation';

export const FULL_NAME_MAX_LENGTH = 80;

/** Reglas REG-FR-005–010; comparte la política de credenciales con el login. */
export function validateRegistration(input: RegistrationInput): RegistrationErrors {
  const errors: RegistrationErrors = validateCredentials({
    email: typeof input?.email === 'string' ? input.email : '',
    password: typeof input?.password === 'string' ? input.password : '',
  });
  const fullName = typeof input?.fullName === 'string' ? input.fullName.trim() : '';

  if (fullName === '') errors.fullName = REGISTRATION_MESSAGES.FULL_NAME_REQUIRED;
  else if (fullName.length > FULL_NAME_MAX_LENGTH) {
    errors.fullName = REGISTRATION_MESSAGES.FULL_NAME_TOO_LONG;
  }

  if (typeof input?.confirmPassword !== 'string' || input.confirmPassword === '') {
    errors.confirmPassword = REGISTRATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  } else if (input.confirmPassword !== input.password) {
    errors.confirmPassword = REGISTRATION_MESSAGES.PASSWORD_MISMATCH;
  }

  if (input?.acceptedTerms !== true) errors.acceptedTerms = REGISTRATION_MESSAGES.TERMS_REQUIRED;
  return errors;
}
