export type RegistrationRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationRequest, string>>;

export type RegistrationResult =
  | { kind: 'created'; displayName: string }
  | { kind: 'invalid'; errors: RegistrationErrors }
  | { kind: 'rejected' }
  | { kind: 'unavailable' };
