import type { DemoAccount, RegistrationData } from '@/domain/auth';

/** Cuenta ficticia exclusiva de pruebas; no corresponde a ningún sistema real (research.md R4). */
export const TEST_ACCOUNT: DemoAccount = {
  email: 'steven.luna@example.test',
  password: 'fixture-pass-01',
  displayName: 'Steven Luna',
};

/** Datos ficticios de registro para pruebas. */
export const TEST_REGISTRATION_DATA: RegistrationData = {
  fullName: 'Carlos Mendoza',
  email: 'carlos.mendoza@example.test',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  termsAccepted: true,
};
