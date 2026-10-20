import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  isValidEmail,
} from './validation';
export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};
export type RegistrationError =
  | 'NAME_REQUIRED'
  | 'NAME_TOO_LONG'
  | 'EMAIL_REQUIRED'
  | 'EMAIL_INVALID'
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_LONG'
  | 'CONFIRM_REQUIRED'
  | 'PASSWORD_MISMATCH'
  | 'TERMS_REQUIRED';
export type RegistrationErrors = Partial<Record<keyof RegistrationValues, RegistrationError>>;
export const registrationFields = [
  'fullName',
  'email',
  'password',
  'confirmPassword',
  'acceptedTerms',
] as const;
export const emptyRegistration: RegistrationValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};
const length = (value: string) => Array.from(value).length;
function passwordError(value: unknown, required: RegistrationError): RegistrationError | undefined {
  if (typeof value !== 'string' || value === '') return required;
  if (length(value) < PASSWORD_MIN_LENGTH) return 'PASSWORD_TOO_SHORT';
  if (length(value) > PASSWORD_MAX_LENGTH) return 'PASSWORD_TOO_LONG';
  return undefined;
}
export function validateRegistration(input: unknown): RegistrationErrors {
  const values = (typeof input === 'object' && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  const errors: RegistrationErrors = {};
  if (typeof values.fullName !== 'string' || !values.fullName.trim())
    errors.fullName = 'NAME_REQUIRED';
  else if (length(values.fullName.trim()) > 100) errors.fullName = 'NAME_TOO_LONG';
  if (typeof values.email !== 'string' || !values.email.trim()) errors.email = 'EMAIL_REQUIRED';
  else if (
    length(values.email.trim()) > EMAIL_MAX_LENGTH ||
    !isValidEmail(values.email, 'registration')
  )
    errors.email = 'EMAIL_INVALID';
  const password = passwordError(values.password, 'PASSWORD_REQUIRED');
  if (password) errors.password = password;
  const confirmation = passwordError(values.confirmPassword, 'CONFIRM_REQUIRED');
  if (confirmation) errors.confirmPassword = confirmation;
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'PASSWORD_MISMATCH';
  if (values.acceptedTerms !== true) errors.acceptedTerms = 'TERMS_REQUIRED';
  return errors;
}
