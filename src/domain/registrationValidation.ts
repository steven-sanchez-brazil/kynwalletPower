import { MESSAGES } from './messages';
import type { RegistrationErrors } from './registration';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  normalizeEmail,
  validateCredentials,
  isValidPasswordLength,
} from './validation';

export function validateRegistration(input: unknown): RegistrationErrors {
  const values = (typeof input === 'object' && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  const fullName = typeof values.fullName === 'string' ? values.fullName.trim() : '';
  const email = typeof values.email === 'string' ? values.email : '';
  const password = typeof values.password === 'string' ? values.password : '';
  const confirmation = typeof values.confirmPassword === 'string' ? values.confirmPassword : '';
  const errors: RegistrationErrors = validateCredentials({ email, password });
  if (!fullName) errors.fullName = MESSAGES.NAME_REQUIRED;
  else if (fullName.length > 100) errors.fullName = MESSAGES.NAME_TOO_LONG;
  if (normalizeEmail(email).length > EMAIL_MAX_LENGTH) errors.email = MESSAGES.EMAIL_TOO_LONG;
  if (!confirmation) errors.confirmPassword = MESSAGES.CONFIRM_REQUIRED;
  else if (!isValidPasswordLength(confirmation))
    errors.confirmPassword =
      confirmation.length < PASSWORD_MIN_LENGTH
        ? MESSAGES.PASSWORD_TOO_SHORT
        : MESSAGES.PASSWORD_TOO_LONG;
  else if (confirmation !== password) errors.confirmPassword = MESSAGES.PASSWORD_MISMATCH;
  if (values.acceptedTerms !== true) errors.acceptedTerms = MESSAGES.TERMS_REQUIRED;
  return errors;
}
