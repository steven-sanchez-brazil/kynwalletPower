export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResult =
  | { kind: 'success'; displayName: string }
  | { kind: 'invalid-credentials' }
  | { kind: 'unavailable' };

export type DemoAccount = {
  email: string;
  password: string;
  displayName: string;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationResult =
  { kind: 'success'; displayName: string } | { kind: 'email-taken' } | { kind: 'unavailable' };
