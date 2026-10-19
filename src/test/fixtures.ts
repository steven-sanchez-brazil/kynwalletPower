import type { DemoAccount } from '@/domain/auth';
import type { RegistrationInput } from '@/domain/registration';

/** Cuenta ficticia exclusiva de pruebas; no corresponde a ningún sistema real (research.md R4). */
export const TEST_ACCOUNT: DemoAccount = {
  email: 'steven.luna@example.test',
  password: 'fixture-pass-01',
  displayName: 'Steven Luna',
};

/** Datos ficticios de registro, distintos de TEST_ACCOUNT. */
export const NEW_REGISTRATION: RegistrationInput = {
  displayName: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
  confirmPassword: 'fixture-pass-02',
  acceptedTerms: true,
};
