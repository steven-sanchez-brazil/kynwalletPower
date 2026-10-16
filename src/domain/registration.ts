export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};
export type RegistrationField = keyof RegistrationValues;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationResult =
  { kind: 'success' } | { kind: 'invalid'; errors: RegistrationErrors } | { kind: 'unavailable' };
