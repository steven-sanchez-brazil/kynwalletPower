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
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

export type RegisterAccountInput = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | { kind: 'success'; displayName: string }
  | { kind: 'email-already-exists' }
  | { kind: 'unavailable' };
