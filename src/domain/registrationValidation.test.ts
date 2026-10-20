import { MESSAGES } from './messages';
import { normalizeRegistration, validateRegistration } from './registrationValidation';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';

describe('validateRegistration (FR-003–FR-006, FR-008, FR-011)', () => {
  it('FR-003: normaliza solo espacios periféricos de nombre y correo', () => {
    expect(
      normalizeRegistration({
        ...VALID_REGISTRATION,
        fullName: '  María del Pilar  ',
        email: '  MARIA@EXAMPLE.TEST ',
      }),
    ).toEqual({
      fullName: 'María del Pilar',
      email: 'maria@example.test',
      password: VALID_REGISTRATION.password,
    });
  });

  it.each([
    ['', MESSAGES.NAME_REQUIRED],
    ['   ', MESSAGES.NAME_REQUIRED],
    ['a'.repeat(81), MESSAGES.NAME_LENGTH],
  ])('FR-003: valida nombre %p', (fullName, message) => {
    expect(validateRegistration({ ...VALID_REGISTRATION, fullName }).fullName).toBe(message);
  });

  it('FR-003: acepta nombres de 1 y 80 caracteres y nombres compuestos', () => {
    expect(validateRegistration({ ...VALID_REGISTRATION, fullName: 'A' }).fullName).toBeUndefined();
    expect(
      validateRegistration({ ...VALID_REGISTRATION, fullName: 'Á'.repeat(80) }).fullName,
    ).toBeUndefined();
    expect(
      validateRegistration({ ...VALID_REGISTRATION, fullName: "María-José D'Angelo" }).fullName,
    ).toBeUndefined();
  });

  it.each([
    ['', MESSAGES.EMAIL_REQUIRED],
    ['usuario@', MESSAGES.EMAIL_INVALID],
    ['a'.repeat(245) + '@test.test', MESSAGES.EMAIL_TOO_LONG],
  ])('FR-004: valida correo %p', (email, message) => {
    expect(validateRegistration({ ...VALID_REGISTRATION, email }).email).toBe(message);
  });

  it.each([
    ['', MESSAGES.PASSWORD_REQUIRED],
    ['1234567', MESSAGES.PASSWORD_TOO_SHORT],
    ['x'.repeat(129), MESSAGES.PASSWORD_TOO_LONG],
  ])('FR-005: valida contraseña sin recortarla', (password, message) => {
    expect(
      validateRegistration({
        ...VALID_REGISTRATION,
        password,
        passwordConfirmation: password,
      }).password,
    ).toBe(message);
  });

  it('FR-005: conserva espacios y acepta límites 8 y 128', () => {
    for (const password of [' 123456 ', 'x'.repeat(128)]) {
      expect(
        validateRegistration({
          ...VALID_REGISTRATION,
          password,
          passwordConfirmation: password,
        }).password,
      ).toBeUndefined();
    }
  });

  it('FR-006/FR-008: exige confirmación exacta y términos', () => {
    expect(
      validateRegistration({ ...VALID_REGISTRATION, passwordConfirmation: '' })
        .passwordConfirmation,
    ).toBe(MESSAGES.CONFIRMATION_REQUIRED);
    expect(
      validateRegistration({ ...VALID_REGISTRATION, passwordConfirmation: 'distinta' })
        .passwordConfirmation,
    ).toBe(MESSAGES.PASSWORD_MISMATCH);
    expect(
      validateRegistration({ ...VALID_REGISTRATION, acceptedTerms: false }).acceptedTerms,
    ).toBe(MESSAGES.TERMS_REQUIRED);
  });

  it('FR-011: devuelve un mapa vacío para valores válidos', () => {
    expect(validateRegistration(VALID_REGISTRATION)).toEqual({});
  });
});
