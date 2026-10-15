import type { DemoAccount } from '@/domain/auth';

/** Cuenta ficticia exclusiva de pruebas; no corresponde a ningún sistema real (research.md R4). */
export const TEST_ACCOUNT: DemoAccount = {
  email: 'steven.luna@example.test',
  password: 'fixture-pass-01',
  displayName: 'Steven Luna',
};

/** Solicitud de registro válida y ficticia (research.md R8). */
export const VALID_REGISTRATION = {
  fullName: 'Nueva Persona',
  email: 'nueva.persona@example.test',
  password: 'fixture-pass-02',
  confirmPassword: 'fixture-pass-02',
  acceptedTerms: true,
};
