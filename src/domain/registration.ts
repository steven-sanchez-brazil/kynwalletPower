export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export type RegistrationField = keyof RegistrationValues;

export type RegistrationErrorCode =
  | 'NAME_REQUIRED'
  | 'NAME_LENGTH'
  | 'EMAIL_REQUIRED'
  | 'EMAIL_INVALID'
  | 'EMAIL_TOO_LONG'
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_LONG'
  | 'CONFIRMATION_REQUIRED'
  | 'PASSWORD_MISMATCH'
  | 'TERMS_REQUIRED';

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationResult = 'success' | 'unavailable';
