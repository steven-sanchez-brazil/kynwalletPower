/** Datos del formulario de registro (data-model.md). */
export type RegistrationForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationResult =
  { kind: 'success' } | { kind: 'email-taken' } | { kind: 'unavailable' };
