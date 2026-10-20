import type { DemoAccount, RegistrationData } from '@/domain/auth';

/** Cuenta ficticia exclusiva de pruebas; no corresponde a ningún sistema real (research.md R4). */
export const TEST_ACCOUNT: DemoAccount = {
  email: 'steven.luna@example.test',
  password: 'fixture-pass-01',
  displayName: 'Steven Luna',
};

/** Datos ficticios de registro; el correo NO coincide con ninguna cuenta de prueba. */
export const REGISTRATION_DATA: RegistrationData = {
  name: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
};
