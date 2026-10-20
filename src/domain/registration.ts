export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};
export type RegistrationField = keyof RegistrationValues;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;
export type RegistrationRequest = Omit<RegistrationValues, 'confirmPassword' | 'acceptedTerms'> & {
  acceptedTerms: true;
};
export type FakeRegistrationResponse =
  { status: 201; body: { kind: 'created' } } | { status: 503; body: { kind: 'unavailable' } };
export type RegistrationResult =
  | { kind: 'validation-error'; errors: RegistrationErrors }
  | { kind: 'created' }
  | { kind: 'unavailable' };
export type DiagnosticEvent = {
  name: 'registration.completed' | 'registration.failed';
  outcome: 'created' | 'unavailable' | 'diagnostic-unavailable';
  durationMs: number;
};
export type RegistrationObserver = (event: DiagnosticEvent) => void;
