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
  createdAt?: string;
};

export interface RegistrationData {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly termsAccepted: boolean;
}

export interface RegistrationValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  global?: string;
}

export type RegisterResult =
  | {
      readonly kind: 'success';
      readonly account: { readonly email: string; readonly displayName: string };
    }
  | { readonly kind: 'validation-error'; readonly errors: RegistrationValidationErrors }
  | { readonly kind: 'email-already-registered'; readonly message: string }
  | { readonly kind: 'unavailable'; readonly message: string };
