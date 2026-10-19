export type RegistrationInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationCommand = {
  fullName: string;
  email: string;
  password: string;
  acceptedTerms: true;
};

export type RegisteredUserRecord = {
  email: string;
  displayName: string;
  passwordDigest: string;
  acceptedTerms: true;
  createdAt: string;
};

export type RegistrationResult =
  { kind: 'success' } | { kind: 'email-already-exists' } | { kind: 'storage-error' };

export type RegistrationFieldErrors = Partial<Record<keyof RegistrationInput, string>>;
